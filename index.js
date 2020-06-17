import { framework } from './framework.min.js';

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
         consumer: (value) => (value.name() === 'UNKNOWN' ? undefined : value.key.key)
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
      */
      potionEffectType: {
         source: Java.type('org.bukkit.potion.PotionEffectType'),
         consumer: (value) => value.handle.c().split('.')[2]
      },
      /*
      rabbitType: {
         source: Java.type('org.bukkit.entity.Rabbit.Type')
      },
      skeletonType: {
         source: Java.type('org.bukkit.entity.Skeleton.Type')
      },
      spellcasterSpell: {
         source: Java.type('org.bukkit.entity.Spellcaster.Spell')
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
      itemFlag: {
         source: Java.type('org.bukkit.inventory.ItemFlag')
      },
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
      ceAction: {
         source: Java.type('net.md_5.bungee.api.chat.ClickEvent.Action')
      },
      chatColor: {
         source: Java.type('net.md_5.bungee.api.ChatColor')
      },
      */
      enchantment: {
         source: Java.type('org.bukkit.enchantments.Enchantment'),
         consumer: (value) => value.key.key
      },
      /*
      enchantmentTarget: {
         source: Java.type('org.bukkit.enchantments.EnchantmentTarget')
      },
      heAction: {
         source: Java.type('net.md_5.bungee.api.chat.HoverEvent.Action')
      },
      */
      material: {
         source: Java.type('org.bukkit.Material'),
         consumer: (value) => (value.legacy ? undefined : value.key.key)
      }
   }),
   (entry) => {
      return {
         [entry.key]: framework.object([ ...entry.value.source.values() ], (value) => {
            const consumer = entry.value.consumer || ((value) => value.name().toLowerCase());
            return { [consumer(core.access(value))]: value };
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

const one = (type, instance) => {
   const that = chainers[type](wrappers[type](instance));
   return framework.object(links[type], (link) => {
      return {
         [link]: (...args) => {
            const result = that[link](...args);
            return result === that ? that : result[0];
         }
      };
   });
};

const all = (type, ...instances) => {
   const that = chainers[type](wrappers[type](...instances));
   return framework.extend(that, {
      get first () {
         return one(type, instances[0]);
      },
      get forEach () {
         return instances.map((instance) => one(type, instance)).forEach;
      },
      get last () {
         return one(type, instances.slice(-1)[0]);
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
               /* select player */
               case '~':
                  return null;
               /* create item */
               case '!':
                  if (suffix[0] === '!') return one('item', $(suffix.slice(1)));
                  else return new (Java.type('org.bukkit.inventory.ItemStack'))(type);
               /* select entities */
               case '@':
                  const context = args[0] || server.consoleSender;
                  return all('entity', ...core.array(server.selectEntities(context.instance || context, object)));
               /* access data */
               case '#':
                  return core.data(suffix, args[0]);
               case '%':
                  return null;
               case '^':
                  return null;
               /* listen events */
               case '*':
                  return core.event(suffix, args[0]);
               case '-':
                  return null;
               case '+':
                  return null;
               case '/':
                  return null;
               /* create entity */
               case '?':
                  if (suffix[0] === '?') return one('entity', $(suffix.slice(1)));
                  else return args[0].world.spawnEntity(args[0], API.entityType[suffix]);
               default:
                  return $(`~${suffix}`);
            }
         case 'object':
            const instance = object.instance || object;
            if (instance instanceof Java.type('org.bukkit.block.Block')) {
               //return wrappers.block(core.access(instance));
            } else if (instance instanceof Java.type('org.bukkit.entity.Entity')) {
               return one('entity', core.access(instance));
            } else if (instance instanceof Java.type('org.bukkit.inventory.ItemStack')) {
               return one('item', core.access(instance));
            } else if (instance instanceof Java.type('org.bukkit.inventory.Inventory')) {
               //return wrappers.inventory(core.access(instance));
            } else if (instance instanceof Java.type('org.bukkit.Location')) {
               //return wrappers.location(core.access(instance));
            } else if (instance instanceof Java.type('org.bukkit.World')) {
               //return wrappers.world(core.access(instance));
            }
            break;
      }
   }
}

core.export(Object.assign($, { wrappers: wrappers, chainers: chainers, API: API }));
