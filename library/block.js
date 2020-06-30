export function wrapper (_, API) {
   return (instance) => {
      const block = {
         get data () {
            const state = instance.getState();
            if (state instanceof Java.type('org.bukkit.block.TileState')) {
               const container = state.getPersistentDataContainer();
               return _.object(_.array(container.getRaw().entrySet()), (entry) => {
                  const directory = new org.bukkit.NamespacedKey(...entry.getKey().split(':'));
                  if (directory.getNamespace() === 'grakkit') {
                     return { [`${directory.getKey()}`]: _.base.decode(entry.getValue().asString()) };
                  }
               });
            }
         },
         set data (value) {
            const state = instance.getState();
            if (state instanceof Java.type('org.bukkit.block.TileState')) {
               const container = state.getPersistentDataContainer();
               _.array(container.getRaw().entrySet()).forEach((entry) => {
                  container.remove(new org.bukkit.NamespacedKey(...entry.getKey().split(':')));
               });
               _.entries(value).forEach((entry) => {
                  container.set(
                     new org.bukkit.NamespacedKey('grakkit', entry.key),
                     org.bukkit.persistence.PersistentDataType.STRING,
                     _.base.encode(entry.value)
                  );
               });
               state.update(true);
            }
         },
         distance: (target, flat) => {
            _.dist(block.location(), target, flat);
         },
         get facing () {
            const data = instance.getBlockData();
            if (data instanceof Java.type('org.bukkit.block.data.Directional')) {
               return _.key($.blockFace, data.getFacing());
            }
         },
         set facing (value) {
            const data = instance.getBlockData();
            if (data instanceof Java.type('org.bukkit.block.data.Directional')) {
               data.setFacing($.blockFace[value]);
               instance.setBlockData(data);
            }
         },
         get location () {
            return instance.getLocation();
         },
         get material () {
            return _.key($.material, instance.getType());
         },
         set material (value) {
            instance.setType($.material[value]);
         }
      };
      return block;
   };
}

export function chainer (_, API) {
   return (...blocks) => {
      const that = {
         data: (...args) => {
            if (args[0] === undefined) {
               return blocks.map((block) => block.data);
            } else {
               blocks.map((block) => {
                  const data = block.data;
                  if (typeof args[0] === 'function') {
                     args[0](data);
                     block.data = data;
                  } else {
                     block.data = args[0];
                  }
               });
               return that;
            }
         },
         distance: (...args) => {
            return blocks.map((block) => block.distance(...args));
         },
         facing: (...args) => {
            if (args[0] === undefined) {
               return blocks.map((block) => block.facing);
            } else {
               blocks.map((block) => (block.facing = args[0]));
               return that;
            }
         },
         location: (...args) => {
            return blocks.map((block) => block.location);
         },
         material: (...args) => {
            if (args[0] === undefined) {
               return blocks.map((block) => block.material);
            } else {
               blocks.map((block) => (block.material = args[0]));
               return that;
            }
         },
         serialize: (...args) => {
            return {};
         }
      };
      return that;
   };
}

export function parser (_, API) {
   return () => {};
}

export const links = [ 'data', 'distance', 'facing', 'location', 'material', 'serialize' ];
