// you were meant to defeat the sith, not join them!
const nms = eval(`Packages.net.minecraft.server.${server.getClass().getCanonicalName().split('.')[3]}`);

const UUID = Java.type('java.util.UUID');
const Location = Java.type('org.bukkit.Location');
const Runnable = Java.extend(Java.type('java.lang.Runnable'));
const ArrayList = Java.type('java.util.ArrayList');
const NBTTagInt = nms.NBTTagInt;
const NBTTagByte = nms.NBTTagByte;
const NBTTagList = nms.NBTTagList;
const NBTTagLong = nms.NBTTagLong;
const NBTTagFloat = nms.NBTTagFloat;
const NBTTagShort = nms.NBTTagShort;
const NBTTagDouble = nms.NBTTagDouble;
const NBTTagString = nms.NBTTagString;
const SecureRandom = Java.type('java.security.SecureRandom');
const NBTTagCompound = nms.NBTTagCompound;
const NBTTagIntArray = nms.NBTTagIntArray;
const NBTTagByteArray = nms.NBTTagByteArray;

const tasks = [];
const crypto = new SecureRandom();

export const _ = {
   array: (object, provider) => {
      if (typeof object === 'number') {
         const output = [];
         let index = 0;
         while (index < object) output.push(provider(index++));
         return output;
      } else if (_.iterable(object)) {
         return [ ...object ];
      } else if (typeof object.toArray === 'function') {
         return _.array(object.toArray());
      } else {
         const output = [];
         if (typeof object.forEach === 'function') {
            object.forEach((entry) => output.push(entry));
         } else if (typeof object.forEachRemaining === 'function') {
            object.forEachRemaining((entry) => output.push(entry));
         } else if (typeof object.length === 'number') {
            let index = 0;
            while (index < object.length) output.push(object[index++]);
         }
         return output;
      }
   },
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
            result += _.base.characters.charAt((a >> 2) & 0x3f);
            result += _.base.characters.charAt(((a & 0x3) << 4) | ((b >> 4) & 0xf));
            result += _.base.characters.charAt(d);
            result += _.base.characters.charAt(e);
         }
         return result;
      },
      decode: (string) => {
         let index = 0;
         let result = '';
         while (index < string.length) {
            let a = _.base.characters.indexOf(string.charAt(index++));
            let b = _.base.characters.indexOf(string.charAt(index++));
            let c = _.base.characters.indexOf(string.charAt(index++));
            let d = _.base.characters.indexOf(string.charAt(index++));
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
      const pascal = _.pascal(string, separator);
      return _.lower(pascal[0]) + pascal.slice(1);
   },
   clamp: (number, min, max) => {
      return number < min ? min : number > max ? max : number;
   },
   collect: (...array) => {
      const output = new ArrayList();
      array.forEach((entry) => {
         output.add(entry);
      });
      return output;
   },
   color: (string) => {
      return string.replace(/(&)/g, '§').replace(/(§§)/g, '&');
   },
   def: (object) => {
      if ([ undefined, null ].includes(object)) return false;
      else if (typeof object === 'number' && object !== object) return false;
      else return true;
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
      _.entries(object).forEach((entry) => {
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
   dist: (source, target, flat) => {
      typeof source.getLocation === 'function' && (source = source.getLocation());
      typeof target.getLocation === 'function' && (target = target.getLocation());
      if (source instanceof Location && target instanceof Location && source.getWorld() !== target.getWorld()) {
         return Infinity;
      }
      var deltaX = source.getX() - target.getX();
      var deltaY = flat ? 0 : source.getY() - target.getY();
      var deltaZ = source.getZ() - target.getZ();
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
   },
   drop: (source, item, option) => {
      typeof source.getLocation === 'function' && (source = source.getLocation());
      const method = `dropItem${option ? 'Naturally' : ''}`;
      return source.getWorld()[method](source, item);
   },
   entries: (object) => {
      return _.keys(object).map((key) => {
         return { key: key, value: object[key] };
      });
   },
   extend: (object, ...objects) => {
      return Object.assign(
         object,
         ...objects.map((object) => {
            return _.object(Object.getOwnPropertyNames(object), (property) => ({ [property]: object[property] }));
         })
      );
   },
   flat: (array, consumer) => {
      consumer ||
         (consumer = (entry) => {
            return _.def(entry);
         });
      return array.filter(consumer);
   },
   interval: (script, period) => {
      const state = { iteration: null };
      const loop = () => {
         try {
            script();
         } catch (error) {
            console.error(error);
         }
         state.iteration = _.timeout(loop, period);
      };
      state.iteration = _.timeout(loop, period);
      const output = { cancel: () => state.iteration.cancel() };
      tasks.push(output);
      return output;
   },
   iterable: (object) => {
      return object ? typeof object[Symbol.iterator] === 'function' && typeof object !== 'string' : false;
   },
   key: (object, value) => {
      return _.keys(object)[_.values(object).indexOf(value)];
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
            switch (_.type(filter)) {
               case 'Array':
                  return filter
                     .map((entry) => {
                        return _.match(object, entry);
                     })
                     .includes(true);
               case 'Object':
                  return !_.keys(filter)
                     .map((key) => {
                        return _.match(object[key], filter[key]);
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
      const mirror = Object.assign(options.array || [], {
         add: (...args) => (options.add(...args), _.mirror(options).get()),
         remove: (...args) => (options.remove(...args), _.mirror(options).get()),
         clear: (...args) => (options.clear(...args), _.mirror(options).get()),
         get: (...args) => options.get && options.get(mirror, ...args)
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
   nms: nms,
   object: (array, consumer) => {
      consumer ||
         (consumer = (entry, index) => {
            return { [entry.key || index]: entry.value || entry };
         });
      return Object.assign({}, ..._.flat(array.map(consumer)));
   },
   parse: (data) => {
      try {
         switch (data.type) {
            case 'None':
               return data.value;
            case 'Int':
               return NBTTagInt.a(data.value);
            case 'Float':
               return NBTTagFloat.a(data.value);
            case 'Double':
               return NBTTagDouble.a(data.value);
            case 'Long':
               return NBTTagLong.a(data.value);
            case 'Short':
               return NBTTagShort.a(data.value);
            case 'Byte':
               return NBTTagByte.a(data.value);
            case 'String':
               return NBTTagString.a(data.value);
            case 'End':
               return null;
            case 'List':
               const list = new NBTTagList();
               data.value.forEach((entry) => list.add(_.parse(entry)));
               return list;
            case 'ByteArray':
               const bytes = new NBTTagByteArray(_.collect());
               global.test = bytes;
               global.test2 = data.value;
               data.value.forEach((entry) => bytes.add(_.parse(entry)));
               return bytes;
            case 'IntArray':
               const ints = new NBTTagIntArray(_.collect());
               data.value.forEach((entry) => ints.add(_.parse(entry)));
               return ints;
            case 'Compound':
               const compound = new NBTTagCompound();
               _.entries(data.value).forEach((entry) => compound.set(entry.key, _.parse(entry.value)));
               return compound;
         }
      } catch (err0) {
         console.error(err0);
         throw err0;
      }
   },
   pascal: (string, separator) => {
      if (separator) {
         return string
            .split(separator)
            .map((chunk) => {
               return _.pascal(chunk);
            })
            .join('');
      } else {
         return _.upper(string[0]) + string.slice(1);
      }
   },
   player: (target) => {
      let uuid = undefined;
      const players = Object.assign({}, core.data('grakkit/players'));
      if (target instanceof UUID) {
         uuid = target;
      } else if (typeof target === 'string') {
         const online = server.getPlayer(target);
         if (players[target]) {
            uuid = _.uuid(players[target].uuid);
         } else if (online) {
            uuid = online.getUniqueId();
         } else {
            _.array(server.getOfflinePlayers()).forEach((offline) => {
               const stored = offline.getUniqueId();
               if (uuid === undefined && [ stored.toString(), offline.getName() ].includes(target)) uuid = stored;
            });
            if (uuid === undefined) {
               if (target.includes('.')) {
                  return {};
               } else {
                  try {
                     uuid = _.uuid(target);
                  } catch (error) {
                     uuid = server.getOfflinePlayer(target).getUniqueId();
                  }
               }
            }
         }
      } else if (typeof target.uuid === 'string') {
         uuid = _.uuid(target.uuid);
      } else if (typeof target.uuid === 'function') {
         uuid = _.uuid(target.uuid());
      } else if (typeof target.getUniqueId === 'function') {
         uuid = target.getUniqueId();
      } else if (target.constructor === Array) {
         return target.map(_.player);
      } else {
         throw `FrameworkError: Cannot convert ${core.output(target)} to standardized player notation!`;
      }
      return Object.assign(players[uuid.toString()] || { uuid: uuid.toString() }, {
         online: server.getPlayer(uuid),
         offline: server.getOfflinePlayer(uuid)
      });
   },
   polyfill: () => {
      Object.assign(global, {
         atob: (string) => {
            return _.base.decode(string);
         },
         btoa: (string) => {
            return _.base.encode(string);
         },
         clearImmediate: (index) => {
            tasks[index].cancel();
         },
         clearInterval: (index) => {
            tasks[index].cancel();
         },
         clearTimeout: (index) => {
            tasks[index].cancel();
         },
         setImmediate: (script) => {
            _.timeout(script, 0);
            return tasks.length - 1;
         },
         setInterval: (script, period) => {
            _.interval(script, period || 1);
            return tasks.length - 1;
         },
         setTimeout: (script, period) => {
            _.timeout(script, period || 1);
            return tasks.length - 1;
         }
      });
   },
   rand: {
      base: () => {
         return (crypto.nextInt() + 2147483648) / 4294967296;
      },
      range: (min, max) => {
         return Math.floor(_.rand.base() * (max - min + 1)) + min;
      },
      threshold: (max) => {
         return _.rand.base() < max;
      },
      entry: (object) => {
         if (_.iterable(object) || typeof object === 'string') {
            return object[_.rand.range(0, _.array(object).length - 1)];
         } else {
            return _.rand.entry(_.keys(object));
         }
      }
   },
   raw: (string) => {
      return string.replace(/(&)/g, '&&').replace(/(§)/g, '&');
   },
   serialize: (data) => {
      if ([ null, undefined ].includes(data)) {
         return { type: 'None', value: data };
      } else {
         let value = undefined;
         const type = data.getClass().getCanonicalName().split('NBTTag')[1];
         switch (type) {
            case 'Int':
               value = data.asInt();
               break;
            case 'Float':
               value = data.asFloat();
               break;
            case 'Double':
               value = data.asDouble();
               break;
            case 'Long':
               value = data.asLong();
               break;
            case 'Short':
               value = data.asShort();
               break;
            case 'Byte':
               value = data.asByte();
               break;
            case 'String':
               value = data.asString();
               break;
            case 'End':
               value = null;
               break;
            case 'List':
            case 'ByteArray':
            case 'IntArray':
               value = _.array(data).map(_.serialize);
               break;
            case 'Compound':
               value = _.object(_.array(data.map.entrySet()), (entry) => {
                  return { [entry.getKey()]: _.serialize(entry.getValue()) };
               });
               break;
         }
         return { type: type, value: value };
      }
   },
   simplify: (...context) => {
      let output = null;
      const object = context[0];
      switch (_.type(object)) {
         case 'Array':
            output = [];
            for (let entry of object) {
               if (!context.includes(entry)) {
                  output.push(_.simplify(entry, ...context));
               }
            }
            output = _.flat(output);
            output.length || (output = null);
            break;
         case 'Object':
            output = {};
            for (let key of _.keys(object)) {
               if (!context.includes(object[key])) {
                  output[key] = _.simplify(object[key], ...context);
               }
            }
            output = _.strain(output);
            _.keys(output).length || (output = null);
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
            return _.def(entry.value);
         });
      return _.object(_.entries(object).filter(consumer));
   },
   timeout: (script, period) => {
      const state = { cancel: false };
      const runnable = new Runnable({ run: () => state.cancel || script() });
      server.getScheduler().runTaskLater(core.plugin, runnable, Math.ceil(period / 50));
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
      return string instanceof UUID ? string : _.def(string) ? UUID.fromString(string) : UUID.randomUUID();
   },
   values: (object) => {
      return Object.values(object);
   }
};

core.event('org.bukkit.event.player.PlayerJoinEvent', (event) => {
   const player = event.getPlayer();
   const address = player.getAddress().getAddress().getHostAddress();
   const name = player.getName();
   const uuid = player.getUniqueId().toString();
   const info = { address: address, name: name, uuid: uuid };
   Object.assign(core.data('grakkit/players'), {
      [address]: info,
      [name]: info,
      [uuid]: info
   });
});

core.event('org.bukkit.event.server.PluginDisableEvent', (event) => {
   event.getPlugin() === core.plugin && tasks.forEach((task) => task.cancel());
});
