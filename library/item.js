export function wrapper (_, API) {
   const util = {
      adventure: (instance, meta, type) => {
         const keys = () => core.array(meta[`${type}ableKeys`]);
         return _.mirror({
            get array () {
               return keys().map((key) => key.getKey());
            },
            add: (name) => {
               meta[`${type}ableKeys`] = _.collect(...keys(), API.material[name].getKey());
               instance.itemMeta = meta.instance;
            },
            remove: (name) => {
               meta[`${type}ableKeys`] = _.collect(...keys().filter((key) => `${key}` !== `${API.material[name]}`));
               instance.itemMeta = meta.instance;
            },
            clear: () => {
               meta[`${type}ableKeys`] = _.collect();
               instance.itemMeta = meta.instance;
            }
         });
      },
      flags: (instance, meta) => {
         return _.mirror({
            get array () {
               return core.array(meta.itemFlags).map((flag) => _.key(API.itemFlag, flag));
            },
            add: (flag) => {
               meta.addItemFlags(API.itemFlag[flag]);
               instance.itemMeta = meta.instance;
            },
            remove: (flag) => {
               meta.removeItemFlags(API.itemFlag[flag]);
               instance.itemMeta = meta.instance;
            },
            clear: () => {
               meta.removeItemFlags(..._.values(API.itemFlag));
               instance.itemMeta = meta.instance;
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
               amount: data.amount,
               operation: _.key(util.operation, data.operation),
               slot: data.slot ? _.key(API.equipmentSlot, data.slot) : null,
               uuid: `${data.uniqueId}`
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
               return { type: 'None', data: data };
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
                     value = core.array(data).map(util.nbt.serialize);
                     break;
                  case 'Compound':
                     value = _.object(core.array(data.map.entrySet()), (entry) => {
                        return { [entry.getKey()]: util.nbt.serialize(entry.getValue()) };
                     });
                     break;
               }
               return { type: type, value: value };
            }
         }
      },
      nms: (property) => {
         return new (Java.type(`net.minecraft.server.${`${server.instance.getClass()}`.split('.')[3]}.${property}`))();
      },
      operation: {
         add: API.amOperation.add_number,
         multiply_base: API.amOperation.add_scalar,
         multiply: API.amOperation.multiply_scalar_1
      }
   };
   return (instance) => {
      const item = {
         instance: instance,
         get amount () {
            return instance.amount;
         },
         set amount (value) {
            instance.amount = _.clamp(value, 1, 127);
         },
         get attributes () {
            const meta = instance.itemMeta;
            if (meta) {
               return _.define(API.attribute, (entry) => {
                  return _.mirror({
                     get array () {
                        const modifiers = meta.hasAttributeModifiers() && meta.getAttributeModifiers(entry.value);
                        return [ ...core.array(modifiers || []) ].map((modifier) => {
                           return util.modifier.serialize(modifier);
                        });
                     },
                     add: (modifier) => {
                        meta.addAttributeModifier(entry.value, util.modifier.parse(modifier));
                        instance.itemMeta = meta.instance;
                     },
                     remove: (modifier) => {
                        meta.removeAttributeModifier(entry.value, util.modifier.parse(modifier));
                        instance.itemMeta = meta.instance;
                     },
                     clear: () => {
                        meta.removeAttributeModifier(entry.value);
                        instance.itemMeta = meta.instance;
                     }
                  });
               });
            }
         },
         set attributes (value) {
            const meta = instance.itemMeta;
            if (meta) {
               _.keys(API.attribute).forEach((key) => (item.attributes[key] = value[key] || []));
            }
         },
         get damage () {
            const meta = instance.itemMeta;
            if (meta) {
               return meta.damage;
            }
         },
         set damage (value) {
            const meta = instance.itemMeta;
            if (meta) {
               meta.damage = value;
               instance.itemMeta = meta.instance;
            }
         },
         get data () {
            const meta = instance.itemMeta;
            if (meta) {
               const container = meta.persistentDataContainer;
               return _.object(core.array(container.raw.entrySet()), (entry) => {
                  const directory = new org.bukkit.NamespacedKey(...entry.getKey().split(':'));
                  if (directory.getNamespace() === 'jx') {
                     return { [`${directory.getKey()}`]: _.base.decode(entry.getValue().asString()) };
                  }
               });
            }
         },
         set data (value) {
            const meta = instance.itemMeta;
            if (meta) {
               const container = meta.persistentDataContainer;
               core.array(container.raw.entrySet()).forEach((entry) => {
                  container.remove(new org.bukkit.NamespacedKey(...entry.getKey().split(':')));
               });
               _.entries(value).forEach((entry) => {
                  container.set(
                     new org.bukkit.NamespacedKey('jx', entry.key),
                     org.bukkit.persistence.PersistentDataType.STRING,
                     _.base.encode(entry.value)
                  );
               });
               instance.itemMeta = meta.instance;
            }
         },
         get destroys () {
            const meta = instance.itemMeta;
            if (meta) {
               return util.adventure(instance, meta, 'destroy').get();
            }
         },
         set destroys (value) {
            const meta = instance.itemMeta;
            if (meta) {
               util.adventure(instance, meta, 'destroy').set(value);
            }
         },
         get enchantments () {
            const meta = instance.itemMeta;
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
                        instance.itemMeta = meta.instance;
                     }
                  };
               });
            }
         },
         set enchantments (value) {
            const meta = instance.itemMeta;
            if (meta) {
               _.keys(API.enchantment).forEach((key) => (item.enchantments[key] = value[key] || 0));
            }
         },
         get flags () {
            const meta = instance.itemMeta;
            if (meta) {
               return util.flags(instance, meta).get();
            }
         },
         set flags (value) {
            const meta = instance.itemMeta;
            if (meta) {
               return util.flags(instance, meta).set(value);
            }
         },
         get lore () {
            const meta = instance.itemMeta;
            if (meta) {
               return core.array(meta.lore || []);
            }
         },
         set lore (value) {
            const meta = instance.itemMeta;
            if (meta) {
               meta.lore = value;
               instance.itemMeta = meta.instance;
            }
         },
         get material () {
            return _.key(API.material, instance.type.instance);
         },
         set material (value) {
            instance.type = API.material[value];
         },
         get name () {
            const meta = instance.itemMeta;
            if (meta) {
               return meta.displayName;
            }
         },
         set name (value) {
            const meta = instance.itemMeta;
            if (meta) {
               meta.displayName = value;
               instance.itemMeta = meta.instance;
            }
         },
         get nbt () {
            return util.nbt.serialize(instance.handle.tag.instance);
         },
         set nbt (data) {
            instance.handle.tag = util.nbt.parse(data);
         },
         get places () {
            const meta = instance.itemMeta;
            if (meta) {
               return util.adventure(instance, meta, 'place').get();
            }
         },
         set places (value) {
            const meta = instance.itemMeta;
            if (meta) {
               util.adventure(instance, meta, 'place').set(value);
            }
         },
         get title () {
            return instance.i18NDisplayName;
         },
         get unbreakable () {
            const meta = instance.itemMeta;
            if (meta) {
               return meta.unbreakable;
            }
         },
         set unbreakable (value) {
            const meta = instance.itemMeta;
            if (meta) {
               meta.unbreakable = value;
               instance.itemMeta = meta.instance;
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
         get title () {
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
