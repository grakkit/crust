const World = Java.type('org.bukkit.World');
const Vector = Java.type('org.bukkit.util.Vector');
const Location = Java.type('org.bukkit.Location');

export const wrapper = (_, $) => {
   return (instance) => {
      const thing = {
         // support velocity manip with velocity object, not just XYZ
         // add subtract velocity so we can do stuff like this
         /*
         x=$(self).location().vector().instance();
         y=$('@e[tag=b]').location().vector().instance()[0];
         self.setVelocity(x.clone().subtract(y))
         */
         // but like this instead
         /*
         $(self).velocity($(self).vector().subtract($('@e[tag=b]')).first())
         */
         add: (x, y, z, source) => {
            if (_.def(z)) {
               if (_.def(source)) {
                  source = $('+').instance(source);
                  typeof source.getLocation === 'function' && (source = source.getLocation());
                  if (source instanceof Location) {
                     const local = new Vector(x, y, z);
                     local.rotateAroundX(source.getPitch() * Math.PI / 180);
                     local.rotateAroundY(source.getYaw() * Math.PI / 180 * -1);
                     x = local.getX();
                     y = local.getY();
                     z = local.getZ();
                  } else {
                     throw 'TypeError: Argument 4 must be a location or have a location attached!';
                  }
               }
               thing.x += x;
               thing.y += y;
               thing.z += z;
            } else {
               throw 'TypeError: You must specify at least 3 numeric arguments!';
            }
         },
         distance: (target, option) => {
            try {
               return $('+').distance(instance, target, option);
            } catch (error) {
               switch (error) {
                  case 'invalid-both':
                  case 'invalid-source':
                     throw 'ImpossibleError: How the fuck are you seeing this error!?';
                  case 'invalid-target':
                     throw 'TypeError: Argument 1 must be a location, vector, or have a location or vector attached!';
               }
            }
         },
         get instance () {
            return instance;
         },
         location: (world, yaw, pitch) => {
            if (_.def(world)) {
               world instanceof World || (world = server.getWorld(world));
               if (_.def(world)) return instance.toLocation(world, yaw || 0, pitch || 0);
               else throw 'ReferenceError: That world does not exist!';
            } else {
               throw 'TypeError: You must specify a world, world name or UUID!';
            }
         },
         get x () {
            return instance.getX();
         },
         set x (value) {
            if (typeof value === 'number') instance.setX(value);
            else throw 'TypeError: You must supply a numeric value!';
         },
         get y () {
            return instance.getY();
         },
         set y (value) {
            if (typeof value === 'number') instance.setY(value);
            else throw 'TypeError: You must supply a numeric value!';
         },
         get z () {
            return instance.getZ();
         },
         set z (value) {
            if (typeof value === 'number') instance.setZ(value);
            else throw 'TypeError: You must supply a numeric value!';
         }
      };
      return thing;
   };
};

export const parser = (_, $) => {
   return (thing) => {
      return $(new Vector(thing.x, thing.y, thing.z));
   };
};

export const chain = (_, $) => {
   return {
      add: 'voider',
      distance: 'runner',
      instance: 'getter',
      location: 'runnerLink',
      serialize: (thing) => {
         if (_.def(thing)) {
            return {
               format: 'vector',
               x: thing.x,
               y: thing.y,
               z: thing.z
            };
         } else {
            return null;
         }
      },
      x: 'setter',
      y: 'setter',
      z: 'setter'
   };
};
