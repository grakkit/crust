export function wrapper (_, API) {
   const util = {
      attributable: Java.type('org.bukkit.attribute.Attributable'),
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
      color: (text) => {
         return text.replace(/(&)/g, '§').replace(/(§§)/g, '&');
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
               return _.array(instance.getPassengers());
            },
            add: (value) => {
               instance.addPassenger((value && value.one) || value);
            },
            delete: (value) => {
               instance.removePassenger((value && value.one) || value);
            },
            clear: () => {
               instance.eject();
            }
         });
      },
      tags: (instance) => {
         return _.mirror({
            get array () {
               return _.array(instance.getScoreboardTags());
            },
            add: (value) => {
               instance.getScoreboardTags().add(value);
            },
            remove: (value) => {
               instance.getScoreboardTags().remove(value);
            },
            clear: () => {
               instance.getScoreboardTags().clear();
            }
         });
      }
   };
   return (instance) => {
      const alive = instance instanceof Java.type('org.bukkit.entity.LivingEntity');
      const attributable = instance instanceof Java.type('org.bukkit.attribute.Attributable');
      const player = instance instanceof Java.type('org.bukkit.entity.Player');
      const entity = {
         get attributes () {
            return _.define(API.attribute, (entry) => {
               if (attributable) {
                  const attribute = instance.getAttribute(entry.value);
                  if (attribute) {
                     return {
                        get: () => {
                           return attribute.getBaseValue();
                        },
                        set: (value) => {
                           value || (value = attribute.getDefaultValue());
                           attribute.setBaseValue(_.clamp(value, ...util.attribute[entry.key]));
                        }
                     };
                  }
               }
            });
         },
         set attributes (value) {
            _.keys(API.attribute).forEach((key) => (entity.attributes[key] = value[key]));
         },
         get effects () {
            return _.define(API.peType, (entry) => {
               return {
                  get: () => {
                     if (alive) {
                        const effect = instance.getPotionEffect(entry.value);
                        if (effect) return { duration: effect.getDuration(), amplifier: effect.getAmplifier() + 1 };
                     }
                  },
                  set: (value) => {
                     if (alive) {
                        value || (value = {});
                        const duration = _.clamp(value.duration || 0, 0, 2147483647);
                        const amplifier = _.clamp(value.amplifier || 0, 0, 255);
                        if (duration > 0 && amplifier > 0) {
                           instance.addPotionEffect(entry.value.createEffect(duration, amplifier - 1), true);
                        } else {
                           instance.removePotionEffect(entry.value);
                        }
                     }
                  }
               };
            });
         },
         set effects (value) {
            _.keys(API.peType).forEach((key) => (entity.effects[key] = value[key]));
         },
         get equipment () {
            return _.define(API.equipmentSlot, (entry) => {
               const slot = util.equipment[entry.key];
               const pascal = _.pascal(slot);
               return {
                  get: () => {
                     if (alive) {
                        return instance.getEquipment()[`get${pascal}`]();
                     }
                  },
                  set: (value) => {
                     if (alive) {
                        value || (value = null);
                        instance.getEquipment()[`set${pascal}`]((value && value.one) || value);
                     }
                  }
               };
            });
         },
         set equipment (value) {
            _.keys(API.equipmentSlot).forEach((key) => (instance.equipment[util.equipment[key]] = value[key]));
         },
         get health () {
            if (alive) {
               return instance.getHealth();
            }
         },
         set health (value) {
            if (alive) {
               instance.setHealth(_.clamp(value, 0, instance.getMaxHealth()));
            }
         },
         get invulnerable () {
            return instance.isInvulnerable();
         },
         set invulnerable (value) {
            instance.setInvulnerable(value);
         },
         get lifeform () {
            return _.key(API.entityType, instance.getType());
         },
         set lifeform (value) {
            instance.setType(API.entityType[value]);
         },
         get mode () {
            if (player) {
               return _.key(API.gameMode, instance.getGameMode());
            }
         },
         set mode (value) {
            if (player) {
               return instance.setGameMode(API.gameMode[value]);
            }
         },
         get name () {
            if (player) {
               return instance.getDisplayName();
            } else {
               return instance.getCustomName();
            }
         },
         set name (value) {
            if (player) {
               instance.setDisplayName(value);
               instance.setPlayerListName(value);
            } else {
               instance.setCustomName(value);
               instance.setCustomNameVisible(value !== null);
            }
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
         },
         text: (message, type, raw) => {
            if (player) {
               typeof type === 'boolean' && (raw = type);
               raw || (message = util.color(message));
               switch (type) {
                  case 'action':
                     const action = Java.type('net.md_5.bungee.api.ChatMessageType').ACTION_BAR;
                     const component = Java.type('net.md_5.bungee.api.chat.TextComponent');
                     instance.sendMessage(action, new component(message));
                     break;
                  case 'title':
                     break;
                  default:
                     instance.sendMessage(message);
                     break;
               }
            }
         },
         get uuid () {
            return instance.getUniqueId().toString();
         },
         get vitality () {
            if (alive) {
               return instance.getMaxHealth();
            }
         },
         set vitality (value) {
            if (alive) {
               instance.setMaxHealth(value);
            }
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
               entities.map((entity) => (entity.effects[args[0]] = { duration: args[1], amplifier: args[2] }));
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
         invulnerable: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.invulnerable);
            } else {
               entities.map((entity) => (entity.invulnerable = args[0]));
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
         mode: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.mode);
            } else {
               entities.map((entity) => (entity.mode = args[0]));
               return that;
            }
         },
         name: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.name);
            } else {
               entities.map((entity) => (entity.name = args[0]));
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
         },
         text: (...args) => {
            entities.map((entity) => entity.text(...args));
            return that;
         },
         uuid: () => {
            return entities.map((entity) => entity.uuid);
         },
         vitality: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.vitality);
            } else {
               entities.map((entity) => (entity.vitality = args[0]));
               return that;
            }
         }
      };
      return that;
   };
}

export const links = [
   'attribute',
   'effect',
   'equipment',
   'health',
   'invulnerable',
   'lifeform',
   'mode',
   'name',
   'passenger',
   'tag',
   'text',
   'uuid',
   'vitality'
];
