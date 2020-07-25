if (core.version !== 'modern') throw 'You must be running on spigot or paper to use JX!';

import { _ } from './library/framework.min.js';
import * as tools from './library/tools.min.js';

import * as bar from './library/bar.min.js';
import * as block from './library/block.min.js';
import * as empty from './library/empty.min.js';
import * as entity from './library/entity.min.js';
import * as item from './library/item.min.js';
import * as location from './library/location.min.js';
import * as vector from './library/vector.min.js';
import * as modifier from './library/modifier.min.js';

const Block = Java.type('org.bukkit.block.Block');
const Entity = Java.type('org.bukkit.entity.Entity');
const Vector = Java.type('org.bukkit.util.Vector');
const Location = Java.type('org.bukkit.Location');
const ItemStack = Java.type('org.bukkit.inventory.ItemStack');
const KeyedBossBar = Java.type('org.bukkit.boss.KeyedBossBar');
const AttributeModifier = Java.type('org.bukkit.attribute.AttributeModifier');

const $ = (object, ...args) => {
   if (_.def(object)) {
      switch (typeof object) {
         case 'string':
            const prefix = object[0];
            const suffix = object.slice(1);
            switch (prefix) {
               case '~':
                  return $[suffix] || Object.assign($, bridge(suffix, ...args));
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
                  return $(_.player(object).online);
            }
         case 'object':
            if (object === null) return null;
            const input = _.iterable(object) ? _.flat([ ...object ])[0] : object;
            if (input === undefined) {
               return receiver('empty', object, jx);
            } else if (typeof input.instance === 'function') {
               return object;
            } else if (_.iterable(input)) {
               return [ ...object ].map((entry) => $(entry));
            } else if (_.def(input)) {
               if (typeof input.format === 'string') {
                  const library = jx[input.format];
                  if (library) {
                     return _.iterable(object)
                        ? $([ ...object ].map((entry) => (_.def(entry) ? library.parser(entry) : entry)))
                        : $(_.def(object) ? library.parser(object) : object);
                  } else {
                     return null;
                  }
               } else if (input instanceof KeyedBossBar) {
                  return receiver('bar', object, jx);
               } else if (input instanceof AttributeModifier) {
                  return receiver('modifier', object, jx);
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
                  return receiver('empty', object, jx);
               }
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

const jx = {
   bar: builder(bar),
   block: builder(block),
   empty: builder(empty),
   entity: builder(entity),
   item: builder(item),
   location: builder(location),
   vector: builder(vector),
   modifier: builder(modifier)
};

const utility = tools.utility(_, $, jx);

$('~org.bukkit.Sound');
$('~org.bukkit.GameMode');
$('~org.bukkit.Instrument');
$('~org.bukkit.boss.BarFlag');
$('~org.bukkit.boss.BarColor');
$('~org.bukkit.boss.BarStyle');
$('~org.bukkit.SoundCategory');
$('~org.bukkit.block.BlockFace');
$('~org.bukkit.inventory.EquipmentSlot');
$('~org.bukkit.enchantments.Enchantment');
$('~org.bukkit.attribute.AttributeModifier.Operation');
$('~org.bukkit.event.player.PlayerTeleportEvent.TeleportCause');

$('~org.bukkit.Material', (value) => value.isLegacy());
$('~org.bukkit.entity.EntityType', (value) => value.name() === 'UNKNOWN');

$('~org.bukkit.inventory.ItemFlag', null, (value) => _.splice(_.lower(value.name()), '_', 1));
$('~org.bukkit.attribute.Attribute', null, (value) => value.getKey().getKey().split('.')[1]);
$('~org.bukkit.potion.PotionEffectType', null, (value) => value.getHandle().c().split('.')[2]);

core.export($);
