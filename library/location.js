const World = Java.type('org.bukkit.World');
const Vector = Java.type('org.bukkit.util.Vector');
const Location = Java.type('org.bukkit.Location');
const Material = Java.type('org.bukkit.Material');

export const wrapper = (_, $) => {
   return (instance) => {
      const thing = {
         get block () {
            return instance.getBlock();
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
                     throw 'Argument 1 must be a location, vector, or have a location or vector attached!';
               }
            }
         },
         drop: (item, option) => {
            try {
               return $('+').drop(instance, item, option);
            } catch (error) {
               switch (error) {
                  case 'invalid-both':
                  case 'invalid-location':
                     throw 'ImpossibleError: How the fuck are you seeing this error!?';
                  case 'invalid-item':
                     throw 'TypeError: Argument 1 must be an item!';
               }
            }
         },
         get instance () {
            return instance;
         },
         get pitch () {
            return instance.getPitch();
         },
         set pitch (value) {
            if (typeof value === 'number') instance.setPitch(value);
            else throw 'TypeError: You must supply a numeric value!';
         },
         spawn: (lifeform, option) => {
            try {
               return $('+').spawn(instance, lifeform, option);
            } catch (error) {
               switch (error) {
                  case 'invalid-both':
                  case 'invalid-location':
                     throw 'ImpossibleError: How the fuck are you seeing this error!?';
                  case 'invalid-lifeform':
                     throw 'TypeError: Argument 1 must be an item!';
               }
            }
         },
         get vector () {
            return instance.toVector();
         },
         set vector (value) {
            value = $('+').instance(value);
            if (value instanceof Vector) {
               thing.x = value.getX();
               thing.y = value.getY();
               thing.z = value.getZ();
            } else {
               throw 'TypeError: You must supply a vector!';
            }
         },
         get world () {
            return instance.getWorld();
         },
         set world (value) {
            value instanceof World || (value = server.getWorld(value));
            if (_.def(value)) return instance.setWorld(value);
            else throw 'ReferenceError: That world does not exist!';
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
         get yaw () {
            return instance.getYaw();
         },
         set yaw (value) {
            if (typeof value === 'number') instance.setYaw(value);
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
      return new Location(server.getWorld(_.uuid(thing.world)), thing.x, thing.y, thing.z, thing.yaw, thing.pitch);
   };
};

export const chain = (_, $) => {
   return {
      block: 'getterLink',
      distance: 'runner',
      drop: 'runnerLink',
      instance: 'getter',
      pitch: 'setter',
      serialize: (thing) => {
         if (_.def(thing)) {
            return {
               format: 'location',
               pitch: thing.pitch,
               world: thing.world.getUID().toString(),
               x: thing.x,
               y: thing.y,
               yaw: thing.yaw,
               z: thing.z
            };
         } else {
            return null;
         }
      },
      spawn: 'runnerLink',
      vector: 'setterLink',
      world: 'setter',
      x: 'setter',
      y: 'setter',
      yaw: 'setter',
      z: 'setter'
   };
};
