const framework = {
   base: {
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      encode: (string) => {
         let index = 0;
         let result = '';
         while (index < string.length) {
            let a = string.charCodeAt(index++) || 0;
            let b = string.charCodeAt(index++) || 0;
            let c = string.charCodeAt(index++) || 0;
            let d = ((b & 0xf) << 2) | ((c >> 6) & 0x3);
            let e = c & 0x3f;
            b ? c || (e = 64) : (d = e = 64);
            result += framework.base.characters.charAt((a >> 2) & 0x3f);
            result += framework.base.characters.charAt(((a & 0x3) << 4) | ((b >> 4) & 0xf));
            result += framework.base.characters.charAt(d);
            result += framework.base.characters.charAt(e);
         }
         return result;
      },
      decode: (string) => {
         let index = 0;
         let result = '';
         while (index < string.length) {
            let a = framework.base.characters.indexOf(string.charAt(index++));
            let b = framework.base.characters.indexOf(string.charAt(index++));
            let c = framework.base.characters.indexOf(string.charAt(index++));
            let d = framework.base.characters.indexOf(string.charAt(index++));
            let e = ((b & 0xf) << 4) | ((c >> 2) & 0xf);
            let f = ((c & 0x3) << 6) | (d & 0x3f);
            result += String.fromCharCode(((a & 0x3f) << 2) | ((b >> 4) & 0x3));
            result += e ? String.fromCharCode(e) : '';
            result += f ? String.fromCharCode(f) : '';
         }
         return result;
      }
   },
   camel: (string, separator) => {
      const pascal = framework.pascal(string, separator);
      return framework.lower(pascal[0]) + pascal.slice(1);
   },
   clamp: (number, min, max) => {
      return number < min ? min : number > max ? max : number;
   },
   collect: (...array) => {
      const output = new java.util.ArrayList();
      array.forEach((entry) => {
         output.add(entry);
      });
      return output;
   },
   define: (object, consumer) => {
      consumer ||
         (consumer = (entry) => {
            return {
               get: () => {
                  return entry.value;
               },
               set: (value) => {
                  entry.value = value;
               }
            };
         });
      const output = {};
      framework.entries(object).forEach((entry) => {
         const info = consumer(entry);
         if (info) {
            Object.defineProperty(output, entry.key, {
               get () {
                  if (info.get) {
                     return info.get();
                  }
               },
               set (value) {
                  if (info.set) {
                     info.set(value);
                  }
               }
            });
         }
      });
      return output;
   },
   entries: (object) => {
      return framework.keys(object).map((key) => {
         return { key: key, value: object[key] };
      });
   },
   extend: (object, ...objects) => {
      return Object.assign(object, ...objects);
   },
   flat: (array) => {
      return array.filter((entry) => {
         return entry;
      });
   },
   interval: (script, period) => {
      const state = { iteration: null };
      const loop = () => {
         try {
            script();
         } catch (error) {
            console.error(error);
         }
         state.iteration = framework.timeout(loop, period);
      };
      state.iteration = framework.timeout(loop, period);
      const output = { cancel: () => state.iteration.cancel() };
      tasks.push(output);
      return output;
   },
   key: (object, value) => {
      return framework.keys(object)[framework.values(object).indexOf(value)];
   },
   keys: (object) => {
      return Object.keys(object);
   },
   lower: (string) => {
      return string.toLowerCase();
   },
   match: (object, filter) => {
      switch (typeof filter) {
         case 'undefined':
            return true;
         case 'function':
            return filter(object);
         case 'object':
            switch (framework.type(filter)) {
               case 'Array':
                  return filter
                     .map((entry) => {
                        return framework.match(object, entry);
                     })
                     .includes(true);
               case 'Object':
                  return !framework
                     .keys(filter)
                     .map((key) => {
                        return framework.match(object[key], filter[key]);
                     })
                     .includes(false);
               default:
                  return object === filter;
            }
         default:
            return object === filter;
      }
   },
   mirror: (options) => {
      options || (options = {});
      const mirror = framework.extend(options.array || [], {
         add: options.add || (() => {}),
         remove: options.remove || (() => {}),
         clear: options.clear || (() => {})
      });
      return {
         get: () => {
            return mirror;
         },
         set: (value) => {
            mirror.clear();
            value.forEach(mirror.add);
         }
      };
   },
   object: (array, consumer) => {
      consumer ||
         (consumer = (entry, index) => {
            return { [entry.key || index]: entry.value || entry };
         });
      return framework.extend({}, ...framework.flat(array.map(consumer)));
   },
   pascal: (string, separator) => {
      return string
         .split(separator)
         .map((chunk) => {
            return framework.upper(chunk[0]) + framework.lower(chunk.slice(1));
         })
         .join('');
   },
   simplify: (...context) => {
      let output = null;
      const object = context[0];
      switch (framework.type(object)) {
         case 'Array':
            output = [];
            for (let entry of object) {
               if (!context.includes(entry)) {
                  output.push(framework.simplify(entry, ...context));
               }
            }
            output = framework.flat(output);
            output.length || (output = null);
            break;
         case 'Object':
            output = {};
            for (let key of framework.keys(object)) {
               if (!context.includes(object[key])) {
                  output[key] = framework.simplify(object[key], ...context);
               }
            }
            output = framework.strain(output);
            framework.keys(output).length || (output = null);
            break;
         default:
            output = object;
      }
      return output;
   },
   splice: (string, separator, ...index) => {
      return string.split(separator).slice(...index).join(separator);
   },
   strain: (object, consumer) => {
      consumer ||
         (consumer = (entry) => {
            return entry.value;
         });
      return framework.object(framework.entries(object).filter(consumer));
   },
   timeout: (script, period) => {
      const state = { cancel: false };
      const unit = java.util.concurrent.TimeUnit.MILLISECONDS;
      const runnable = new (Java.extend(Java.type('java.lang.Runnable')))({ run: () => state.cancel || script() });
      java.util.concurrent.CompletableFuture.delayedExecutor(period, unit).execute(runnable);
      const output = { cancel: () => (state.cancel = true) };
      tasks.push(output);
      return output;
   },
   type: (object) => {
      const type = toString.apply(object).split(' ')[1].slice(0, -1);
      return type === 'Object' ? object.constructor.name : type;
   },
   upper: (string) => {
      return string.toUpperCase();
   },
   uuid: (string) => {
      return string ? java.util.UUID.fromString(string) : java.util.UUID.randomUUID();
   },
   values: (object) => {
      return Object.values(object);
   }
};

export const _ = framework;
