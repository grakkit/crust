const framework = core.import('grakkit/framework');

const API = framework.object(
   framework.entries({
      // Entity Enums
      /*
      aaPickupRule: {
         source: Java.type('org.bukkit.entity.AbstractArrow.PickupRule')
      },
      aaPickupStatus: {
         source: Java.type('org.bukkit.entity.AbstractArrow.PickupStatus')
      },
      catType: {
         source: Java.type('org.bukkit.entity.Cat.Type')
      },
      edPhase: {
         source: Java.type('org.bukkit.entity.EnderDragon.Phase')
      },
      */
      entityType: {
         source: Java.type('org.bukkit.entity.EntityType'),
         consumer: (value) => (value.name() === 'UNKNOWN' ? undefined : value.getKey().getKey())
      },
      /*
      eoSpawnReason: {
         source: Java.type('org.bukkit.entity.ExperienceOrb.SpawnReason')
      },
      evokerSpell: {
         source: Java.type('org.bukkit.entity.Evoker.Spell')
      },
      foxType: {
         source: Java.type('org.bukkit.entity.Fox.Type')
      },
      horseColor: {
         source: Java.type('org.bukkit.entity.Horse.Color')
      },
      horseStyle: {
         source: Java.type('org.bukkit.entity.Horse.Style')
      },
      horseVariant: {
         source: Java.type('org.bukkit.entity.Horse.Variant')
      },
      llamaColor: {
         source: Java.type('org.bukkit.entity.Llama.Color')
      },
      mcVariant: {
         source: Java.type('org.bukkit.entity.MushroomCow.Variant')
      },
      ocelotType: {
         source: Java.type('org.bukkit.entity.Ocelot.Type')
      },
      pandaGene: {
         source: Java.type('org.bukkit.entity.Panda.Gene')
      },
      parrotVariant: {
         source: Java.type('org.bukkit.entity.Parrot.Variant')
      },
      pose: {
         source: Java.type('org.bukkit.entity.Pose')
      },
      rabbitType: {
         source: Java.type('org.bukkit.entity.Rabbit.Type')
      },
      spellcasterSpell: {
         source: Java.type('org.bukkit.entity.Spellcaster.Spell')
      },
      ssType: {
         source: Java.type('org.bukkit.entity.Skeleton.SkeletonType')
      },
      tfPattern: {
         source: Java.type('org.bukkit.entity.TropicalFish.Pattern')
      },
      villagerProfession: {
         source: Java.type('org.bukkit.entity.Villager.Profession')
      },
      villagerType: {
         source: Java.type('org.bukkit.entity.Villager.Type')
      },
      */

      // Inventory Enums
      /*
      clickType: {
         source: Java.type('org.bukkit.event.inventory.ClickType')
      },
      dragType: {
         source: Java.type('org.bukkit.event.inventory.DragType')
      },
      */
      equipmentSlot: {
         source: Java.type('org.bukkit.inventory.EquipmentSlot')
      },
      /*
      inventoryAction: {
         source: Java.type('org.bukkit.event.inventory.InventoryAction')
      },
      iceReason: {
         source: Java.type('org.bukkit.event.inventory.InventoryCloseEvent.Reason')
      },
      inventoryType: {
         source: Java.type('org.bukkit.event.inventory.InventoryType')
      },
      itSlotType: {
         source: Java.type('org.bukkit.event.inventory.InventoryType.SlotType')
      },
      ivProperty: {
         source: Java.type('org.bukkit.inventory.InventoryView.Property')
      },
      */
      itemFlag: {
         source: Java.type('org.bukkit.inventory.ItemFlag')
      },
      /*
      mainHand: {
         source: Java.type('org.bukkit.inventory.MainHand')
      },
      */

      // Item Enums
      attribute: {
         source: Java.type('org.bukkit.attribute.Attribute')
      },
      amOperation: {
         source: Java.type('org.bukkit.attribute.AttributeModifier.Operation')
      },
      /*
      bmGeneration: {
         source: Java.type('org.bukkit.inventory.meta.BookMeta.Generation')
      },
      */
      enchantment: {
         source: Java.type('org.bukkit.enchantments.Enchantment'),
         consumer: (value) => value.getKey().getKey()
      },
      /*
      enchantmentTarget: {
         source: Java.type('org.bukkit.enchantments.EnchantmentTarget')
      },
      */
      material: {
         source: Java.type('org.bukkit.Material'),
         consumer: (value) => (value.isLegacy() ? undefined : value.getKey().getKey())
      },

      // Component Enums
      /*
      ceAction: {
         source: Java.type('net.md_5.bungee.api.chat.ClickEvent.Action')
      },
      chatColor: {
         source: Java.type('net.md_5.bungee.api.ChatColor')
      },
      heAction: {
         source: Java.type('net.md_5.bungee.api.chat.HoverEvent.Action')
      }
      */

      // Other Enums
      gameMode: {
         source: Java.type('org.bukkit.GameMode')
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

import * as item from './library/item.min.js';
import * as entity from './library/entity.min.js';

const wrappers = {
   item: item.wrapper(framework, API),
   entity: entity.wrapper(framework, API)
};

const chainers = {
   item: item.chainer(framework, API),
   entity: entity.chainer(framework, API)
};

const links = {
   item: item.links,
   entity: entity.links
};

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
                  const event = args[0];
                  const cancellable = event instanceof Java.type('org.bukkit.event.Cancellable');
                  const player = event instanceof Java.type('org.bukkit.event.player.PlayerEvent');
                  switch (typeof condition) {
                     case 'boolean':
                        if (cancellable && condition === event.isCancelled()) ready = false;
                        break;
                     case 'function':
                        if (!condition(...args)) ready = false;
                        break;
                     case 'object':
                        if (!framework.match(framework.access(event), condition)) ready = false;
                        break;
                     case 'string':
                        /*
                        const prefix = condition[0];
                        const suffix = condition.slice(1);
                        switch (prefix) {
                           case '~':
                              break;
                           case '!':
                              break;
                           case '@':
                              break;
                           case '#':
                              break;
                           case '%':
                              break;
                           case '?':
                              break;
                           default:
                              break;
                        }
                        */
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
   return framework.extend(output, {
      get one () {
         return instance;
      }
   });
};

const all = (type, ...instances) => {
   const that = chainers[type](...instances.map((instance) => wrappers[type](instance)));
   return framework.extend(that, {
      get first () {
         return instances[0];
      },
      forEach: (script) => {
         return instances.forEach(script);
      },
      get last () {
         return instances.slice(-1)[0];
      }
   });
};

export function $ (object, ...args) {
   if (object !== null) {
      switch (typeof object) {
         case 'string':
            const prefix = object[0];
            const suffix = object.slice(1);
            switch (prefix) {
               case '~':
                  return null;
               case '!':
                  return one('item', new (Java.type('org.bukkit.inventory.ItemStack'))(API.material[suffix]));
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
                  return $(`~${suffix}`);
            }
         case 'object':
            if (object instanceof Java.type('org.bukkit.block.Block')) {
               //return wrappers.block(core.access(instance));
            } else if (object instanceof Java.type('org.bukkit.entity.Entity')) {
               return one('entity', object);
            } else if (object instanceof Java.type('org.bukkit.inventory.ItemStack')) {
               return one('item', object);
            } else if (object instanceof Java.type('org.bukkit.inventory.Inventory')) {
               //return wrappers.inventory(core.access(instance));
            } else if (object instanceof Java.type('org.bukkit.Location')) {
               //return wrappers.location(core.access(instance));
            } else if (object instanceof Java.type('org.bukkit.World')) {
               //return wrappers.world(core.access(instance));
            }
            break;
      }
   }
}

core.export(Object.assign($, API));
