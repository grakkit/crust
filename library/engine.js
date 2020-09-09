//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
//  ########  ########  ########  ####  ########  ########            ##  ########  //
//  ##        ##    ##  ##         ##   ##    ##  ##                  ##  ##        //
//  ##        ##    ##  ##         ##   ##    ##  ##                  ##  ##        //
//  #######   ##    ##  ##  ####   ##   ##    ##  #######             ##  ########  //
//  ##        ##    ##  ##    ##   ##   ##    ##  ##                  ##        ##  //
//  ##        ##    ##  ##    ##   ##   ##    ##  ##            ##    ##        ##  //
//  ########  ##    ##  ########  ####  ##    ##  ########  ##  ########  ########  //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////

/** @type {import('./types')} */
const { Iterable } = core.import('./types.js');

/** @type {typeof import('./engine').Accessor} */
export const Accessor = class {
   constructor (consumer) {
      this.consumer = consumer;
   }
   new (valid, property) {
      return (things, args, policy) => {
         return this.consumer(args, {
            get (index) {
               if (index) {
                  const thing = things[index];
                  if (thing instanceof valid) return property.get.call(thing);
               } else {
                  return things.map((thing) => {
                     if (thing instanceof valid) return property.get.call(thing);
                  });
               }
            },
            set (value, index) {
               if (value !== undefined && is.safe(policy, value)) {
                  if (index) {
                     const thing = things[index];
                     if (thing instanceof valid) property.set.call(thing, value);
                  } else {
                     things.forEach((thing) => {
                        if (thing instanceof valid) property.set.call(thing, value);
                     });
                  }
               }
            },
            run (args, index) {
               if (index) {
                  const thing = things[index];
                  if (thing instanceof valid) return property.run.call(thing, ...args);
               } else {
                  things.forEach((thing) => {
                     if (thing instanceof valid) return property.run.call(thing, ...args);
                  });
               }
            }
         });
      };
   }
};

const accessors = {
   runner: new Accessor((args, property) => {
      return property.run(args);
   }),

   getter: new Accessor((args, property) => {
      switch (typeof args[0]) {
         case 'function':
            property.get().map(args[0]);
            break;
         case 'undefined':
            return property.get();
      }
   }),

   setter: new Accessor((args, property) => {
      switch (typeof args[0]) {
         case 'function':
            property.get().map(args[0]).forEach(property.set);
            break;
         case 'undefined':
            return property.get();
         default:
            property.set(args[0]);
      }
   }),

   merger: new Accessor((args, property) => {
      switch (typeof args[0]) {
         case 'function':
            property.get().forEach((value, index) => {
               args[0](value);
               property.set(value, index);
            });
            break;
         case 'undefined':
            return property.get();
         default:
            property.set(args[0]);
      }
   })
};

/** @type {typeof import('./engine-spec').Violation} */
export const Violation = class {
   constructor (policy) {
      // replace generalized template with one based on given policy
      this.template = `Setting .@() requires a value which follows the policy "${policy}"`;
   }
   message (key) {
      return this.template.replace(/(@)/g, key);
   }
};

/** @type {typeof import('./engine-spec').Wrapper} */
export const Wrapper = class {
   static processor (callback) {
      return class {
         constructor (properties, ...things) {
            for (const { key, policy, accessor, link } of properties) {
               this[key] = (...args) => {
                  try {
                     const output = accessor(things, args, policy);
                     if (output === undefined) {
                        return this;
                     } else {
                        return callback(Registry.storage[link], output);
                     }
                  } catch (error) {
                     if (is.object(error) && typeof error.message === 'function') {
                        throw new TypeError(error.message(key));
                     } else {
                        throw error;
                     }
                  }
               };
            }
         }
      };
   }
   constructor (valid, properties) {
      this.valid = valid;
      this.properties = properties;
      this.entries = Object.entries(properties).map((entry) => {
         return {
            key: entry[0],
            policy: entry[1].policy,
            accessor: accessors[entry[1].type].new(valid, entry[1]),
            link: entry[1].link
         };
      });
   }
   chainer (thing) {
      return new Chainer(this.entries, thing);
   }
   chainerNest (things) {
      return new ChainerNest(this.entries, ...things);
   }
   extend (valid, properties) {
      return new Wrapper(valid, Object.assign({}, this.properties, properties));
   }
};

const Chainer = Wrapper.processor((link, output) => {
   return link instanceof Wrapper ? link.chainer(output[0]) : output[0];
});

const ChainerNest = Wrapper.processor((link, output) => {
   return link instanceof Wrapper ? link.chainerNest(output) : output;
});

/** @type {import('./engine-spec').Registry} */
export const Registry = {
   storage: {},
   register: (name, wrapper) => {
      Registry.storage[name] = wrapper;
   }
};

/** @type {import('./engine-spec').is} */
export const is = {
   array: (object) => {
      return is.object(object) && (typeof object[Symbol.iterator] === 'function' || object instanceof Iterable);
   },
   defined: (object) => {
      return typeof object === 'number' ? object === object : object != null;
   },
   object: (object) => {
      return is.defined(object) && typeof object === 'object';
   },
   safe: (policy, object, violation) => {
      violation || (violation = new Violation(policy));
      if (policy.startsWith('~')) {
         return object === null || is.safe(policy.slice(1), object, violation);
      } else if (policy.startsWith('{')) {
         if (is.object(object)) {
            for (const key in object) is.safe(policy.slice(1, -1), object[key], violation);
            return true;
         } else {
            throw violation;
         }
      } else if (policy.startsWith('[')) {
         if (is.array(object)) {
            for (const index in object) is.safe(policy.slice(1, -1), object[index], violation);
            return true;
         } else {
            throw violation;
         }
      } else if (typeof object === policy) {
         if (is.defined(object)) {
            return true;
         } else {
            throw violation;
         }
      } else {
         throw violation;
      }
   }
};
