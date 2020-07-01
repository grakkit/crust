const Player = Java.type('org.bukkit.entity.Player');
const LivingEntity = Java.type('org.bukkit.entity.LivingEntity');
const Attributable = Java.type('org.bukkit.attribute.Attributable');
const NamespacedKey = Java.type('org.bukkit.NamespacedKey');
const ChatMessageType = Java.type('net.md_5.bungee.api.ChatMessageType');
const TextComponent = Java.type('net.md_5.bungee.api.chat.TextComponent');
const PersistentDataType = Java.type('org.bukkit.persistence.PersistentDataType');

export const wrapper = (_, $) => {
   const NBTTagCompound = _.nms.NBTTagCompound;
   const util = {
      attributable: Attributable,
      attribute: {
         max_health: [ 0, 1024 ],
         follow_range: [ 0, 2048 ],
         knockback_resistance: [ 0, 1 ],
         movement_speed: [ 0, 1024 ],
         attack_damage: [ 0, 2048 ],
         armor: [ 0, 30 ],
         armor_toughness: [ 0, 20 ],
         attack_knockback: [ 0, 5 ],
         attack_speed: [ 0, 1024 ],
         luck: [ -1024, 1024 ],
         jump_strength: [ 0, 2 ],
         flying_speed: [ 0, 1024 ],
         spawn_reinforcements: [ 0, 1 ]
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
               const key = new NamespacedKey(core.plugin, `${uuid}/${value.name}`);
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
               const bar = server.getBossBar(new NamespacedKey(core.plugin, `${uuid}/${value.internal.name}`));
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
               return _.array(instance.getPassengers()).map((passenger) => $(passenger));
            },
            add: (value) => {
               instance.addPassenger($('-', value));
            },
            delete: (value) => {
               instance.removePassenger($('-', value));
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
      const alive = instance instanceof LivingEntity;
      const attributable = instance instanceof Attributable;
      const player = instance instanceof Player;
      const entity = {
         get ai () {
            instance.hasAI();
         },
         set ai (value) {
            instance.setAI(value);
         },
         get attribute () {
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
         set attribute (value) {
            _.keys($.attribute).forEach((key) => (entity.attribute[key] = value[key]));
         },
         get bars () {
            return util.bars(instance).get();
         },
         set bars (value) {
            util.bars(instance).set(value);
         },
         get block () {
            return $(instance.getLocation().getBlock());
         },
         get collidable () {
            instance.isCollidable();
         },
         set collidable (value) {
            instance.setCollidable(value);
         },
         get data () {
            const container = instance.getPersistentDataContainer();
            return _.object(_.array(container.getRaw().entrySet()), (entry) => {
               const directory = new NamespacedKey(...entry.getKey().split(':'));
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
               if (entry.getKey().split(':')[1] === core.plugin.getName()) {
                  container.remove(new NamespacedKey(core.plugin, entry.getKey().getKey()));
               }
            });
            _.entries(value).forEach((entry) => {
               container.set(
                  new NamespacedKey(core.plugin, entry.key),
                  PersistentDataType.STRING,
                  _.base.encode(JSON.stringify(core.serialize(entry.value)))
               );
            });
         },
         distance: (target, flat) => {
            return _.dist(entity.location, $('-', target), flat);
         },
         get effect () {
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
         set effect (value) {
            _.keys($.peType).forEach((key) => (entity.effect[key] = value[key]));
         },
         get equipment () {
            return util.remap($.equipmentSlot, (entry) => {
               const slot = util.equipment[entry.key];
               const pascal = _.pascal(slot);
               return {
                  get: () => {
                     if (alive) {
                        return $(instance.getEquipment()[`get${pascal}`]());
                     }
                  },
                  set: (value) => {
                     if (alive) {
                        value || (value = null);
                        instance.getEquipment()[`set${pascal}`]($('-', value));
                     }
                  }
               };
            });
         },
         set equipment (value) {
            _.keys($.equipmentSlot).forEach((key) => (instance.equipment[util.equipment[key]] = value[key]));
         },
         get glowing () {
            instance.isGlowing();
         },
         set glowing (value) {
            instance.setGlowing(value);
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
         get item () {
            return $(instance.getItemInHand());
         },
         set item (value) {
            instance.setItemInHand($('-', value));
         },
         get lifeform () {
            return $.entityType[instance.getType()];
         },
         set lifeform (value) {
            instance.setType($.entityType[value]);
         },
         get location () {
            return $(instance.getLocation());
         },
         set location (value) {
            instance.teleport(value);
         },
         get mode () {
            if (player) {
               return $.gameMode[instance.getGameMode()];
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
         get nbt () {
            return _.serialize(instance.getHandle().save(NBTTagCompound));
         },
         set nbt (value) {
            instance.getHandle().load(_.parse(value));
         },
         /*
         options: (key, value) => {
            if (key === undefined) {
               return _.object(_.entries(_.access()), (entry) => {
                  if (typeof entry.value === 'boolean') return { [entry.key]: entry.value };
               });
            } else if (value === undefined) {
               return instance[`get${_.pascal(key)}`]();
            } else {
               return instance[`set${_.pascal(key)}`](value);
            }
         },
         */
         options: (...args) => {},
         get passenger () {
            return util.passengers(instance).get();
         },
         set passenger (value) {
            util.passengers(instance).set(value);
         },
         remove: () => {
            if (player) {
               instance.kickPlayer('');
            } else {
               instance.remove();
            }
         },
         get silent () {
            instance.isSilent();
         },
         set silent (value) {
            instance.setSilent(value);
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
         sound: (noise, options) => {
            if (player) {
               options || (options = {});
               instance.playSound(
                  options.location ? $('-', options.location) : instance.getLocation(),
                  $.sound[noise],
                  $.soundCategory[options.category || 'master'],
                  options.volume || 1,
                  options.pitch || 1
               );
            }
         },
         get tag () {
            return util.tags(instance).get();
         },
         set tag (value) {
            util.tags(instance).set(value);
         },
         text: (message, type, raw) => {
            if (player) {
               typeof type === 'boolean' && (raw = type);
               raw || (message = _.color(message));
               switch (type) {
                  case 'action':
                     instance.sendMessage(ChatMessageType.ACTION_BAR, new TextComponent(message));
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
         get velocity () {
            return $(instance.getVelocity());
         },
         set velocity (value) {
            instance.setVelocity(value);
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
};

export const parser = (_, $) => {
   return (input) => {
      return $(`?${input.lifeform}`, $([ input.location ])).nbt(input.nbt);
   };
};

export const chain = (_, $) => {
   return {
      ai: 'setter',
      attribute: 'setterNest',
      bar: 'lister',
      block: 'getter',
      collidable: 'setter',
      data: 'appender',
      distance: 'runner',
      effect: 'setterNest',
      equipment: 'setterNest',
      glowing: 'setter',
      health: 'setter',
      instance: 'getter',
      invulnerable: 'setter',
      item: 'setter',
      lifeform: 'setter',
      location: 'setter',
      mode: 'setter',
      name: 'setter',
      nbt: 'appender',
      options: 'runner',
      passenger: 'lister',
      player: 'runner',
      remove: 'runner',
      serialize: (entity) => {
         return {
            format: 'entity',
            lifeform: entity.lifeform,
            location: $([ entity.location ]),
            data: entity.nbt
         };
      },
      silent: 'setter',
      sneaking: 'setter',
      sound: 'runner',
      tag: 'lister',
      text: 'runner',
      uuid: 'getter',
      velocity: 'setter',
      vitality: 'setter',
      world: 'setter'
   };
   /*
   options: (...args) => {
      if (args[0] === undefined) {
         return entities.map((entity) => entity.options());
      } else if (typeof args[0] === 'string') {
         if (args[1] === undefined) {
            return entities.map((entity) => entity.options(args[0]));
         } else {
            entities.map((entity) => entity.options(...args));
            return that;
         }
      } else {
         entities.map((entity) => {
            if (typeof args[0] === 'function') {
               args[0](entity.options());
            } else if (typeof args[0] === 'object') {
               _.entries(args[0]).forEach((entry) => entity.options(entry.key, entry.value));
            } else {
               args.forEach((arg) => entity.options(arg, !entity.options(arg)));
            }
         });
         return that;
      }
   },
   player: (...args) => {
      if (typeof args[0] === 'function') {
         entities.map((entity) => args[0](_.player(entity.instance.getUniqueId())));
         return that;
      } else {
         return entities.map((entity) => _.player(entity.instance.getUniqueId()));
      }
   }
   */
};
