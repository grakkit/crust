export function item (_, API) {
   const util = {
      modifiers: (set) => {
         return {
            clear: () => {
               set.clear();
            },
            add: (amount, operation, slot) => {
               set.add({ amount: amount, operation: operation || 'add_number', slot: slot });
            },
            remove: (index) => {
               set.remove(modifiers[index]);
            }
         };
      }
   };
   return (item) => {
      const that = {
         amount: (...args) => {
            if (args[0] === undefined) {
               return item.amount;
            } else {
               item.amount = args[0];
               return that;
            }
         },
         attribute: (...args) => {
            if (args[0] === undefined) {
               return item.attributes;
            } else if (args[1] === undefined) {
               return item.attributes[args[0]];
            } else {
               const modifiers = util.modifiers(item.attributes[args[0]]);
               if (typeof args[1] === 'function') {
                  args[1](modifiers);
               } else {
                  modifiers.clear();
                  args.slice(1).forEach((arg) => modifiers.add(...arg));
               }
               return that;
            }
         },
         damage: (...args) => {
            if (args[0] === undefined) {
               return item.damage;
            } else {
               item.damage = args[0];
               return that;
            }
         },
         data: (...args) => {
            if (args[0] === undefined) {
               return item.data;
            } else {
               const data = item.data;
               if (typeof args[0] === 'function') {
                  args[0](data);
                  item.data = data;
               } else {
                  item.data = args[0];
               }
               return that;
            }
         },
         destroy: (...args) => {
            if (args[0] === undefined) {
               return item.destroys;
            } else {
               if (typeof args[0] === 'function') {
                  args[0](item.destroys);
               } else {
                  item.destroys.clear();
                  args.forEach(item.destroys.add);
               }
               return that;
            }
         },
         enchantment: (...args) => {
            if (args[0] === undefined) {
               return item.enchantments;
            } else if (args[1] === undefined) {
               return item.enchantments[args[0]];
            } else {
               item.enchantments[args[0]] = args[1];
               return that;
            }
         },
         flag: (...args) => {
            if (args[0] === undefined) {
               return item.flags;
            } else {
               if (typeof args[0] === 'function') {
                  args[0](item.flags);
               } else {
                  item.flags.clear();
                  args.forEach(item.flags.add);
               }
               return that;
            }
         },
         lore: (...args) => {
            if (args[0] === undefined) {
               return item.lore;
            } else {
               item.lore = args[0];
               return that;
            }
         },
         material: (...args) => {
            if (args[0] === undefined) {
               return item.material;
            } else {
               item.material = args[0];
               return that;
            }
         },
         name: (...args) => {
            if (args[0] === undefined) {
               return item.name;
            } else {
               item.name = args[0];
               return that;
            }
         },
         nbt: (...args) => {
            if (args[0] === undefined) {
               return item.nbt;
            } else {
               const nbt = item.nbt;
               if (typeof args[0] === 'function') {
                  args[0](nbt);
                  item.nbt = nbt;
               } else {
                  item.nbt = args[0];
               }
               return that;
            }
         },
         place: (...args) => {
            if (args[0] === undefined) {
               return item.places;
            } else {
               if (typeof args[0] === 'function') {
                  args[0](item.places);
               } else {
                  item.places.clear();
                  args.forEach(item.places.add);
               }
               return that;
            }
         },
         get title () {
            return item.title;
         },
         unbreakable: (...args) => {
            if (args[0] === undefined) {
               return item.unbreakable;
            } else {
               item.unbreakable = args[0];
               return that;
            }
         }
      };
      return that;
   };
}
