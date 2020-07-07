const Note = Java.type('org.bukkit.Note');
const Player = Java.type('org.bukkit.entity.Player');
const LivingEntity = Java.type('org.bukkit.entity.LivingEntity');
const Attributable = Java.type('org.bukkit.attribute.Attributable');
const NamespacedKey = Java.type('org.bukkit.NamespacedKey');
const TextComponent = Java.type('net.md_5.bungee.api.chat.TextComponent');
const ChatMessageType = Java.type('net.md_5.bungee.api.ChatMessageType');
const InventoryHolder = Java.type('org.bukkit.inventory.InventoryHolder');
const PersistentDataType = Java.type('org.bukkit.persistence.PersistentDataType');

export const wrapper = (_, $) => {
   const util = {
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
               typeof value === 'string' && (value = { name: value });
               if (typeof value === 'object') {
                  if (typeof value.amount === 'number') {
                     const key = new NamespacedKey(core.plugin, `${uuid}/${value.name}`);
                     let bar = server.getBossBar(key);
                     if (!bar) {
                        bar = server.createBossBar(key, '', $.barColor.white, $.barStyle.solid);
                        Object.assign(util.bar(bar), {
                           title: value.title || '',
                           progress: value.progress || 0,
                           color: value.color || 'white',
                           style: value.style || 'solid',
                           flags: value.flags || []
                        });
                     }
                     return bar;
                  } else {
                     throw 'TypeError: That is not a valid boss bar object!';
                  }
               } else {
                  throw 'TypeError: You must supply a string value or boss bar object!';
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
            },
            get: (bars, input) => {
               return bars.filter((bar) => bar.internal.key.split('/')[1] === input)[0];
            }
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
               instance.addPassenger($(':standardize', value));
            },
            delete: (value) => {
               instance.removePassenger($(':standardize', value));
            },
            clear: () => {
               instance.eject();
            }
         });
      },
      remap: (source, consumer) => {
         return _.define(source, (entry) => {
            if (entry.key === _.lower(entry.key)) return consumer(entry);
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
      const inventory = instance instanceof InventoryHolder;
      const thing = {
         get ai () {
            if (alive) return instance.hasAI();
         },
         set ai (value) {
            alive && instance.setAI(value);
         },
         get attribute () {
            return _.define($('+').fronts('attribute'), (entry) => {
               if (attributable) {
                  const attribute = instance.getAttribute(entry.value);
                  if (attribute) {
                     return {
                        get: () => {
                           return attribute.getBaseValue();
                        },
                        set: (value) => {
                           if (value === null || typeof value === 'number') {
                              _.def(value) || (value = attribute.getDefaultValue());
                              attribute.setBaseValue(_.clamp(value, ...util.attribute[entry.key]));
                           } else {
                              throw 'You must supply a null value or a numeric value!';
                           }
                        }
                     };
                  }
               }
            });
         },
         set attribute (value) {
            if (typeof value === 'object') {
               value || (value = {});
               try {
                  _.keys($('+').fronts('attribute')).forEach((key) => (thing.attribute[key] = value[key] || null));
               } catch (error) {
                  throw 'That input contains invalid entries!';
               }
            } else {
               throw 'You must supply an object or a null value!';
            }
         },
         get bar () {
            if (player) return util.bars(instance).get();
         },
         set bar (value) {
            player && util.bars(instance).set(value);
         },
         get block () {
            return instance.getLocation().getBlock();
         },
         get collidable () {
            if (alive) return instance.isCollidable();
         },
         set collidable (value) {
            if (typeof value === 'boolean') {
               alive && instance.setCollidable(value);
            } else {
               throw 'You must supply a boolean value!';
            }
         },
         get data () {
            return $('+').data(instance.getPersistentDataContainer());
         },
         set data (value) {
            $('+').data(instance.getPersistentDataContainer(), value);
         },
         distance: (target, option) => {
            try {
               return $('+').distance(instance.location, target, option);
            } catch (error) {
               switch (error) {
                  case 'invalid-both':
                  case 'invalid-source':
                     throw 'ImpossibleError: How the fuck are you seeing this error!?';
                  case 'invalid-target':
                     throw 'Argument 1 must be a location, vector, or have a location or vector attached!';
               }
            }
         },
         get effect () {
            return _.define($('+').fronts('peType'), (entry) => {
               if (alive) {
                  return {
                     get: () => {
                        const effect = instance.getPotionEffect(entry.value);
                        if (effect) return { duration: effect.getDuration(), amplifier: effect.getAmplifier() + 1 };
                     },
                     set: (value) => {
                        if (typeof value === 'object') {
                           value || (value = {});
                           const duration = _.clamp(value.duration || 0, 0, 2147483647);
                           const amplifier = _.clamp(value.amplifier || 0, 0, 255);
                           if (duration > 0 && amplifier > 0) {
                              instance.addPotionEffect(entry.value.createEffect(duration, amplifier - 1), true);
                           } else {
                              instance.removePotionEffect(entry.value);
                           }
                        } else {
                           throw 'You must supply an object or a null value!';
                        }
                     }
                  };
               }
            });
         },
         set effect (value) {
            if (typeof value === 'object') {
               value || (value = {});
               try {
                  _.keys($('+').fronts('peType')).forEach((key) => (thing.effect[key] = value[key] || null));
               } catch (error) {
                  throw 'That input contains invalid entries!';
               }
            } else {
               throw 'You must supply an object or a null value!';
            }
         },
         get equipment () {
            return _.define($('+').fronts('equipmentSlot'), (entry) => {
               if (alive) {
                  const slot = util.equipment[entry.key];
                  const pascal = _.pascal(slot);
                  return {
                     get: () => {
                        return instance.getEquipment()[`get${pascal}`]();
                     },
                     set: (value) => {
                        value = $('+').instance(value);
                        if (value === null || value instanceof ItemStack) {
                           instance.getEquipment()[`set${pascal}`](value);
                        } else {
                           throw 'You must supply an item stack or a null value!';
                        }
                     }
                  };
               }
            });
         },
         set equipment (value) {
            if (typeof value === 'object') {
               value || (value = {});
               try {
                  _.keys($('+').fronts('equipmentSlot')).forEach((key) => (thing.equipment[key] = value[key] || null));
               } catch (error) {
                  throw 'That input contains invalid entries!';
               }
            } else {
               throw 'You must supply an object or a null value!';
            }
         },
         get glowing () {
            return instance.isGlowing();
         },
         set glowing (value) {
            instance.setGlowing(value);
         },
         get health () {
            if (alive) return instance.getHealth();
         },
         set health (value) {
            alive && instance.setHealth(_.clamp(value, 0, instance.getMaxHealth()));
         },
         get instance () {
            return instance;
         },
         get inventory () {
            if (inventory) return $(instance.getInventory());
         },
         set inventory (value) {
            if (inventory) instance.getInventory().setContents($(':standardize', value));
         },
         get invulnerable () {
            return instance.isInvulnerable();
         },
         set invulnerable (value) {
            instance.setInvulnerable(value);
         },
         get item () {
            return instance.getItemInHand();
         },
         set item (value) {
            value = $('+').instance(value);
            if (value === null || value instanceof ItemStack) {
               instance.setItemInHand(value);
            } else {
               throw 'You must supply an item stack or a null value!';
            }
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
            return _.serialize(instance.getHandle().save(new _.nms.NBTTagCompound()));
         },
         set nbt (value) {
            instance.getHandle().load(_.parse(value));
         },
         /*
         note: (type, value) => {
            if (player) {
               instance.sendBlockChange(entity.location.instance(), $.material.note_block.createBlockData());
               instance.playNote(entity.location.instance(), $.instrument[type], new Note(_.clamp(value, 0, 24)));
               instance.sendBlockChange(entity.location.instance(), $.material.air.createBlockData());
            }
         },
         */
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
                  options.location ? $(':standardize', options.location) : instance.getLocation(),
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
                     instance.sendTitle(...message.split('\n'), 10, 70, 20);
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
         get vector () {
            return thing.location.vector;
         },
         set vector (value) {
            thing.location.vector = value;
         },
         get velocity () {
            return $(instance.getVelocity());
         },
         set velocity (value) {
            instance.setVelocity($(':standardize', value));
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
      return thing;
   };
};

export const parser = (_, $) => {
   return (input) => {
      return $(`?${input.lifeform}`, $(input.location)).nbt(input.nbt);
   };
};

export const chain = (_, $) => {
   return {
      ai: 'setter',
      attribute: 'setterNest',
      bar: 'lister',
      block: 'getterLink',
      collidable: 'setter',
      data: 'appender',
      distance: 'runner',
      effect: 'setterNest',
      equipment: 'setterNest',
      glowing: 'setter',
      health: 'setter',
      instance: 'getter',
      inventory: 'setter',
      invulnerable: 'setter',
      item: 'setterLink',
      lifeform: 'setter',
      location: 'setterLink',
      mode: 'setter',
      name: 'setter',
      nbt: 'appender',
      note: 'runner',
      passenger: 'lister',
      player: 'getterLink',
      remove: 'voider',
      serialize: (thing) => {
         return {
            format: 'entity',
            lifeform: thing.lifeform,
            location: thing.location,
            nbt: data.nbt
         };
      },
      silent: 'setter',
      sneaking: 'getter',
      sound: 'voider',
      tag: 'lister',
      text: 'voider',
      uuid: 'getter',
      vector: 'setterLink',
      velocity: 'setterLink',
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

// /js $(self).sound('block_note_block_bit', { pitch: x })

/*
[
   0.5, //                0.5
   0.5297315471796477, // 0.52972412109375
   0.5612310241546865, // 0.56121826171875
   0.5946035575013605, // 0.5945892333984375
   0.6299605249474366, // 0.6299591064453125
   0.6674199270850172,
   0.7071067811865476,
   0.7491535384383408,
   0.7937005259840997,
   0.8408964152537145,
   0.8908987181403393,
   0.9438743126816934,
   1,
   1.0594630943592953,
   1.122462048309373,
   1.189207115002721,
   1.2599210498948732,
   1.3348398541700344,
   1.4142135623730951,
   1.4983070768766815,
   1.5874010519681996,
   1.681792830507429,
   1.7817974362806785,
   1.887748625363387,
   2
]
*/
