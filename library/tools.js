const Cancellable = Java.type('org.bukkit.event.Cancellable');

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
   'org.spigotmc.event.player'
];

try {
   Java.type('com.destroystokyo.paper.event.player.IllegalPacketEvent');
   prefixes.push(
      ...[
         'com.destroystokyo.paper.event.block',
         'com.destroystokyo.paper.event.entity',
         'com.destroystokyo.paper.event.executor',
         'com.destroystokyo.paper.event.player',
         'com.destroystokyo.paper.event.profile',
         'com.destroystokyo.paper.event.server'
      ]
   );
} catch (error) {}

export const accessors = (that, things) => {
   return {
      getter: (property) => {
         return (...args) => {
            if (typeof args[0] === 'function') {
               things.map((thing) => args[0](thing[property]));
            } else {
               return things.map((thing) => thing[property]);
            }
         };
      },
      runner: (property) => {
         return (...args) => {
            things.map((thing) => thing[property](...args));
            return that;
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
      appender: (property) => {
         return (...args) => {
            if (args[0] === undefined) {
               return things.map((thing) => thing[property]);
            } else {
               things.map((thing) => {
                  const value = thing[property];
                  if (typeof args[0] === 'function') {
                     args[0](value);
                     thing[property] = value;
                  } else {
                     thing[property] = Object.assign(value, args[0]);
                  }
               });
               return that;
            }
         };
      },
      setter: (property) => {
         return (...args) => {
            if (args[0] === undefined) {
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
      setterNest: (property) => {
         return (...args) => {
            if (args[0] === undefined) {
               return things.map((thing) => thing[property]);
            } else if (args[1] === undefined) {
               return things.map((thing) => {
                  if (typeof args[0] === 'function') {
                     return args[0](thing[property]);
                  } else {
                     return thing[property][args[0]];
                  }
               });
            } else {
               things.map((thing) => {
                  if (typeof args[1] === 'function') {
                     args[1](thing[property][args[0]]);
                  } else {
                     thing[property][args[0]] = args[1];
                  }
               });
               return that;
            }
         };
      },
      lister: (property) => {
         return (...args) => {
            if (args[0] === undefined) {
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
            if (args[0] === undefined) {
               return things.map((thing) => thing[property]);
            } else if (args[1] === undefined) {
               return things.map((thing) => {
                  if (typeof args[0] === 'function') {
                     return args[0](thing[property]);
                  } else {
                     return thing[property][args[0]];
                  }
               });
            } else {
               things.map((thing) => {
                  if (typeof args[1] === 'function') {
                     args[1](thing[property][args[0]]);
                  } else {
                     thing[property][args[0]].clear();
                     args.slice(1).forEach(thing[property][args[0]].add);
                  }
               });
               return that;
            }
         };
      }
   };
};

export const builder = (_, $) => {
   return (library) => {
      const chain = library.chain(_, $);
      return {
         wrapper: library.wrapper(_, $),
         parser: library.parser(_, $),
         chainer: (...things) => {
            const that = {};
            const properties = accessors(that, things);
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
