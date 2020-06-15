export function item (_, enums) {
   const util = {
      adventure: (instance, meta, type) => {
         const keys = () => core.array(meta[`${type}ableKeys`]);
         return _.mirror({
            get array () {
               return keys().map((key) => key.getKey());
            },
            add: (name) => {
               meta[`${type}ableKeys`] = _.collect(...keys(), enums.material[name].getKey());
               instance.itemMeta = meta.instance;
            },
            remove: (name) => {
               meta[`${type}ableKeys`] = _.collect(...keys().filter((key) => `${key}` !== `${enums.material[name]}`));
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
               return core.array(meta.itemFlags).map((flag) => _.key(enums.itemFlag, flag));
            },
            add: (flag) => {
               meta.addItemFlags(enums.itemFlag[flag]);
               instance.itemMeta = meta.instance;
            },
            remove: (flag) => {
               meta.removeItemFlags(enums.itemFlag[flag]);
               instance.itemMeta = meta.instance;
            },
            clear: () => {
               meta.removeItemFlags(..._.values(enums.itemFlag));
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
               enums.amOperation[data.operation],
               enums.equipmentSlot[data.slot] || null
            );
         },
         serialize: (data) => {
            return {
               amount: data.amount,
               operation: _.key(enums.amOperation, data.operation),
               slot: data.slot ? _.key(enums.equipmentSlot, data.slot) : null,
               uuid: `${data.uniqueId}`
            };
         }
      },
      nbt: {
         get classes () {
            const version = server.instance.getClass().getCanonicalName().split('.')[3];
            return {
               tagCompound: Java.type(`net.minecraft.server.${version}.NBTTagCompound`),
               tagList: Java.type(`net.minecraft.server.${version}.NBTTagList`)
            };
         },
         parse: (data) => {
            const classes = util.nbt.classes;
            const compound = new classes.tagCompound();
            switch (data.type) {
               case 'Int':
               case 'Float':
               case 'Double':
               case 'Long':
               case 'Short':
               case 'Byte':
               case 'String':
                  compound[`set${data.type}`]('x', data.value);
                  return compound.get('x');
               case 'End':
               case 'ByteArray':
                  throw `you finally found the NBT type "${data.type}" so finish that library!`;
               case 'List':
                  const list = new classes.tagList();
                  data.value.forEach((entry) => list.add(util.nbt.parse(entry)));
                  return list;
               case 'Compound':
                  _.entries(data.value).forEach((entry) => compound.set(entry.key, util.nbt.parse(entry.value)));
                  return compound;
               case null:
               case undefined:
                  return data.type;
            }
         },
         serialize: (data) => {
            let value = undefined;
            if ([ null, undefined ].includes(data)) {
               return { type: data };
            } else {
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
                  case 'ByteArray':
                     value = null;
                     break;
                  case 'List':
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
               return _.define(enums.attribute, (entry) => {
                  return _.mirror({
                     get array () {
                        const modifiers = meta.hasAttributeModifiers() && meta.getAttributeModifiers(entry.value);
                        return [ ...(modifiers || []) ].map((modifier) => {
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
               _.keys(enums.attribute).forEach((key) => (item.attributes[key] = value[key] || []));
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
               return _.define(enums.enchantment, (entry) => {
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
               _.keys(enums.enchantment).forEach((key) => (item.enchantments[key] = value[key] || 0));
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
            return _.key(enums.material, instance.type.instance);
         },
         set material (value) {
            instance.type = enums.material[value];
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
