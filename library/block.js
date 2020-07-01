export function wrapper (_, $) {
   return (instance) => {
      const util = {
         key: (...args) => {
            return new (Java.type('org.bukkit.NamespacedKey'))(...args);
         }
      };
      const block = {
         get data () {
            const state = instance.getState();
            if (state instanceof Java.type('org.bukkit.block.TileState')) {
               const container = state.getPersistentDataContainer();
               return _.object(_.array(container.getRaw().entrySet()), (entry) => {
                  const directory = util.key(...entry.getKey().split(':'));
                  if (directory.getNamespace() === core.plugin.getName()) {
                     let value = _.base.decode(entry.getValue().asString());
                     try {
                        return { [`${directory.getKey()}`]: JSON.parse(value) };
                     } catch (error) {
                        return { [`${directory.getKey()}`]: value };
                     }
                  }
               });
            }
         },
         set data (value) {
            const state = instance.getState();
            if (state instanceof Java.type('org.bukkit.block.TileState')) {
               const container = state.getPersistentDataContainer();
               _.array(container.getRaw().entrySet()).forEach((entry) => {
                  if (value.getNamespace() === core.plugin.getName()) {
                     container.remove(util.key(core.plugin, entry.getKey().getKey()));
                  }
               });
               _.entries(value).forEach((entry) => {
                  container.set(
                     util.key(core.plugin, entry.key),
                     org.bukkit.persistence.PersistentDataType.STRING,
                     _.base.encode(JSON.stringify(core.serialize(entry.value)))
                  );
               });
               state.update(true);
            }
         },
         distance: (target, flat) => {
            return _.dist(block.location, target, flat);
         },
         drops: (item) => {
            const drops = instance.getDrops((item && item.instance && item.instance()) || item);
            return drops.length === 0 ? null : drops;
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
         instance: () => {
            return blocks.map((blocks) => blocks.instance);
         },
         get location () {
            return instance.getLocation();
         },
         get material () {
            return _.key($.material, instance.getType());
         },
         set material (value) {
            instance.setType($.material[value]);
         },
         get world () {
            return instance.getLocation().getWorld();
         }
      };
      return block;
   };
}

export function chainer (_, $) {
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
         drops: (...args) => {
            return blocks.map((block) => block.drops(...args));
         },
         facing: (...args) => {
            if (args[0] === undefined) {
               return blocks.map((block) => block.facing);
            } else {
               blocks.map((block) => (block.facing = args[0]));
               return that;
            }
         },
         location: () => {
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
         serialize: () => {
            return {};
         },
         world: () => {
            return blocks.map((block) => block.world);
         }
      };
      return that;
   };
}

export function parser (_, $) {
   return () => {};
}

export const links = [ 'data', 'distance', 'drops', 'facing', 'location', 'material', 'serialize', 'world' ];
