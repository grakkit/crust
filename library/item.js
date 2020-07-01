export function wrapper (_, $) {
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
                  const list = util.nms(`NBTTag${data.type}`, data.type !== 'List' && _.collect());
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
      nms: (property, ...args) => {
         const type = Java.type(`net.minecraft.server.${`${server.getClass()}`.split('.')[3]}.${property}`);
         return new type(..._.flat(args));
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
         get attributes () {
            const meta = instance.getItemMeta();
            if (meta) {
               return util.remap($.attribute, (entry) => {
                  return util.modifiers(instance, meta, entry.value);
               });
            }
         },
         set attributes (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               _.keys($.attribute).forEach((key) => (item.attributes[key] = value[key] || []));
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
                  if (value.getNamespace() === core.plugin.getName()) {
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
         drop: (location, naturally) => {
            location.getWorld()[`dropItem${naturally ? 'Naturally' : ''}`](location, instance);
         },
         get enchantments () {
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
         set enchantments (value) {
            const meta = instance.getItemMeta();
            if (meta) {
               _.keys($.enchantment).forEach((key) => (item.enchantments[key] = value[key] || 0));
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

export function chainer (_, $) {
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
                  if (typeof args[1] === 'function') {
                     args[1](item.attributes[args[0]]);
                  } else {
                     item.attributes[args[0]].clear();
                     args.slice(1).forEach(item.attributes[args[0]].add);
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
         drop: (...args) => {
            return items.map((item) => item.drop(...args));
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
         instance: () => {
            return items.map((item) => item.instance);
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
         serialize: () => {
            return items.map((item) => {
               return {
                  format: 'item',
                  material: item.material,
                  amount: item.amount,
                  nbt: item.nbt
               };
            });
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

export function parser (_, $) {
   return (input) => {
      return $(`!${input.material}`).amount(input.amount).nbt(input.nbt).instance();
   };
}

export const links = [
   'amount',
   'attribute',
   'damage',
   'data',
   'destroy',
   'drop',
   'enchantment',
   'flag',
   'instance',
   'lore',
   'material',
   'nbt',
   'name',
   'place',
   'serialize',
   'title',
   'unbreakable'
];
