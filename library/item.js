export function wrapper (_, API) {
   const util = {
      adventure: (instance, meta, type) => {
         const keys = () => _.array(meta[`${type}ableKeys`]);
         const pascal = _.pascal(type);
         return _.mirror({
            get array () {
               return keys().map((key) => key.getKey());
            },
            add: (name) => {
               meta[`set${pascal}ableKeys`](_.collect(...keys(), API.material[name].getKey()));
               instance.setItemMeta(meta);
            },
            remove: (name) => {
               meta[`set${pascal}ableKeys`](_.collect(...keys().filter((key) => `${key}` !== `${API.material[name]}`)));
               instance.setItemMeta(meta);
            },
            clear: () => {
               meta[`set${pascal}ableKeys`](_.collect());
               instance.setItemMeta(meta);
            }
         });
      },
      flags: (instance, meta) => {
         return _.mirror({
            get array () {
               return _.array(meta.getItemFlags()).map((flag) => _.key(API.itemFlag, flag));
            },
            add: (flag) => {
               meta.addItemFlags(API.itemFlag[flag]);
               instance.setItemMeta(meta);
            },
            remove: (flag) => {
               meta.removeItemFlags(API.itemFlag[flag]);
               instance.setItemMeta(meta);
            },
            clear: () => {
               meta.removeItemFlags(..._.values(API.itemFlag));
               instance.setItemMeta(meta);
            }
         });
      },
      modifier: {
         parse: (data) => {
            return new org.bukkit.attribute.AttributeModifier(
               _.uuid(data.uuid),
               '',
               data.amount,
               util.operation[data.operation],
               API.equipmentSlot[data.slot] || null
            );
         },
         serialize: (data) => {
            return {
               amount: data.getAmount(),
               operation: _.key(util.operation, data.getOperation()),
               slot: data.slot ? _.key(API.equipmentSlot, data.getSlot()) : null,
               uuid: `${data.getUniqueId()}`
            };
         }
      },
      nbt: {
         parse: (data) => {
            let compound = undefined;
            switch (data.type) {
               case 'None':
                  return data.value;
               case 'Int':
               case 'Float':
               case 'Double':
               case 'Long':
               case 'Short':
               case 'Byte':
               case 'String':
                  compound = util.nms('NBTTagCompound');
                  compound[`set${data.type}`]('x', data.value);
                  return compound.get('x');
               case 'End':
                  return null;
               case 'List':
               case 'ByteArray':
               case 'IntArray':
                  const list = util.nms(`NBTTag${data.type}`);
                  data.value.forEach((entry) => list.add(util.nbt.parse(entry)));
                  return list;
               case 'Compound':
                  compound = util.nms('NBTTagCompound');
                  _.entries(data.value).forEach((entry) => compound.set(entry.key, util.nbt.parse(entry.value)));
                  return compound;
            }
         },
         serialize: (data) => {
            if ([ null, undefined ].includes(data)) {
               return { type: 'None', value: data };
            } else {
               let value = undefined;
               const type = data.getClass().getCanonicalName().split('NBTTag')[1];
               switch (type) {
                  case 'Int':
                  case 'Float':
                  case 'Double':
                  case 'Long':
                  case 'Short':
                  case 'Byte':
                     value = data.asDouble();
                     break;
                  case 'String':
                     value = data.asString();
                     break;
                  case 'End':
                     value = null;
                     break;
                  case 'List':
                  case 'ByteArray':
                  case 'IntArray':
                     value = _.array(data).map(util.nbt.serialize);
                     break;
                  case 'Compound':
                     value = _.object(_.array(data.map.entrySet()), (entry) => {
                        return { [entry.getKey()]: util.nbt.serialize(entry.getValue()) };
                     });
                     break;
               }
               return { type: type, value: value };
            }
         }
      },
      nms: (property) => {
         return new (Java.type(`net.minecraft.server.${`${server.getClass()}`.split('.')[3]}.${property}`))();
      },
      operation: {
         add: API.amOperation.add_number,
         multiply_base: API.amOperation.add_scalar,
         multiply: API.amOperation.multiply_scalar_1
      }
   };
   return (instance) => {
      const item = {
         get amount () {
            return instance.getAmount();
         },
         set amount (value) {
            instance.setAmount(_.clamp(value, 1, 127));
         },
         get attributes () {
            const meta = instance.getItemMeta();
            if (meta) {
               return _.define(API.attribute, (entry) => {
                  return _.mirror({
                     get array () {
                        const modifiers = meta.hasAttributeModifiers() && meta.getAttributeModifiers(entry.value);
                        return [ ..._.array(modifiers || []) ].map((modifier) => {
                           return util.modifier.serialize(modifier);
                        });
                     },
                     add: (modifier) => {
                        meta.addAttributeModifier(entry.value, util.modifier.parse(modifier));
                        instance.setItemMeta(meta);
                     },
                     remove: (modifier) => {
                        meta.removeAttributeModifier(entry.value, util.modifier.parse(modifier));
                        instance.setItemMeta(meta);
                     },
                     clear: () => {
                        meta.removeAttributeModifier(entry.value);
                        instance.setItemMeta(meta);
                     }
                  });
               });
            }
         },
         set attributes (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               _.keys(API.attribute).forEach((key) => (item.attributes[key] = value[key] || []));
            }
         },
         get damage () {
            const meta = instance.getItemMeta();
            if (meta) {
               return meta.getDamage();
            }
         },
         set damage (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               meta.setDamage(value);
               instance.setItemMeta(meta);
            }
         },
         get data () {
            const meta = instance.getItemMeta();
            if (meta) {
               const container = meta.getPersistentDataContainer();
               return _.object(_.array(container.getRaw().entrySet()), (entry) => {
                  const directory = new org.bukkit.NamespacedKey(...entry.getKey().split(':'));
                  if (directory.getNamespace() === 'grakkit') {
                     return { [`${directory.getKey()}`]: _.base.decode(entry.getValue().asString()) };
                  }
               });
            }
         },
         set data (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               const container = meta.getPersistentDataContainer();
               _.array(container.getRaw().entrySet()).forEach((entry) => {
                  container.remove(new org.bukkit.NamespacedKey(...entry.getKey().split(':')));
               });
               _.entries(value).forEach((entry) => {
                  container.set(
                     new org.bukkit.NamespacedKey('grakkit', entry.key),
                     org.bukkit.persistence.PersistentDataType.STRING,
                     _.base.encode(entry.value)
                  );
               });
               instance.setItemMeta(meta);
            }
         },
         get destroys () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.adventure(instance, meta, 'destroy').get();
            }
         },
         set destroys (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               util.adventure(instance, meta, 'destroy').set(value);
            }
         },
         get enchantments () {
            const meta = instance.getItemMeta();
            if (meta) {
               return _.define(API.enchantment, (entry) => {
                  return {
                     get: () => {
                        if (item.material === 'enchanted_book') return meta.getStoredEnchantLevel(entry.value);
                        else return meta.getEnchantLevel(entry.value);
                     },
                     set: (value) => {
                        value = _.clamp(value, 0, 32767);
                        if (value > 0) {
                           if (item.material === 'enchanted_book') meta.addStoredEnchant(entry.value, value, true);
                           else meta.addEnchant(entry.value, value, true);
                        } else {
                           if (item.material === 'enchanted_book') meta.removeStoredEnchant(entry.value);
                           else meta.removeEnchant(entry.value);
                        }
                        instance.setItemMeta(meta);
                     }
                  };
               });
            }
         },
         set enchantments (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               _.keys(API.enchantment).forEach((key) => (item.enchantments[key] = value[key] || 0));
            }
         },
         get flags () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.flags(instance, meta).get();
            }
         },
         set flags (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.flags(instance, meta).set(value);
            }
         },
         get lore () {
            const meta = instance.getItemMeta();
            if (meta) {
               return _.array(meta.getLore() || []);
            }
         },
         set lore (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               meta.setLore(value);
               instance.setItemMeta(meta);
            }
         },
         get material () {
            return _.key(API.material, instance.getType());
         },
         set material (value) {
            instance.setType(API.material[value]);
         },
         get name () {
            const meta = instance.getItemMeta();
            if (meta) {
               return meta.getDisplayName();
            }
         },
         set name (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               meta.setDisplayName(value);
               instance.setItemMeta(meta);
            }
         },
         get nbt () {
            return util.nbt.serialize(instance.getHandle().getTag());
         },
         set nbt (data) {
            instance.getHandle().setTag(util.nbt.parse(data));
         },
         get places () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.adventure(instance, meta, 'place').get();
            }
         },
         set places (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               util.adventure(instance, meta, 'place').set(value);
            }
         },
         get title () {
            return instance.getI18NDisplayName();
         },
         get unbreakable () {
            const meta = instance.getItemMeta();
            if (meta) {
               return meta.isUnbreakable();
            }
         },
         set unbreakable (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               meta.setUnbreakable(value);
               instance.setItemMeta(meta);
            }
         }
      };
      return item;
   };
}

export function chainer (_, API) {
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
   return (...items) => {
      const that = {
         amount: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.amount);
            } else {
               items.map((item) => (item.amount = args[0]));
               return that;
            }
         },
         attribute: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.attributes);
            } else if (args[1] === undefined) {
               return items.map((item) => item.attributes[args[0]]);
            } else {
               items.map((item) => {
                  const modifiers = util.modifiers(item.attributes[args[0]]);
                  if (typeof args[1] === 'function') {
                     args[1](modifiers);
                  } else {
                     modifiers.clear();
                     args.slice(1).forEach((arg) => modifiers.add(...arg));
                  }
               });
               return that;
            }
         },
         damage: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.damage);
            } else {
               items.map((item) => (item.damage = args[0]));
               return that;
            }
         },
         data: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.data);
            } else {
               items.map((item) => {
                  const data = item.data;
                  if (typeof args[0] === 'function') {
                     args[0](data);
                     item.data = data;
                  } else {
                     item.data = args[0];
                  }
               });
               return that;
            }
         },
         destroy: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.destroys);
            } else {
               items.map((item) => {
                  if (typeof args[0] === 'function') {
                     args[0](item.destroys);
                  } else {
                     item.destroys.clear();
                     args.forEach(item.destroys.add);
                  }
               });
               return that;
            }
         },
         enchantment: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.enchantments);
            } else if (args[1] === undefined) {
               return items.map((item) => item.enchantments[args[0]]);
            } else {
               items.map((item) => (item.enchantments[args[0]] = args[1]));
               return that;
            }
         },
         flag: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.flags);
            } else {
               items.map((item) => {
                  if (typeof args[0] === 'function') {
                     args[0](item.flags);
                  } else {
                     item.flags.clear();
                     args.forEach(item.flags.add);
                  }
               });
               return that;
            }
         },
         lore: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.lore);
            } else {
               items.map((item) => (item.lore = args[0]));
               return that;
            }
         },
         material: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.material);
            } else {
               items.map((item) => (item.material = args[0]));
               return that;
            }
         },
         name: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.name);
            } else {
               items.map((item) => (item.name = args[0]));
               return that;
            }
         },
         nbt: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.nbt);
            } else {
               items.map((item) => {
                  const nbt = item.nbt;
                  if (typeof args[0] === 'function') {
                     args[0](nbt);
                     item.nbt = nbt;
                  } else {
                     item.nbt = args[0];
                  }
               });
               return that;
            }
         },
         place: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.places);
            } else {
               items.map((item) => {
                  if (typeof args[0] === 'function') {
                     args[0](item.places);
                  } else {
                     item.places.clear();
                     args.forEach(item.places.add);
                  }
               });
               return that;
            }
         },
         title: () => {
            return items.map((item) => item.title);
         },
         unbreakable: (...args) => {
            if (args[0] === undefined) {
               return items.map((item) => item.unbreakable);
            } else {
               items.map((item) => (item.unbreakable = args[0]));
               return that;
            }
         }
      };
      return that;
   };
}

export const links = [
   'amount',
   'attribute',
   'damage',
   'data',
   'destroy',
   'enchantment',
   'flag',
   'lore',
   'material',
   'nbt',
   'name',
   'place',
   'title',
   'unbreakable'
];
