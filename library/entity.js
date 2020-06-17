export function wrapper (_, API) {
   const util = {
      attribute: {
         generic_max_health: [ 0, 1024 ],
         generic_follow_range: [ 0, 2048 ],
         generic_knockback_resistance: [ 0, 1 ],
         generic_movement_speed: [ 0, 1024 ],
         generic_attack_damage: [ 0, 2048 ],
         generic_armor: [ 0, 30 ],
         generic_armor_toughness: [ 0, 20 ],
         generic_attack_knockback: [ 0, 5 ],
         generic_attack_speed: [ 0, 1024 ],
         generic_luck: [ -1024, 1024 ],
         horse_jump_strength: [ 0, 2 ],
         generic_flying_speed: [ 0, 1024 ],
         zombie_spawn_reinforcements: [ 0, 1 ]
      },
      equipment: {
         chest: 'chestplate',
         feet: 'boots',
         hand: 'itemInMainHand',
         head: 'helmet',
         legs: 'leggings',
         off_hand: 'itemInOffHand'
      },
      passengers: (instance) => {
         return _.mirror({
            get array () {
               return core.array(instance.passengers);
            },
            add: (value) => {
               instance.addPassenger(value.instance || value);
            },
            delete: (value) => {
               instance.removePassenger(value.instance || value);
            },
            clear: () => {
               instance.eject();
            }
         });
      },
      tags: (instance) => {
         return _.mirror({
            get array () {
               return instance.scoreboardTags;
            },
            add: (value) => {
               instance.scoreboardTags.add(value);
            },
            remove: (value) => {
               instance.scoreboardTags.remove(value);
            },
            clear: () => {
               instance.scoreboardTags.clear();
            }
         });
      }
   };
   return (instance) => {
      const entity = {
         instance: instance,
         get attributes () {
            return _.define(API.attribute, (entry) => {
               const attribute = instance.getAttribute(entry.value);
               if (attribute) {
                  return {
                     get: () => {
                        return attribute.baseValue;
                     },
                     set: (value) => {
                        attribute.baseValue = _.clamp(value || attribute.defaultValue, ...util.attribute[entry.key]);
                     }
                  };
               }
            });
         },
         set attributes (value) {
            _.keys(API.attribute).forEach((key) => {
               entity.attributes[key] = value[key] || entity.getAttribute(API.attribute[key]).defaultValue;
            });
         },
         get effects () {
            return _.define(API.potionEffectType, (entry) => {
               return {
                  get: () => {
                     const effect = instance.getPotionEffect(entry.value);
                     if (effect) return { amplifier: effect.amplifier, duration: effect.duration };
                  },
                  set: (value) => {
                     if (value.amplifier > 0 && value.duration > 0) {
                        instance.addPotionEffect(entry.value.createEffect(value.duration, value.amplifier), true);
                     } else {
                        instance.removePotionEffect(entry.value);
                     }
                  }
               };
            });
         },
         set effects (value) {
            _.keys(API.potionEffectType).forEach((key) => (entity.effects[key] = value[key] || {}));
         },
         get equipment () {
            return _.define(API.equipmentSlot, (entry) => {
               const slot = util.equipment[entry.key];
               return {
                  get: () => {
                     return instance.equipment[slot];
                  },
                  set: (value) => {
                     instance.equipment[slot] = value;
                  }
               };
            });
         },
         set equipment (value) {
            core.keys(API.equipmentSlot).forEach((key) => {
               instance.equipment[util.equipment[key]] = value[key] || null;
            });
         },
         get health () {
            return instance.health;
         },
         set health (value) {
            instance.health = _.clamp(value, 0, instance.maxHealth);
         },
         get lifeform () {
            return _.key(API.entityType, instance.type.instance);
         },
         set lifeform (value) {
            instance.type = API.entityType[value];
         },
         get passengers () {
            return util.passengers(instance).get();
         },
         set passengers (value) {
            util.passengers(instance).set(value);
         },
         get tags () {
            return util.tags(instance).get();
         },
         set tags (value) {
            util.tags(instance).set(value);
         }
      };
      return entity;
   };
}

export function chainer (_, API) {
   return (...entities) => {
      const that = {
         attribute: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.attributes);
            } else if (args[1] === undefined) {
               return entities.map((entity) => entity.attributes[args[0]]);
            } else {
               entities.map((entity) => (entity.attributes[args[0]] = args[1]));
               return that;
            }
         },
         effect: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.effects);
            } else if (args[1] === undefined) {
               return entities.map((entity) => entity.effects[args[0]]);
            } else {
               entities.map((entity) => (entity.effects[args[0]] = { amplifier: args[1], duration: args[2] }));
               return that;
            }
         },
         equipment: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.equipment);
            } else if (args[1] === undefined) {
               return entities.map((entity) => entity.equipment[args[0]]);
            } else {
               entities.map((entity) => (entity.equipment[args[0]] = args[1]));
               return that;
            }
         },
         health: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.health);
            } else {
               entities.map((entity) => (entity.health = args[0]));
               return that;
            }
         },
         lifeform: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.lifeform);
            } else {
               entities.map((entity) => (entity.lifeform = args[0]));
               return that;
            }
         },
         passenger: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.passengers);
            } else {
               entities.map((entity) => {
                  if (typeof args[0] === 'function') {
                     args[0](entity.passengers);
                  } else {
                     entity.passengers.clear();
                     args.forEach(entity.passengers.add);
                  }
               });
               return that;
            }
         },
         tag: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.tags);
            } else {
               entities.map((entity) => {
                  if (typeof args[0] === 'function') {
                     args[0](entity.tags);
                  } else {
                     entity.tags.clear();
                     args.forEach(entity.tags.add);
                  }
               });
               return that;
            }
         }
      };
      return that;
   };
}

export const links = [ 'attribute', 'effect', 'equipment', 'health', 'lifeform', 'passenger', 'tag' ];
