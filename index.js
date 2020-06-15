import { enums } from './library/enums.min.js';
import { wrappers } from './library/wrappers.min.js';

export function $ (object, ...args) {
   if (object !== null) {
      switch (typeof object) {
         case 'object':
            const instance = object.instance || object;
            if (instance instanceof Java.type('org.bukkit.block.Block')) {
               //return wrappers.block(core.access(instance));
            } else if (instance instanceof Java.type('org.bukkit.entity.Entity')) {
               //return wrappers.entity(core.access(instance));
            } else if (instance instanceof Java.type('org.bukkit.inventory.ItemStack')) {
               return wrappers.item(core.access(instance));
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

core.export(Object.assign($, { enums: enums }));
