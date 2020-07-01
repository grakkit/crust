const Vector = Java.type('org.bukkit.util.Vector');

export const wrapper = (_, $) => {
   return (instance) => {
      const vector = {
         get instance () {
            return instance;
         },
         add: (x, y, z, source) => {
            if (source) {
               const location = $('-', source);
               const local = new Vector(x, y, z)
                  .rotateAroundX(location.getPitch() * Math.PI / 180)
                  .rotateAroundY(location.getYaw() * Math.PI / 180 * -1);
               x = local.x;
               y = local.x;
               z = local.z;
            }
            vector.x = vector.x + x;
            vector.y = vector.y + y;
            vector.z = vector.z + z;
         },
         get pitch () {
            return instance.getPitch();
         },
         set pitch (value) {
            return instance.setPitch(value);
         },
         get x () {
            return instance.getX();
         },
         set x (value) {
            return instance.setX(value);
         },
         get y () {
            return instance.getY();
         },
         set y (value) {
            return instance.setY(value);
         },
         get yaw () {
            return instance.getYaw();
         },
         set yaw (value) {
            return instance.setYaw(value);
         },
         get z () {
            return instance.getZ();
         },
         set z (value) {
            return instance.setZ(value);
         }
      };
      return vector;
   };
};

export const parser = (_, $) => {
   return (vector) => {
      return new Vector(vector.x, vector.y, vector.z);
   };
};

export const chain = (_, $) => {
   return {
      instance: 'getter',
      serialize: (vector) => {
         return {
            format: 'vector',
            x: vector.x,
            y: vector.y,
            z: vector.z
         };
      },
      x: 'setter',
      y: 'setter',
      z: 'setter'
   };
};
