import * as block from './library/block.min.js';
import * as entity from './library/entity.min.js';
import * as item from './library/item.min.js';
import * as location from './library/location.min.js';
import * as vector from './library/vector.min.js';
import * as tools from './library/tools.min.js';

const Block = Java.type('org.bukkit.block.Block');
const Vector = Java.type('org.bukkit.util.Vector');
const Entity = Java.type('org.bukkit.entity.Entity');
const Location = Java.type('org.bukkit.Location');
const ItemStack = Java.type('org.bukkit.inventory.ItemStack');

const _ = core.import('grakkit/framework');
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
                  if ($[suffix]) {
                     return $[suffix];
                  } else {
                     $[suffix] = _.object(_.array(Java.type(suffix).values()), (value) => {
                        if (!args[0] || !args[0](value)) {
                           let name = '';
                           if (args[1]) name = args[1](value);
                           else if (typeof value.getKey === 'function') name = value.getKey().getKey();
                           else name = _.lower(value.name());
                           return { [name]: value, [value]: name };
                        }
                     });
                     const words = [];
                     let index = -1;
                     suffix.split('.').forEach((node) => {
                        node.split('').map((char) => {
                           if (char === _.upper(char)) words[++index] = char;
                           else if (words[index]) words[index] += char;
                        });
                        ++index;
                     });
                     const terms = _.flat(words);
                     let key = '';
                     if (terms.length < 3) key = _.camel(terms.join(' '), ' ');
                     else if (terms.length === 3) key = _.lower(terms[0][0] + terms[1][0]) + terms[2];
                     else key = _.lower(terms.slice(0, -2).map((term) => term[0]).join('')) + terms.slice(-2).join('');
                     return ($[key] = $[suffix]);
                  }
               case '!':
                  const item = ItemStack($.material[suffix]);
                  return one('item', item.ensureServerConversions());
               case '@':
                  const context = args[0] || server.getConsoleSender();
                  return all('entity', ..._.array(server.selectEntities(context, object)));
               case '#':
                  return core.data(suffix, args[0]);
               case '?':
                  const location = args[0] || (self && self.getLocation());
                  return one('entity', location.getWorld().spawnEntity(location, $.entityType[suffix]));
               case '*':
                  return event.on(suffix);
               case '/':
                  return command.on(suffix);
               case '+':
                  return all(suffix, ...args);
               case '-':
                  switch (toString.apply(args[0])) {
                     case '[object Object]':
                        switch (toString.apply(args[0].instance)) {
                           case '[object Function]':
                              return args[0].instance();
                           case '[foreign HostObject]':
                              return args[0].instance;
                           default:
                              return args[0];
                        }
                     case '[foreign HostObject]':
                        return args[0];
                     default:
                        return null;
                  }
               default:
                  return _.player(object);
            }
         case 'object':
            if (object instanceof Block) {
               return one('block', object);
            } else if (object instanceof Entity) {
               return one('entity', object);
            } else if (object instanceof ItemStack) {
               return one('item', object);
            } else if (object instanceof Location) {
               return one('location', object);
            } else if (object instanceof Vector) {
               return one('vector', object);
            } else if (object.constructor === Array) {
               const thing = $('-', object[0]);
               if ([ null, undefined ].includes(thing)) {
                  return thing;
               } else if (thing.constructor === Object) {
                  return jx[thing.format].parser(thing);
               } else if (toString.apply(thing) === '[foreign HostObject]') {
                  return $(thing).serialize();
               } else {
                  return null;
               }
            } else {
               return null;
            }
      }
   }
};

$('~org.bukkit.GameMode');
$('~org.bukkit.boss.BarFlag');
$('~org.bukkit.boss.BarColor');
$('~org.bukkit.boss.BarStyle');
$('~org.bukkit.block.BlockFace');
$('~org.bukkit.inventory.ItemFlag');
$('~org.bukkit.inventory.EquipmentSlot');
$('~org.bukkit.enchantments.Enchantment');
$('~org.bukkit.attribute.AttributeModifier.Operation');
$('~org.bukkit.Material', (value) => value.isLegacy());
$('~org.bukkit.entity.EntityType', (value) => value.name() === 'UNKNOWN');
$('~org.bukkit.attribute.Attribute', null, (value) => value.getKey().getKey().split('.')[1]);
$('~org.bukkit.potion.PotionEffectType', null, (value) => value.getHandle().c().split('.')[2]);

const builder = tools.builder(_, $);
const command = tools.command(_, $);
const event = tools.event(_, $);

const jx = {
   block: builder(block),
   entity: builder(entity),
   item: builder(item),
   location: builder(location),
   vector: builder(vector)
};

const one = (type, instance) => {
   const that = jx[type].chainer(jx[type].wrapper(instance));
   const output = _.object(jx[type].links, (link) => {
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
   const that = jx[type].chainer(...instances.map((instance) => jx[type].wrapper(instance)));
   return _.extend(
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
