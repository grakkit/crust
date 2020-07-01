export function wrapper (_, $) {
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
      bar: (bar) => {
         const internal = {
            get key () {
               return bar.getKey().getKey();
            },
            get title () {
               return bar.getTitle();
            },
            set title (value) {
               bar.setTitle(value);
            },
            get progress () {
               return bar.getProgress();
            },
            set progress (value) {
               bar.setProgress(value);
            },
            get color () {
               return $.barColor[bar.getColor()];
            },
            set color (value) {
               bar.setColor($.barColor[value]);
            },
            get style () {
               return $.barStyle[bar.getStyle()];
            },
            set style (value) {
               bar.setStyle($.barStyle[value]);
            },
            get flags () {
               return util.flags(bar).get();
            },
            set flags (value) {
               util.flags(bar).set(value);
            }
         };
         const that = {
            get internal () {
               return internal;
            },
            title: (value) => {
               if (value === undefined) {
                  return internal.title;
               } else {
                  internal.title = value;
                  return that;
               }
            },
            progress: (value) => {
               if (value === undefined) {
                  return internal.progress;
               } else {
                  internal.progress = value;
                  return that;
               }
            },
            color: (value) => {
               if (value === undefined) {
                  return internal.color;
               } else {
                  internal.color = value;
                  return that;
               }
            },
            style: (value) => {
               if (value === undefined) {
                  return internal.style;
               } else {
                  internal.style = value;
                  return that;
               }
            },
            flags: (...args) => {
               if (args[0] === undefined) {
                  return internal.flags;
               } else {
                  if (typeof args[0] === 'function') {
                     args[0](internal.flags);
                  } else {
                     internal.flags = args;
                  }
                  return that;
               }
            }
         };
         return that;
      },
      bars: (instance) => {
         const uuid = instance.getUniqueId().toString();
         return _.mirror({
            get array () {
               return _.array(server.getBossBars())
                  .filter((bar) => bar.getKey().getNamespace() === core.plugin.getName())
                  .filter((bar) => bar.getKey().getKey().split('/')[0] === uuid)
                  .map(util.bar);
            },
            add: (value) => {
               const key = util.key(core.plugin, `${uuid}/${value.name}`);
               if (!server.getBossBar(key)) {
                  const bar = server.createBossBar(key, '', $.barColor.white, $.barStyle.solid);
                  Object.assign(util.bar(bar), {
                     title: value.title || '',
                     progress: value.progress || 0,
                     color: value.color || 'white',
                     style: value.style || 'solid',
                     flags: value.flags || []
                  });
                  bar.addPlayer(instance);
               }
            },
            delete: (value) => {
               const bar = server.getBossBar(util.key(core.plugin, `${uuid}/${value.internal.name}`));
               if (bar) {
                  bar.removePlayer(instance);
                  server.removeBossBar(bar.getKey());
               }
            },
            clear: () => {
               _.array(server.getBossBars())
                  .filter((bar) => bar.getKey().getNamespace() === core.plugin.getName())
                  .filter((bar) => bar.getKey().getKey().split('/')[0] === uuid)
                  .forEach((bar) => {
                     bar.removePlayer(instance);
                     server.removeBossBar(bar.getKey());
                  });
            }
         });
      },
      color: (text) => {
         return text.replace(/(&)/g, '§').replace(/(§§)/g, '&');
      },
      key: (...args) => {
         return new (Java.type('org.bukkit.NamespacedKey'))(...args);
      },
      remap: (source, consumer) => {
         return _.define(source, (entry) => {
            if (entry.key === _.lower(entry.key)) return consumer(entry);
         });
      },
      equipment: {
         chest: 'chestplate',
         feet: 'boots',
         hand: 'itemInMainHand',
         head: 'helmet',
         legs: 'leggings',
         off_hand: 'itemInOffHand'
      },
      flags: (bar) => {
         return _.mirror({
            get array () {
               const output = [];
               util.remap($.barFlag, (entry) => bar.hasFlag(entry.value) && output.push(entry.key));
               return output;
            },
            add: (value) => {
               bar.addFlag($.barFlag[value]);
            },
            remove: (value) => {
               bar.removeFlag($.barFlag[value]);
            },
            clear: () => {
               util.remap($.barFlag, (entry) => bar.removeFlag(entry.value));
            }
         });
      },
      passengers: (instance) => {
         return _.mirror({
            get array () {
               return _.array(instance.getPassengers());
            },
            add: (value) => {
               instance.addPassenger((value && value.instance && value.instance()) || value);
            },
            delete: (value) => {
               instance.removePassenger((value && value.instance && value.instance()) || value);
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
            return util.remap($.attribute, (entry) => {
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
            _.keys($.attribute).forEach((key) => (entity.attributes[key] = value[key]));
         },
         get bars () {
            return util.bars(instance).get();
         },
         set bars (value) {
            util.bars(instance).set(value);
         },
         get data () {
            const container = instance.getPersistentDataContainer();
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
         },
         set data (value) {
            const container = instance.getPersistentDataContainer();
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
         },
         distance: (target, flat) => {
            return _.dist(entity.location, target, flat);
         },
         get effects () {
            return util.remap($.peType, (entry) => {
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
            _.keys($.peType).forEach((key) => (entity.effects[key] = value[key]));
         },
         get equipment () {
            return util.remap($.equipmentSlot, (entry) => {
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
                        instance.getEquipment()[`set${pascal}`]((value && value.instance && value.instance()) || value);
                     }
                  }
               };
            });
         },
         set equipment (value) {
            _.keys($.equipmentSlot).forEach((key) => (instance.equipment[util.equipment[key]] = value[key]));
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
         get instance () {
            return instance;
         },
         get invulnerable () {
            return instance.isInvulnerable();
         },
         set invulnerable (value) {
            instance.setInvulnerable(value);
         },
         get lifeform () {
            return _.key($.entityType, instance.getType());
         },
         set lifeform (value) {
            instance.setType($.entityType[value]);
         },
         get location () {
            return instance.getLocation();
         },
         set location (value) {
            instance.teleport(value);
         },
         get mode () {
            if (player) {
               return _.key($.gameMode, instance.getGameMode());
            }
         },
         set mode (value) {
            if (player) {
               return instance.setGameMode($.gameMode[value]);
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
         get sneaking () {
            if (player) {
               return instance.isSneaking();
            }
         },
         set sneaking (value) {
            if (player) {
               instance.setSneaking(value);
            }
         },
         sound: (type, options) => {},
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
         },
         get world () {
            return instance.getLocation().getWorld();
         },
         set world (world) {
            instance.teleport(world.getSpawnLocation());
         }
      };
      return entity;
   };
}

export function chainer (_, $) {
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
         bar: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.bars);
            } else if (typeof args[0] === 'string') {
               return entities.map((entity) => {
                  return entity.bars.filter((bar) => args[0] === bar.internal.key.split('/')[1])[0];
               });
            } else {
               entities.map((entity) => {
                  if (typeof args[0] === 'function') {
                     args[0](entity.bars);
                  } else {
                     entity.bars.clear();
                     args.forEach(entity.bars.add);
                  }
               });
               return that;
            }
         },
         data: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.data);
            } else {
               entities.map((entity) => {
                  const data = entity.data;
                  if (typeof args[0] === 'function') {
                     args[0](data);
                     entity.data = data;
                  } else {
                     entity.data = args[0];
                  }
               });
               return that;
            }
         },
         distance: (...args) => {
            return entities.map((entity) => entity.distance(...args));
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
         instance: () => {
            return entities.map((entity) => entity.instance);
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
         location: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.location);
            } else {
               entities.map((entity) => (entity.location = args[0]));
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
         player: () => {
            return entities.map((entity) => _.player(entity.instance.getUniqueId()));
         },
         serialize: (...args) => {
            return {};
         },
         sneaking: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.sneaking);
            } else {
               entities.map((entity) => (entity.sneaking = args[0]));
               return that;
            }
         },
         sound: (...args) => {
            entities.map((entity) => entity.sound(...args));
            return that;
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
         },
         world: (...args) => {
            if (args[0] === undefined) {
               return entities.map((entity) => entity.world);
            } else {
               entities.map((entity) => (entity.world = args[0]));
               return that;
            }
         }
      };
      return that;
   };
}

export function parser (_, $) {}

export const links = [
   'attribute',
   'bar',
   'data',
   'distance',
   'effect',
   'equipment',
   'health',
   'instance',
   'invulnerable',
   'lifeform',
   'location',
   'mode',
   'name',
   'passenger',
   'player',
   'serialize',
   'sneaking',
   'sound',
   'tag',
   'text',
   'uuid',
   'vitality',
   'world'
];
