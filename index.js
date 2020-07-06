try {
   Java.type('com.destroystokyo.paper.Title');
} catch (error) {
   throw 'You must have paper installed to use JX!';
}

import { _ } from './library/framework.min.js';
import * as tools from './library/tools.min.js';

import * as block from './library/block.min.js';
import * as entity from './library/entity.min.js';
import * as item from './library/item.min.js';
import * as location from './library/location.min.js';
import * as vector from './library/vector.min.js';

const Block = Java.type('org.bukkit.block.Block');
const Entity = Java.type('org.bukkit.entity.Entity');
const Vector = Java.type('org.bukkit.util.Vector');
const Location = Java.type('org.bukkit.Location');
const ItemStack = Java.type('org.bukkit.inventory.ItemStack');

const $ = (object, ...args) => {
   if (_.def(object)) {
      switch (typeof object) {
         case 'string':
            const prefix = object[0];
            const suffix = object.slice(1);
            switch (prefix) {
               case '~':
                  return $[suffix] || _.extend($, bridge(suffix, ...args));
               case '!':
                  return $(new ItemStack($('+').fronts('material')[suffix]).ensureServerConversions());
               case '@':
                  return $([ ...server.selectEntities(args[0] || server.getConsoleSender(), object) ]);
               case '#':
                  return core.data(suffix, args[0]);
               case '?':
                  const location = args[0] || self.getLocation();
                  return $(location.getWorld().spawnEntity(location, $('+').fronts('entityType')[suffix]));
               case '*':
                  return event.on(suffix);
               case '/':
                  return command.on(suffix);
               case '+':
                  return utility;
               default:
                  return null;
            }
         case 'object':
            if (object === null) return null;
            const input = _.iterable(object) ? object[0] : object;
            if (typeof input.format === 'string') {
               const library = jx[input.format];
               if (library) return _.iterable(object) ? [ ...object ].map($) : library.parser(object);
               else return null;
            } else if (input instanceof Block) {
               return receiver('block', object, jx);
            } else if (input instanceof Entity) {
               return receiver('entity', object, jx);
            } else if (input instanceof ItemStack) {
               return receiver('item', object, jx);
            } else if (input instanceof Location) {
               return receiver('location', object, jx);
            } else if (input instanceof Vector) {
               return receiver('vector', object, jx);
            } else {
               return null;
            }
      }
   } else {
      return null;
   }
};

const bridge = tools.bridge(_, $);
const builder = tools.builder(_, $);
const command = tools.command(_, $);
const event = tools.event(_, $);
const receiver = tools.receiver(_, $);
const utility = tools.utility(_, $);

$('~org.bukkit.Sound');
$('~org.bukkit.GameMode');
$('~org.bukkit.Instrument');
$('~org.bukkit.boss.BarFlag');
$('~org.bukkit.boss.BarColor');
$('~org.bukkit.boss.BarStyle');
$('~org.bukkit.SoundCategory');
$('~org.bukkit.block.BlockFace');
$('~org.bukkit.inventory.ItemFlag');
$('~org.bukkit.inventory.EquipmentSlot');
$('~org.bukkit.enchantments.Enchantment');
$('~org.bukkit.attribute.AttributeModifier.Operation');

$('~org.bukkit.Material', (value) => value.isLegacy());
$('~org.bukkit.entity.EntityType', (value) => value.name() === 'UNKNOWN');
$('~org.bukkit.attribute.Attribute', null, (value) => value.getKey().getKey().split('.')[1]);
$('~org.bukkit.potion.PotionEffectType', null, (value) => value.getHandle().c().split('.')[2]);

const jx = {
   block: builder(block),
   entity: builder(entity),
   item: builder(item),
   location: builder(location),
   vector: builder(vector)
};

$[''] = 'function $ (object: any, ...args: any[])';
$['()'] = (player, input) => {
   try {
      input = eval(`[${input}]`);
   } catch (error) {
      return [];
   }
   const object = input[0];
   const args = input.slice(1);
   if (_.def(object)) {
      switch (typeof object) {
         case 'string':
            const prefix = object[0];
            const suffix = object.slice(1);
            switch (prefix) {
               case '~':
                  return $[suffix] || {};
               case '!':
                  return $(new ItemStack($.material.stone));
               case '@':
                  return $([ player ]);
               case '#':
                  return core.data(suffix, args[0]);
               case '?':
                  return $(player);
               case '*':
                  const star = { do: () => {}, if: () => {} };
                  star.if[''] = 'function if (condition: any)';
                  star.do[''] = 'function do (listener: function)';
                  star.if['()'] = () => star;
                  star.do['()'] = () => star;
                  return star;
               case '/':
                  const slash = { run: () => {}, tab: () => {} };
                  slash.tab[''] = 'function tab (tabCompleter: function)';
                  slash.run[''] = 'function run (executor: function)';
                  slash.tab['()'] = () => slash;
                  slash.run['()'] = () => slash;
                  return slash;
               case '+':
                  return utility;
               default:
                  return null;
            }
         case 'object':
            if (object === null) return null;
            const input = _.iterable(object) ? object[0] : object;
            if (typeof input.format === 'string') {
               const library = jx[input.format];
               if (library) return _.iterable(object) ? [ ...object ].map($) : library.parser(object);
               else return null;
            } else if (input instanceof Block) {
               return receiver('block', object, jx);
            } else if (input instanceof Entity) {
               return receiver('entity', object, jx);
            } else if (input instanceof ItemStack) {
               return receiver('item', object, jx);
            } else if (input instanceof Location) {
               return receiver('location', object, jx);
            } else if (input instanceof Vector) {
               return receiver('vector', object, jx);
            } else {
               return null;
            }
      }
   } else {
      return null;
   }
};

core.export($);
