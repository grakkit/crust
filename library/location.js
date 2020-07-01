export const wrapper = (_, $) => {
   return (instance) => {
      const location = {
         get block () {
            return $(instance.getBlock());
         },
         distance: (target, flat) => {
            return _.dist(location, $('-', target), flat);
         },
         drop: (item, naturally) => {
            const drop = $('-', item);
            return $(location.world[`dropItem${naturally ? 'Naturally' : ''}`](location.instance, drop));
         },
         get instance () {
            return instance;
         },
         get pitch () {
            return instance.getPitch();
         },
         set pitch (value) {
            return instance.setPitch(value);
         },
         spawn: (lifeform) => {
            return $(`?${lifeform}`, instance);
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
         },
         get world () {
            return instance.getWorld();
         },
         set world (value) {
            try {
               instance.setWorld(value);
            } catch (error) {
               try {
                  instance.setWorld(server.getWorld(_.uuid(value)));
               } catch (error) {
                  instance.setWorld(server.getWorld(value));
               }
            }
         }
      };
      return location;
   };
};

export const parser = (_, $) => {
   return (location) => {
      return new (Java.type('org.bukkit.Location'))(
         server.getWorld(_.uuid(location.world)),
         location.x,
         location.y,
         location.z,
         location.pitch,
         location.yaw
      );
   };
};

export const chain = (_, $) => {
   return {
      block: 'getter',
      distance: 'getter',
      drop: 'runner',
      instance: 'getter',
      pitch: 'setter',
      serialize: (location) => {
         return {
            format: 'location',
            world: location.world.getUID().toString(),
            x: location.x,
            y: location.y,
            z: location.z,
            pitch: location.pitch,
            yaw: location.yaw
         };
      },
      spawn: 'runner',
      world: 'setter',
      x: 'setter',
      y: 'setter',
      yaw: 'setter',
      z: 'setter'
   };
};
