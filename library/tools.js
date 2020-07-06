const Vector = Java.type('org.bukkit.util.Vector');
const Location = Java.type('org.bukkit.Location');
const ItemStack = Java.type('org.bukkit.inventory.ItemStack');
const Cancellable = Java.type('org.bukkit.event.Cancellable');
const NamespacedKey = Java.type('org.bukkit.NamespacedKey');
const PersistentDataType = Java.type('org.bukkit.persistence.PersistentDataType');

export const bridge = (_, $) => {
   return (input, ...args) => {
      let index = -1;
      const words = [];
      input.split('.').forEach((node) => {
         node.split('').map((char) => {
            if (char === _.upper(char)) words[++index] = char;
            else if (words[index]) words[index] += char;
         });
         ++index;
      });
      let key = '';
      const terms = _.flat(words);
      if (terms.length < 3) key = _.camel(terms.join(' '), ' ');
      else if (terms.length === 3) key = _.lower(terms[0][0] + terms[1][0]) + terms[2];
      else key = _.lower(terms.slice(0, -2).map((term) => term[0]).join('')) + terms.slice(-2).join('');
      return {
         [key]: _.object(_.array(Java.type(input).values()), (value) => {
            if (!args[0] || !args[0](value)) {
               let name = '';
               if (args[1]) name = args[1](value);
               else if (typeof value.getKey === 'function') name = value.getKey().getKey();
               else name = _.lower(value.name());
               return { [name]: value, [value]: name };
            }
         })
      };
   };
};

export const builder = (_, $) => {
   return (library) => {
      const chain = library.chain(_, $);
      return {
         wrapper: library.wrapper(_, $),
         parser: library.parser(_, $),
         chainer: (things, slayer) => {
            const that = {};
            const properties = {
               appender: (property) => {
                  return (...args) => {
                     if (!_.def(args[0])) {
                        return things.map((thing) => thing[property]);
                     } else {
                        things.map((thing) => {
                           if (typeof args[0] === 'function') {
                              const value = thing[property];
                              args[0](value);
                              thing[property] = value;
                           } else {
                              thing[property] = args[0];
                           }
                        });
                        return that;
                     }
                  };
               },
               getter: (property) => {
                  return (...args) => {
                     if (typeof args[0] === 'function') {
                        things.map((thing) => args[0](thing[property]));
                        return that;
                     } else {
                        return things.map((thing) => thing[property]);
                     }
                  };
               },
               getterLink: (property) => {
                  return (...args) => {
                     if (typeof args[0] === 'function') {
                        args[0]($(things.map((thing) => thing[property])));
                        return that;
                     } else {
                        if (slayer) return [ $(things.map((thing) => thing[property])[0]) ];
                        else return $(things.map((thing) => thing[property]));
                     }
                  };
               },
               lister: (property) => {
                  return (...args) => {
                     if (!_.def(args[0])) {
                        return things.map((thing) => thing[property]);
                     } else {
                        things.map((thing) => {
                           if (typeof args[0] === 'function') {
                              args[0](thing[property]);
                           } else {
                              thing[property].clear();
                              args.forEach(thing[property].add);
                           }
                        });
                        return that;
                     }
                  };
               },
               listerNest: (property) => {
                  return (...args) => {
                     if (!_.def(args[0])) {
                        return things.map((thing) => thing[property] || {});
                     } else if (!_.def(args[1])) {
                        return things.map((thing) => {
                           if (typeof args[0] === 'function') {
                              return args[0](thing[property] || {});
                           } else {
                              return (thing[property] || {})[args[0]];
                           }
                        });
                     } else {
                        things.map((thing) => {
                           if (typeof args[1] === 'function') {
                              args[1]((thing[property] || {})[args[0]]);
                           } else if (thing[property]) {
                              thing[property][args[0]].clear();
                              args.slice(1).forEach(thing[property][args[0]].add);
                           }
                        });
                        return that;
                     }
                  };
               },
               modifier: (consumer) => {
                  return (...args) => {
                     const outputs = things.map(consumer);
                     if (typeof args[0] === 'function') {
                        outputs.map(args[0]);
                        return that;
                     } else {
                        return outputs;
                     }
                  };
               },
               runner: (property) => {
                  return (...args) => {
                     return things.map((thing) => thing[property](...args));
                  };
               },
               runnerLink: (property) => {
                  return (...args) => {
                     if (slayer) return [ $(things.map((thing) => thing[property](...args))[0]) ];
                     else return $(things.map((thing) => thing[property](...args)));
                  };
               },
               setter: (property) => {
                  return (...args) => {
                     if (!_.def(args[0])) {
                        return things.map((thing) => thing[property]);
                     } else {
                        things.map((thing) => {
                           if (typeof args[0] === 'function') {
                              args[0](thing[property]);
                           } else {
                              thing[property] = args[0];
                           }
                        });
                        return that;
                     }
                  };
               },
               setterLink: (property) => {
                  return (...args) => {
                     if (!_.def(args[0])) {
                        if (slayer) return [ $(things.map((thing) => thing[property])[0]) ];
                        else return $(things.map((thing) => thing[property]));
                     } else {
                        if (typeof args[0] === 'function') args[0]($(things.map((thing) => thing[property])));
                        else things.map((thing) => (thing[property] = $('+').instance(args[0])));
                        return that;
                     }
                  };
               },
               setterNest: (property) => {
                  return (...args) => {
                     if (!_.def(args[0])) {
                        return things.map((thing) => thing[property] || {});
                     } else if (!_.def(args[1])) {
                        return things.map((thing) => {
                           if (typeof args[0] === 'function') {
                              return args[0](thing[property] || {});
                           } else {
                              return (thing[property] || {})[args[0]];
                           }
                        });
                     } else {
                        things.map((thing) => {
                           if (typeof args[1] === 'function') {
                              args[1]((thing[property] || {})[args[0]]);
                           } else {
                              (thing[property] || {})[args[0]] = args[1];
                           }
                        });
                        return that;
                     }
                  };
               },
               voider: (property) => {
                  return (...args) => {
                     things.map((thing) => thing[property](...args));
                     return that;
                  };
               }
            };
            const scripts = _.object(_.entries(chain), (entry) => {
               if (typeof entry.value === 'function') {
                  return { [entry.key]: properties.modifier(entry.value) };
               } else {
                  return { [entry.key]: properties[entry.value](entry.key) };
               }
            });
            return Object.assign(that, scripts);
         },
         links: _.keys(chain)
      };
   };
};

export const command = (_, $) => {
   return {
      on: (name) => {
         let tab = () => [];
         let run = () => {};
         const that = {
            tab: (handler) => {
               tab = handler;
               return that;
            },
            run: (handler) => {
               run = handler;
               return that;
            }
         };
         core.command({
            name: name,
            execute: (...args) => run(...args),
            tabComplete: (player, ...args) => tab(player, args.length, ...args) || []
         });
         return that;
      }
   };
};

export const event = (_, $) => {
   return {
      on: (shortcut) => {
         let type = undefined;
         const suffix = `${_.pascal(shortcut)}Event`;
         prefixes.forEach((prefix) => {
            if (type === undefined) {
               try {
                  Java.type(`${prefix}.${suffix}`);
                  type = `${prefix}.${suffix}`;
               } catch (error) {}
            }
         });
         if (type === undefined) {
            throw 'EventError: That event does not exist!';
         } else {
            const steps = [];
            const that = {
               if: (condition) => {
                  steps.push({ type: 'condition', item: condition });
                  return that;
               },
               do: (listener) => {
                  steps.push({ type: 'listener', item: listener });
                  return that;
               }
            };
            core.event(type, (event) => {
               if (event instanceof Java.type(type)) {
                  const storage = {};
                  const cancellable = event instanceof Cancellable;
                  let ready = true;
                  steps.forEach((step) => {
                     switch (step.type) {
                        case 'condition':
                           switch (typeof step.item) {
                              case 'boolean':
                                 if (cancellable && step.item === event.isCancelled()) ready = false;
                                 break;
                              case 'function':
                                 if (!step.item(event, storage)) ready = false;
                                 break;
                              case 'object':
                                 if (!_.match(_.access(event), step.item)) ready = false;
                                 break;
                           }
                           break;
                        case 'listener':
                           if (ready) {
                              try {
                                 step.item(event, storage);
                              } catch (error) {
                                 // note: do something better here
                                 ready = false;
                                 throw error;
                              }
                           }
                           break;
                     }
                  });
               }
            });
            return that;
         }
      }
   };
};

export const prefixes = [
   'org.bukkit.event.block',
   'org.bukkit.event.command',
   'org.bukkit.event.enchantment',
   'org.bukkit.event.entity',
   'org.bukkit.event.hanging',
   'org.bukkit.event.inventory',
   'org.bukkit.event.player',
   'org.bukkit.event.raid',
   'org.bukkit.event.server',
   'org.bukkit.event.vehicle',
   'org.bukkit.event.weather',
   'org.bukkit.event.world',
   'org.spigotmc.event.entity',
   'org.spigotmc.event.player',
   'com.destroystokyo.paper.event.block',
   'com.destroystokyo.paper.event.entity',
   'com.destroystokyo.paper.event.executor',
   'com.destroystokyo.paper.event.player',
   'com.destroystokyo.paper.event.profile',
   'com.destroystokyo.paper.event.server'
];

export const utility = (_, $) => {
   return {
      backs: (source) => {
         return _.strain($[source], (entry) => entry.key === _.upper(entry.key));
      },
      data: (container, value) => {
         const key = new NamespacedKey(core.plugin, 'jx');
         const type = PersistentDataType.STRING;
         if (_.def(value)) container.set(key, type, JSON.stringify(value, true));
         else return JSON.parse(container.get(key, type));
      },
      distance: (source, target, option) => {
         typeof source.location === 'function' && (source = source.location());
         typeof target.location === 'function' && (target = target.location());
         source = $('+').instance(source);
         target = $('+').instance(target);
         let x = _.iterable(source) ? source[0] : source;
         x = x instanceof Location || x instanceof Vector;
         let y = _.iterable(target) ? target[0] : target;
         y = y instanceof Location || y instanceof Vector;
         if (x && y) {
            if (_.iterable(source) && _.iterable(target)) {
               return source.map((from) => target.map((to) => _.dist(from, to, option)));
            } else if (_.iterable(source)) {
               return source.map((from) => _.dist(from, target, option));
            } else if (_.iterable(target)) {
               return target.map((to) => _.dist(source, to, option));
            } else {
               return _.dist(source, target, option);
            }
         } else if (x) {
            throw 'invalid-target';
         } else if (y) {
            throw 'invalid-source';
         } else {
            throw 'invalid-both';
         }
      },
      drop: (location, item, option) => {
         location = $('+').instance(location);
         item = $('+').instance(item);
         let x = _.iterable(location) ? location[0] : location;
         x = x instanceof Location;
         let y = _.iterable(item) ? item[0] : item;
         y = y instanceof ItemStack;
         if (x && y) {
            const method = `dropItem${option ? 'Naturally' : ''}`;
            if (_.iterable(location) && _.iterable(item)) {
               return location.map((from) => item.map((to) => from.getWorld()[method](to)));
            } else if (_.iterable(location)) {
               return location.map((from) => from.getWorld()[method](item));
            } else if (_.iterable(item)) {
               return item.map((to) => location.getWorld()[method](to));
            } else {
               return location.getWorld()[method](item);
            }
         } else if (x) {
            throw 'invald-item';
         } else if (y) {
            throw 'invald-location';
         } else {
            throw 'invalid-both';
         }
      },
      framework: () => {
         return _;
      },
      fronts: (source) => {
         return _.strain($[source], (entry) => entry.key === _.lower(entry.key));
      },
      instance: (thing, callback) => {
         if (typeof thing === 'object' && typeof thing.instance === 'function') {
            const output = thing.instance();
            if (typeof callback === 'function') {
               if (_.iterable(output)) return output.map(callback);
               else return callback(output);
            } else {
               return output;
            }
         } else {
            return thing;
         }
      },
      spawn: (location, entity) => {
         location = $('+').instance(location);
         entity = $('+').instance(entity);
         let x = _.iterable(location) ? location[0] : location;
         x = x instanceof Location;
         let y = _.iterable(entity) ? entity[0] : entity;
         y = typeof y === 'string';
         if (x && y) {
            if (_.iterable(location) && _.iterable(entity)) {
               return location.map((from) => {
                  return entity.map((to) => from.getWorld().spawnEntity(from, $.entityType[to]));
               });
            } else if (_.iterable(location)) {
               return location.map((from) => from.getWorld().spawnEntity(from, $.entityType[entity]));
            } else if (_.iterable(entity)) {
               return entity.map((to) => location.getWorld().spawnEntity(location, $.entityType[to]));
            } else {
               return location.getWorld().spawnEntity(location, $.entityType[entity]);
            }
         } else if (x) {
            throw 'invald-entity';
         } else if (y) {
            throw 'invald-location';
         } else {
            throw 'invalid-both';
         }
      }
   };
};

export const receiver = (_, $) => {
   return (type, input, jx) => {
      if (_.iterable(input)) {
         const that = jx[type].chainer(
            input.map((instance) => {
               return _.def(instance) ? jx[type].wrapper(instance) : instance;
            })
         );
         that[''] = `jx.${type}ChainerNest@${_.array(8, () => _.rand.entry('0123456789abcdef')).join('')}`;
         return _.extend(that, { [Symbol.iterator]: (...args) => input.values(...args) });
      } else {
         const that = jx[type].chainer([ _.def(input) ? jx[type].wrapper(input) : input ], 1);
         const slayer = _.object(jx[type].links, (link) => ({
            [link]: (...args) => {
               const result = that[link](...args);
               return result === that ? slayer : result[0];
            }
         }));
         slayer[''] = `jx.${type}Chainer@${_.array(8, () => _.rand.entry('0123456789abcdef')).join('')}`;
         return slayer;
      }
   };
};
