const UUID = Java.type('java.util.UUID');
const Material = Java.type('org.bukkit.Material');
const ItemFlag = Java.type('org.bukkit.inventory.ItemFlag');
const NamespacedKey = Java.type('org.bukkit.NamespacedKey');

export const wrapper = (_, $) => {
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
         get damage () {
            if (meta) return meta.getDamage();
         },
         set damage (value) {
            if (typeof value === 'number') {
               thing.meta = (meta) => meta.setDamage(_.clamp(value, 0, instance.getType().getMaxDurability()));
            } else {
               throw 'TypeError: You must supply a numeric value!';
            }
         },
         get data () {
            if (meta) return $('+').data(meta.getPersistentDataContainer());
         },
         set data (value) {
            if (typeof value === 'object') {
               thing.meta = (meta) => $('+').data(meta.getPersistentDataContainer(), value);
            } else {
               throw 'TypeError: You must supply an object or null value!';
            }
         },
         get destroyable () {
            return _.array(meta.getDestroyableKeys()).map((key) => key.getKey());
         },
         set destroyable (value) {
            if (_.iterable(value)) {
               value = value.map((entry) => {
                  typeof entry === 'string' &&
                     (entry = entry.includes(':')
                        ? new NamespacedKey(...entry.split(':'))
                        : ($('+').fronts('material')[entry] || { getKey: () => {} }).getKey());
                  if (entry instanceof NamespacedKey) return entry;
                  else throw 'TypeError: That array contains invalid destroyable keys!';
               });
               thing.meta = (meta) => meta.setDestroyableKeys(_.collect(...value));
            } else {
               throw 'TypeError: You must supply an array of destroyable keys!';
            }
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
         get enchantments () {
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
         set enchantments (value) {
            if (typeof value === 'object') {
               value || (value = {});
               try {
                  _.keys($('+').fronts('enchantment')).forEach((key) => (thing.enchantments[key] = value[key] || 0));
               } catch (error) {
                  throw 'TypeError: That input contains invalid entries!';
               }
            } else {
               throw 'TypeError: You must supply an object or a null value!';
            }
         },
         get flags () {
            return _.array(meta.getItemFlags()).map((flag) => $('+').backs('itemFlag')[flag]);
         },
         set flags (value) {
            if (_.iterable(value)) {
               value = value.map((entry) => {
                  entry instanceof ItemFlag || (entry = $('+').fronts('itemFlag')[entry]);
                  if (entry) return entry;
                  else throw 'TypeError: That is not a valid item flag!';
               });
               thing.meta = (meta) => {
                  meta.removeItemFlags(..._.values($('+').fronts('itemFlag')));
                  meta.addItemFlags(...value);
               };
            } else {
               throw 'TypeError: You must supply an array!';
            }
         },
         get instance () {
            return instance;
         },
         get lore () {
            if (meta) return meta.getLore() && _.array(meta.getLore());
         },
         set lore (value) {
            if (typeof value[Symbol.iterator] !== 'function') throw 'You must supply an array or string value!';
            else thing.meta = (meta) => meta.setLore(_.iterable(value) ? value : value.split('\n'));
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
               meta && value(meta);
               meta && instance.setItemMeta(meta);
            } else {
               throw 'TypeError: You must supply a function!';
            }
         },
         modifier: (uuid) => {
            try {
               typeof uuid === 'string' && (uuid = _.uuid(uuid));
            } catch (value) {
               throw 'SyntaxError: Can not convert input to UUID!';
            }
            if (uuid instanceof UUID) {
               if (meta) {
                  let match;
                  _.values(Object.assign({}, thing.modifiers)).forEach((mods) => {
                     mods.instance().forEach((mod) => {
                        !match && uuid === mod.getUniqueId() && (match = $(mod));
                     });
                  });
                  if (!match) {
                     match = $({
                        format: 'modifier',
                        uuid: uuid.toString(),
                        amount: 0,
                        operation: 'add_number',
                        slot: null
                     });
                  }
                  return match;
               }
            } else {
               throw 'TypeError: You must supply a string value or a UUID!';
            }
         },
         get modifiers () {
            return _.define($('+').fronts('attribute'), (entry) => {
               if (meta) {
                  return {
                     get: () => {
                        const modifiers = meta.hasAttributeModifiers() && meta.getAttributeModifiers(entry.value);
                        return $(_.array(modifiers || []));
                     },
                     set: (value) => {
                        if (_.iterable(value)) {
                           value = value.map((mod) => {
                              typeof mod === 'number' && (mod = { amount: mod });
                              if (typeof mod === 'object' && typeof mod.amount === 'number') {
                                 mod.format = 'modifier';
                                 mod.slot || (mod.slot = null);
                                 mod.operation || (mod.operation = 'add_number');
                                 mod.uuid || (mod.uuid = _.uuid().toString());
                                 return mod;
                              } else {
                                 throw 'TypeError: That array contains an invalid modifier!';
                              }
                           });
                           thing.meta = (meta) => {
                              meta.removeAttributeModifier(entry.value);
                              value.map((mod) => meta.addAttributeModifier(entry.value, $('+').instance(mod)));
                           };
                        } else if (value === null) {
                           thing.meta = (meta) => {
                              meta.removeAttributeModifier(entry.value);
                           };
                        } else {
                           throw 'TypeError: You must supply a null value or an array of modifiers!';
                        }
                     }
                  };
               }
            });
         },
         set modifiers (value) {
            if (typeof value === 'object') {
               value || (value = {});
               try {
                  _.keys($('+').fronts('attribute')).forEach((key) => (thing.modifiers[key] = value[key] || null));
               } catch (error) {
                  throw 'TypeError: That input contains invalid entries!';
               }
            } else {
               throw 'TypeError: You must supply an object or a null value!';
            }
         },
         get bars () {
            if (player) return _.array(server.getBossBars());
         },
         set bars (value) {
            if (_.iterable(value)) {
               const input = value.map((key) => {
                  try {
                     return key instanceof NamespacedKey ? key : new NamespacedKey(...key.split(':'));
                  } catch (error) {
                     throw 'TypeError: That array contains invalid namespaced keys!';
                  }
               });
               player && thing.bars.forEach((bar) => bar.removePlayer(instance));
               player && input.forEach((key) => server.getBossBar(key).addPlayer(instance));
            } else {
               throw 'TypeError: You must supply an array of namespaced keys!';
            }
         },
         get name () {
            if (meta) return meta.getDisplayName();
         },
         set name (value) {
            if (typeof value === 'string') thing.meta = (meta) => meta.setDisplayName(value);
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
         get placeable () {
            return _.array(meta.getPlaceableKeys()).map((key) => key.getKey());
         },
         set placeable (value) {
            if (_.iterable(value)) {
               value = value.map((entry) => {
                  typeof entry === 'string' &&
                     (entry = entry.includes(':')
                        ? new NamespacedKey(...entry.split(':'))
                        : ($('+').fronts('material')[entry] || { getKey: () => {} }).getKey());
                  if (entry instanceof NamespacedKey) return entry;
                  else throw 'TypeError: That array contains invalid placeable keys!';
               });
               thing.meta = (meta) => meta.setPlaceableKeys(_.collect(...value));
            } else {
               throw 'TypeError: You must supply an array of placeable keys!';
            }
         },
         get title () {
            return instance.getI18NDisplayName();
         },
         get unbreakable () {
            if (meta) return meta.isUnbreakable();
         },
         set unbreakable (value) {
            if (typeof value === 'boolean') thing.meta = (meta) => meta.setUnbreakable(value);
            else throw 'TypeError: You must supply a boolean value!';
         }
      };
      return thing;
   };
};

export const parser = (_, $) => {
   return (input) => {
      return $(`!${input.material}`).amount(input.amount).nbt(input.nbt).instance();
   };
};

export const chain = (_, $) => {
   return {
      amount: 'setter',
      damage: 'setter',
      data: 'appender',
      destroyable: 'setter',
      drop: 'runnerLink',
      enchantments: 'setterNest',
      flags: 'setter',
      instance: 'getter',
      lore: 'setter',
      material: 'setter',
      meta: (thing, value) => {
         _.def(value) && (thing.meta = value);
         return thing.meta;
      },
      modifier: 'runnerLink',
      modifiers: 'setterLinkNest',
      name: 'setter',
      nbt: 'appender',
      placeable: 'setter',
      serialize: (thing) => {
         if (_.def(thing)) {
            return {
               format: 'item',
               material: thing.material,
               amount: thing.amount,
               nbt: thing.nbt
            };
         } else {
            return null;
         }
      },
      title: 'getter',
      unbreakable: 'setter'
   };
};
