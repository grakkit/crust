const UUID = Java.type('java.util.UUID');
const Material = Java.type('org.bukkit.Material');
const ItemFlag = Java.type('org.bukkit.inventory.ItemFlag');
const AttributeModifier = Java.type('org.bukkit.attribute.AttributeModifier');

export const wrapper = (_, $) => {
   const util = {
      adventure: (thing, type) => {
         type = _.pascal((type += 'ableKeys'));
         const k = {
            get eys () {
               return thing.meta ? _.array(thing.meta[`get${type}`]()) : [];
            }
         };
         return _.mirror({
            get array () {
               return k.eys.map((key) => key.getKey());
            },
            add: (value) => {
               value instanceof Material || (value = $('+').fronts('material')[value]);
               if (value) thing.meta = (meta) => meta && meta[`set${type}`](_.collect(...k.eys, value.getKey()));
               else throw 'TypeError: That is not a valid material!';
            },
            remove: (value) => {
               value instanceof Material || (value = $('+').fronts('material')[value]);
               if (value) {
                  thing.meta = (meta) => meta && meta[`set${type}`](_.collect(...k.eys.filter((key) => value !== key)));
               } else {
                  throw 'TypeError: That is not a valid material!';
               }
            },
            clear: () => {
               thing.meta = (meta) => meta && meta[`set${type}`](_.collect());
            }
         });
      },
      flags: (thing) => {
         return _.mirror({
            get array () {
               if (thing.meta) {
                  return _.array(thing.meta.getItemFlags()).map((flag) => $('+').backs('itemFlag')[flag]);
               } else {
                  return [];
               }
            },
            add: (value) => {
               value instanceof ItemFlag || (value = $('+').fronts('itemFlag')[value]);
               if (value) thing.meta = (meta) => meta && meta.addItemFlags([ value ]);
               else throw 'TypeError: That is not a valid item flag!';
            },
            remove: (value) => {
               value instanceof ItemFlag || (value = $('+').fronts('itemFlag')[value]);
               if (value) thing.meta = (meta) => meta && meta.removeItemFlags([ value ]);
               else throw 'TypeError: That is not a valid item flag!';
            },
            clear: () => {
               thing.meta = (meta) => meta && meta.removeItemFlags(..._.keys($('+').backs('itemFlag')));
            }
         });
      },
      modifier: {
         parse: (modifier) => {
            return new AttributeModifier(
               _.uuid(modifier.uuid),
               modifier.name || '',
               modifier.amount || 0,
               $.amOperation[modifier.operation || 'add_number'],
               $.equipmentSlot[modifier.slot] || null
            );
         },
         serialize: (thing, attribute, modifier) => {
            const uuid = modifier.getUniqueId().toString();
            const update = (key, value) => {
               thing.meta = (meta) => {
                  meta.removeAttributeModifier(attribute, util.modifier.parse({ uuid: uuid }));
                  modifier = util.modifier.parse(_.extend({}, internal, { [key]: value }));
                  meta.addAttributeModifier(attribute, modifier);
               };
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
            const external = {
               get internal () {
                  return internal;
               },
               amount: (value) => {
                  if (value === undefined) {
                     return internal.amount;
                  } else {
                     internal.amount = value;
                     return external;
                  }
               },
               name: (value) => {
                  if (value === undefined) {
                     return internal.name;
                  } else {
                     internal.name = value;
                     return external;
                  }
               },
               operation: (value) => {
                  if (value === undefined) {
                     return internal.operation;
                  } else {
                     internal.operation = value;
                     return external;
                  }
               },
               slot: (value) => {
                  if (value === undefined) {
                     return internal.slot;
                  } else {
                     internal.slot = value;
                     return external;
                  }
               }
            };
            return external;
         }
      },
      modifiers: (thing, attribute) => {
         return _.mirror({
            get array () {
               if (thing.meta) {
                  const modifiers = thing.meta.hasAttributeModifiers() && thing.meta.getAttributeModifiers(attribute);
                  return [ ..._.array(modifiers || []) ].map((modifier) => {
                     return _.extend(util.modifier.serialize(thing, attribute, modifier));
                  });
               } else {
                  return [];
               }
            },
            add: (value) => {
               typeof value === 'number' && (value = { amount: value });
               if (typeof value === 'object') {
                  if (typeof value.amount === 'number') {
                     thing.meta = (meta) => meta && meta.addAttributeModifier(attribute, util.modifier.parse(value));
                  } else {
                     throw 'TypeError: That is not a valid modifier object!';
                  }
               } else {
                  throw 'TypeError: You must supply a numeric value or modifier object!';
               }
            },
            remove: (value) => {
               if (typeof value === 'string' || value instanceof UUID) {
                  try {
                     _.uuid(value);
                     value = { uuid: value };
                  } catch (error) {
                     throw 'TypeError: That is not a valid UUID!';
                  }
               } else if (typeof value === 'object') {
                  if (value instanceof AttributeModifier) value = { uuid: value.getUniqueID().toString() };
                  else if (typeof value.internal === 'object') value = value.internal;
                  if (typeof value.uuid !== 'string') {
                     throw 'TypeError: That is not a valid modifier object!';
                  } else {
                     thing.meta = (meta) => meta && meta.removeAttributeModifier(attribute, util.modifier.parse(value));
                  }
               } else {
                  throw 'You must supply a UUID or modifier object!';
               }
            },
            clear: () => {
               thing.meta = (meta) => meta && meta.removeAttributeModifier(attribute);
            }
         });
      }
   };
   return (instance) => {
      const meta = instance.getItemMeta();
      const thing = {
         get amount () {
            return instance.getAmount();
         },
         set amount (value) {
            if (typeof value === 'number') instance.setAmount(_.clamp(value, 1, 127));
            else throw 'TypeError: You must supply a numeric value!';
         },
         get attribute () {
            return _.define($('+').fronts('attribute'), (entry) => meta && util.modifiers(thing, entry.value));
         },
         set attribute (value) {
            if (_.def(value) && typeof value === 'object') meta && _.extend($(item).attribute(), value);
            else throw 'TypeError: You must supply an object!';
         },
         get damage () {
            if (meta) return meta.getDamage();
         },
         set damage (value) {
            if (typeof value === 'number') {
               thing.meta = (meta) => meta && meta.setDamage(_.clamp(value, 0, instance.getType().getMaxDurability()));
            } else {
               throw 'TypeError: You must supply a numeric value!';
            }
         },
         get data () {
            if (meta) return $('+').data(meta.getPersistentDataContainer());
         },
         set data (value) {
            thing.meta = (meta) => meta && $('+').data(meta.getPersistentDataContainer(), value);
         },
         get destroy () {
            util.adventure(thing, 'destroy').get();
         },
         set destroy (value) {
            if (_.iterable(value)) meta && util.adventure(thing, 'destroy').set(value);
            else throw 'TypeError: You must supply an array!';
         },
         drop: (location, option) => {
            try {
               return $('+').drop(location, instance, option);
            } catch (error) {
               switch (error) {
                  case 'invalid-both':
                  case 'invalid-item':
                     throw 'ImpossibleError: How the fuck are you seeing this error!?';
                  case 'invalid-location':
                     throw 'TypeError: Argument 1 must be a location!';
               }
            }
         },
         get enchantment () {
            return _.define($('+').fronts('enchantment'), (entry) => {
               if (meta) {
                  return {
                     get: () => {
                        if (thing.material === 'enchanted_book') return meta.getStoredEnchantLevel(entry.value);
                        else return meta.getEnchantLevel(entry.value);
                     },
                     set: (value) => {
                        if (typeof value === 'number') {
                           thing.meta = (meta) => {
                              if (value) {
                                 if (thing.material !== 'enchanted_book') meta.addEnchant(entry.value, value, true);
                                 else meta.addStoredEnchant(entry.value, value, true);
                              } else {
                                 if (thing.material === 'enchanted_book') meta.removeStoredEnchant(entry.value);
                                 else meta.removeEnchant(entry.value);
                              }
                           };
                        } else {
                           throw 'TypeError: You must supply a numeric value!';
                        }
                     }
                  };
               }
            });
         },
         set enchantment (value) {
            if (_.def(value) && typeof value === 'object') meta && _.extend($(item).enchantment(), value);
            else throw 'TypeError: You must supply an object!';
         },
         get flag () {
            return util.flags(thing).get();
         },
         set flag (value) {
            if (_.iterable(value)) meta && util.flags(thing).set(value);
            else throw 'TypeError: You must supply an array!';
         },
         get instance () {
            return instance;
         },
         get lore () {
            if (meta) return meta.getLore() && _.array(meta.getLore());
         },
         set lore (value) {
            if (typeof value[Symbol.iterator] !== 'function') throw 'You must supply an array or string value!';
            else thing.meta = (meta) => meta && meta.setLore(_.iterable(value) ? value : [ value ]);
         },
         get material () {
            return $('+').backs('material')[instance.getType()];
         },
         set material (value) {
            const type = value instanceof Material ? value : $('+').fronts('material')[value];
            if (type) instance.setType(type);
            else throw 'ReferenceError: That is not a valid material!';
         },
         get meta () {
            return meta;
         },
         set meta (value) {
            if (typeof value === 'function') {
               value(meta);
               instance.setItemMeta(meta);
            } else {
               throw 'TypeError: You must supply a function!';
            }
         },
         get name () {
            if (meta) return meta.getDisplayName();
         },
         set name (value) {
            if (typeof value === 'string') thing.meta = (meta) => meta && meta.setDisplayName(value);
            else throw 'TypeError: You must supply a string value!';
         },
         get nbt () {
            return _.serialize(instance.getHandle().getTag());
         },
         set nbt (data) {
            try {
               return instance.getHandle().setTag(_.parse(data));
            } catch (error) {
               throw 'SyntaxError: Cannot convert input to NBT!';
            }
         },
         get place () {
            return util.adventure(thing, 'place').get();
         },
         set place (value) {
            if (_.iterable(value)) meta && util.adventure(thing, 'place').set(value);
            else throw 'TypeError: You must supply an array!';
         },
         get title () {
            return instance.getI18NDisplayName();
         },
         get unbreakable () {
            if (meta) return meta.isUnbreakable();
         },
         set unbreakable (value) {
            if (typeof value === 'boolean') thing.meta = (meta) => meta && meta.setUnbreakable(value);
            else throw 'You must supply a boolean value!';
         }
      };
      return thing;
   };
};

export const parser = (_, $) => {
   return (input) => {
      return $(`!${input.material}`).amount(input.amount).nbt(input.nbt);
   };
};

export const chain = (_, $) => {
   return {
      amount: 'setter',
      attribute: 'listerNest',
      damage: 'setter',
      data: 'appender',
      destroy: 'lister',
      drop: 'runnerLink',
      enchantment: 'setterNest',
      flag: 'lister',
      instance: 'getter',
      lore: 'setter',
      material: 'setter',
      meta: 'setter',
      name: 'setter',
      nbt: 'appender',
      place: 'lister',
      serialize: (thing) => {
         return {
            format: 'item',
            material: thing.material,
            amount: thing.amount,
            nbt: thing.nbt
         };
      },
      title: 'getter',
      unbreakable: 'setter'
   };
};
