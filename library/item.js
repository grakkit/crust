export const wrapper = (_, $) => {
   const util = {
      adventure: (instance, meta, type) => {
         const keys = () => _.array(meta[`${type}ableKeys`]);
         const pascal = _.pascal(type);
         return _.mirror({
            get array () {
               return keys().map((key) => key.getKey());
            },
            add: (name) => {
               meta[`set${pascal}ableKeys`](_.collect(...keys(), $.material[name].getKey()));
               instance.setItemMeta(meta);
            },
            remove: (name) => {
               meta[`set${pascal}ableKeys`](_.collect(...keys().filter((key) => `${key}` !== `${$.material[name]}`)));
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
               return _.array(meta.getItemFlags()).map((flag) => _.key($.itemFlag, flag));
            },
            add: (flag) => {
               meta.addItemFlags($.itemFlag[flag]);
               instance.setItemMeta(meta);
            },
            remove: (flag) => {
               meta.removeItemFlags($.itemFlag[flag]);
               instance.setItemMeta(meta);
            },
            clear: () => {
               meta.removeItemFlags(..._.values($.itemFlag));
               instance.setItemMeta(meta);
            }
         });
      },
      key: (...args) => {
         return new (Java.type('org.bukkit.NamespacedKey'))(...args);
      },
      modifier: {
         parse: (modifier) => {
            return new org.bukkit.attribute.AttributeModifier(
               _.uuid(modifier.uuid),
               modifier.name || '',
               modifier.amount || 0,
               $.amOperation[modifier.operation || 'add_number'],
               $.equipmentSlot[modifier.slot] || null
            );
         },
         serialize: (instance, meta, attribute, modifier) => {
            const uuid = modifier.getUniqueId().toString();
            const update = (key, value) => {
               meta.removeAttributeModifier(attribute, util.modifier.parse({ uuid: uuid }));
               modifier = util.modifier.parse(Object.assign({}, internal, { [key]: value }));
               meta.addAttributeModifier(attribute, modifier);
               instance.setItemMeta(meta);
            };
            const internal = {
               get uuid () {
                  return uuid;
               },
               get amount () {
                  return modifier.getAmount();
               },
               set amount (value) {
                  update('amount', value);
               },
               get name () {
                  return modifier.getName();
               },
               set name (value) {
                  update('name', value);
               },
               get operation () {
                  return $.amOperation[modifier.getOperation()];
               },
               set operation (value) {
                  update('operation', value);
               },
               get slot () {
                  return $.equipmentSlot[modifier.getSlot()];
               },
               set slot (value) {
                  update('slot', value);
               }
            };
            const that = {
               get internal () {
                  return internal;
               },
               amount: (value) => {
                  if (value === undefined) {
                     return internal.amount;
                  } else {
                     internal.amount = value;
                     return that;
                  }
               },
               name: (value) => {
                  if (value === undefined) {
                     return internal.name;
                  } else {
                     internal.name = value;
                     return that;
                  }
               },
               operation: (value) => {
                  if (value === undefined) {
                     return internal.operation;
                  } else {
                     internal.operation = value;
                     return that;
                  }
               },
               slot: (value) => {
                  if (value === undefined) {
                     return internal.slot;
                  } else {
                     internal.slot = value;
                     return that;
                  }
               }
            };
            return that;
         }
      },
      modifiers: (instance, meta, attribute) => {
         return _.mirror({
            get array () {
               const modifiers = meta.hasAttributeModifiers() && meta.getAttributeModifiers(attribute);
               return [ ..._.array(modifiers || []) ].map((modifier) => {
                  return Object.assign(util.modifier.serialize(instance, meta, attribute, modifier));
               });
            },
            add: (modifier) => {
               meta.addAttributeModifier(attribute, util.modifier.parse(modifier));
               instance.setItemMeta(meta);
            },
            remove: (modifier) => {
               meta.removeAttributeModifier(attribute, util.modifier.parse({ uuid: modifier.internal.uuid }));
               instance.setItemMeta(meta);
            },
            clear: () => {
               meta.removeAttributeModifier(attribute);
               instance.setItemMeta(meta);
            }
         });
      },
      remap: (source, consumer) => {
         return _.define(source, (entry) => {
            if (entry.key === _.lower(entry.key)) return consumer(entry);
         });
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
         get attribute () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.remap($.attribute, (entry) => {
                  return util.modifiers(instance, meta, entry.value);
               });
            }
         },
         set attribute (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               _.keys($.attribute).forEach((key) => (item.attribute[key] = value[key] || []));
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
                  const directory = util.key(...entry.getKey().split(':'));
                  if (directory.getNamespace() === core.plugin.getName()) {
                     let value = _.base.decode(entry.getValue().asString());
                     try {
                        return { [`${directory.getKey()}`]: JSON.parse(value) };
                     } catch (error) {
                        return { [`${directory.getKey()}`]: value };
                     }
                  }
               });
            }
         },
         set data (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               const container = meta.getPersistentDataContainer();
               _.array(container.getRaw().entrySet()).forEach((entry) => {
                  if (entry.getKey().split(':')[1] === core.plugin.getName()) {
                     container.remove(util.key(core.plugin, entry.getKey().getKey()));
                  }
               });
               _.entries(value).forEach((entry) => {
                  container.set(
                     util.key(core.plugin, entry.key),
                     org.bukkit.persistence.PersistentDataType.STRING,
                     _.base.encode(JSON.stringify(core.serialize(entry.value)))
                  );
               });
               instance.setItemMeta(meta);
            }
         },
         get destroy () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.adventure(instance, meta, 'destroy').get();
            }
         },
         set destroy (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               util.adventure(instance, meta, 'destroy').set(value);
            }
         },
         drop: (location, naturally) => {
            const target = $('-', location);
            return $(target.getWorld()[`dropItem${naturally ? 'Naturally' : ''}`](target, instance));
         },
         get enchantment () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.remap($.enchantment, (entry) => {
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
         set enchantment (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               _.keys($.enchantment).forEach((key) => (item.enchantment[key] = value[key] || 0));
            }
         },
         get flag () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.flags(instance, meta).get();
            }
         },
         set flag (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.flags(instance, meta).set(value);
            }
         },
         get instance () {
            return instance;
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
            return _.key($.material, instance.getType());
         },
         set material (value) {
            instance.setType($.material[value]);
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
            return _.serialize(instance.getHandle().getTag());
         },
         set nbt (data) {
            instance.getHandle().setTag(_.parse(data));
         },
         get place () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.adventure(instance, meta, 'place').get();
            }
         },
         set place (value) {
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
};

export const parser = (_, $) => {
   return (input) => {
      const data = input.data.value;
      return $(`!${data.id.value.split(':')[1]}`).amount(data.Count.value).nbt(data.tag);
   };
};

export const chain = (_, $) => {
   return {
      amount: 'setter',
      attribute: 'listerNest',
      damage: 'setter',
      data: 'appender',
      destroy: 'lister',
      drop: 'runner',
      enchantment: 'setterNest',
      flag: 'lister',
      instance: 'getter',
      lore: 'setter',
      material: 'setter',
      name: 'setter',
      nbt: 'appender',
      place: 'lister',
      serialize: (item) => {
         return {
            format: 'item',
            material: item.material,
            amount: item.amount,
            nbt: item.nbt
         };
      },
      title: 'getter',
      unbreakable: 'setter'
   };
};
