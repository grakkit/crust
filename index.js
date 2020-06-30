const framework = core.import('grakkit/framework');

const API = framework.object(
   framework.entries({
      action: {
         source: Java.type('org.bukkit.event.block.Action')
      },
      attribute: {
         source: Java.type('org.bukkit.attribute.Attribute')
      },
      amOperation: {
         source: Java.type('org.bukkit.attribute.AttributeModifier.Operation')
      },
      blockFace: {
         source: Java.type('org.bukkit.block.BlockFace')
      },
      enchantment: {
         source: Java.type('org.bukkit.enchantments.Enchantment'),
         consumer: (value) => value.getKey().getKey()
      },
      entityType: {
         source: Java.type('org.bukkit.entity.EntityType'),
         consumer: (value) => (value.name() === 'UNKNOWN' ? undefined : value.getKey().getKey())
      },
      equipmentSlot: {
         source: Java.type('org.bukkit.inventory.EquipmentSlot')
      },
      gameMode: {
         source: Java.type('org.bukkit.GameMode')
      },
      itemFlag: {
         source: Java.type('org.bukkit.inventory.ItemFlag')
      },
      material: {
         source: Java.type('org.bukkit.Material'),
         consumer: (value) => (value.isLegacy() ? undefined : value.getKey().getKey())
      },
      peType: {
         source: Java.type('org.bukkit.potion.PotionEffectType'),
         consumer: (value) => value.getHandle().c().split('.')[2]
      }
   }),
   (entry) => {
      return {
         [entry.key]: framework.object(framework.array(entry.value.source.values()), (value) => {
            const consumer = entry.value.consumer || ((value) => value.name().toLowerCase());
            return { [consumer(value)]: value };
         })
      };
   }
);

const command = {
   on: (name) => {
      let tab = () => [];
      let run = () => {};
      const that = {
         tab: (handler) => {
            tab = handler;
            return that;
         },
         run: (handler) => {
            run = handler;
            return that;
         }
      };
      core.command({
         name: name,
         execute: (...args) => run(...args),
         tabComplete: (player, ...args) => tab(player, args.length, ...args) || []
      });
      return that;
   }
};

const event = {
   on: (shortcut) => {
      const prefixes = [];
      let index = event.version;
      while (index < 3) {
         prefixes.push(...event.prefixes[index++]);
      }
      let type = undefined;
      const suffix = `${framework.pascal(shortcut)}Event`;
      prefixes.forEach((prefix) => {
         if (type === undefined) {
            try {
               Java.type(`${prefix}.${suffix}`);
               type = `${prefix}.${suffix}`;
            } catch (error) {}
         }
      });
      if (type === undefined) {
         throw 'EventError: That event does not exist!';
      } else {
         const conditions = [];
         const listeners = [];
         const that = {
            if: (condition) => {
               conditions.push(condition);
               return that;
            },
            do: (listener) => {
               listeners.push(listener);
               return that;
            }
         };
         core.event(type, (...args) => {
            listeners.forEach((listener) => {
               let ready = true;
               conditions.forEach((condition) => {
                  const event = framework.access(args[0]);
                  const cancellable = args[0] instanceof Java.type('org.bukkit.event.Cancellable');
                  switch (typeof condition) {
                     case 'boolean':
                        if (cancellable && condition === args[0].isCancelled()) ready = false;
                        break;
                     case 'function':
                        if (!condition(...args)) ready = false;
                        break;
                     case 'object':
                        if (!framework.match(event, condition)) ready = false;
                        break;
                  }
               });
               if (ready) {
                  listener(...args);
               }
            });
         });
         return that;
      }
   },
   prefixes: [
      [
         'com.destroystokyo.paper.event.block',
         'com.destroystokyo.paper.event.entity',
         'com.destroystokyo.paper.event.executor',
         'com.destroystokyo.paper.event.player',
         'com.destroystokyo.paper.event.profile',
         'com.destroystokyo.paper.event.server'
      ],
      [ 'org.spigotmc.event.entity', 'org.spigotmc.event.player' ],
      [
         'org.bukkit.event.block',
         'org.bukkit.event.command',
         'org.bukkit.event.enchantment',
         'org.bukkit.event.entity',
         'org.bukkit.event.hanging',
         'org.bukkit.event.inventory',
         'org.bukkit.event.player',
         'org.bukkit.event.raid',
         'org.bukkit.event.server',
         'org.bukkit.event.vehicle',
         'org.bukkit.event.weather',
         'org.bukkit.event.world'
      ]
   ],
   version: (() => {
      let version = 0;
      try {
         Java.type('com.destroystokyo.paper.event.player.IllegalPacketEvent');
      } catch (error) {
         version = 1;
         try {
            Java.type('org.spigotmc.event.player.PlayerSpawnLocationEvent');
         } catch (error) {
            version = 2;
         }
      }
      return version;
   })()
};

const $ = (object, ...args) => {
   if ([ null, undefined ].includes(object)) {
      return object;
   } else {
      switch (typeof object) {
         case 'string':
            const prefix = object[0];
            const suffix = object.slice(1);
            switch (prefix) {
               case '~':
                  return eval(suffix);
               case '!':
                  const item = new (Java.type('org.bukkit.inventory.ItemStack'))(API.material[suffix]);
                  return one('item', item.ensureServerConversions());
               case '@':
                  const context = args[0] || server.getConsoleSender();
                  return all('entity', ...framework.array(server.selectEntities(context, object)));
               case '#':
                  return core.data(suffix, args[0]);
               case '?':
                  return one('entity', args[0].world.spawnEntity(args[0], API.entityType[suffix]));
               case '*':
                  return event.on(suffix);
               case '/':
                  return command.on(suffix);
               default:
                  return _.player(object);
            }
         case 'object':
            if (object instanceof Java.type('org.bukkit.block.Block')) {
               return one('block', object);
            } else if (object instanceof Java.type('org.bukkit.entity.Entity')) {
               return one('entity', object);
            } else if (object instanceof Java.type('org.bukkit.inventory.ItemStack')) {
               return one('item', object);
            } else if (object.constructor === Array) {
               if ([ null, undefined ].includes(object[0])) {
                  return object[0];
               } else if (object[0].constructor === Object) {
                  return parsers[object[0].format](object[0]);
               } else if (typeof object === 'object') {
                  return $(object[0]).serialize();
               } else {
                  return null;
               }
            } else {
               return null;
            }
      }
   }
};

Object.assign($, API);

import * as block from './library/block.min.js';
import * as entity from './library/entity.min.js';
import * as item from './library/item.min.js';

const wrappers = {
   block: block.wrapper(framework, $),
   entity: entity.wrapper(framework, $),
   item: item.wrapper(framework, $)
};

const chainers = {
   block: block.chainer(framework, $),
   entity: entity.chainer(framework, $),
   item: item.chainer(framework, $)
};

const parsers = {
   block: block.parser(framework, $),
   entity: entity.parser(framework, $),
   item: item.parser(framework, $)
};

const links = {
   block: block.links,
   entity: entity.links,
   item: item.links
};

const one = (type, instance) => {
   const that = chainers[type](wrappers[type](instance));
   const output = framework.object(links[type], (link) => {
      return {
         [link]: (...args) => {
            const result = that[link](...args);
            return that === result ? output : result[0];
         }
      };
   });
   return output;
};

const all = (type, ...instances) => {
   const that = chainers[type](...instances.map((instance) => wrappers[type](instance)));
   return framework.extend(
      that,
      ...Object.getOwnPropertyNames(Array.prototype).map((key) => {
         const value = Array.prototype[key];
         if (typeof value === 'function') {
            return { [key]: (...args) => value.apply(instances, args) };
         }
      })
   );
};

core.export($);
