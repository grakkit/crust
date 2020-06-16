import { enums } from './library/enums.min.js';
import { framework } from './library/framework.min.js';

import { chainers } from './library/chainers.min.js';
import { wrappers } from './library/wrappers.min.js';

const API = enums(framework);

const item = {
   chainer: chainers.item(framework, API),
   wrapper: wrappers.item(framework, API)
};

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
               return item.chainer(item.wrapper(core.access(instance)));
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

core.export(Object.assign($, { wrappers: wrappers, chainers: chainers }));
