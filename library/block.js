const TileState = Java.type('org.bukkit.block.TileState');
const Directional = Java.type('org.bukkit.block.data.Directional');
const NamespacedKey = Java.type('org.bukkit.NamespacedKey');
const PersistentDataType = Java.type('org.bukkit.persistence.PersistentDataType');

export const wrapper = (_, $) => {
   $('*blockBreak').if(true).do((event) => $(event.getBlock()).glowing(false));
   return (instance) => {
      const block = {
         get data () {
            const state = instance.getState();
            if (state instanceof TileState) {
               const container = state.getPersistentDataContainer();
               return _.object(_.array(container.getRaw().entrySet()), (entry) => {
                  const directory = new NamespacedKey(...entry.getKey().split(':'));
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
            if (state instanceof TileState) {
               const container = state.getPersistentDataContainer();
               _.array(container.getRaw().entrySet()).forEach((entry) => {
                  if (entry.getKey().split(':')[1] === core.plugin.getName()) {
                     container.remove(new NamespacedKey(core.plugin, entry.getKey().getKey()));
                  }
               });
               _.entries(value).forEach((entry) => {
                  container.set(
                     new NamespacedKey(core.plugin, entry.key),
                     PersistentDataType.STRING,
                     _.base.encode(JSON.stringify(core.serialize(entry.value)))
                  );
               });
               state.update(true);
            }
         },
         distance: (target, flat) => {
            return _.dist(block.location, $('-', target), flat);
         },
         drops: (item) => {
            const drops = instance.getDrops($('-', item));
            return drops.length === 0 ? null : drops;
         },
         get facing () {
            const data = instance.getBlockData();
            if (data instanceof Directional) {
               return $.blockFace[data.getFacing()];
            }
         },
         set facing (value) {
            const data = instance.getBlockData();
            if (data instanceof Directional) {
               data.setFacing($.blockFace[value]);
               instance.setBlockData(data);
            }
         },
         get glowing () {
            return !!$(`@e[type=shulker,tag=grakkit,tag=glow,tag=${instance.getLocation().hashCode()}]`).instance()[0];
         },
         set glowing (value) {
            const hash = instance.getLocation().hashCode().toString();
            const selector = `@e[type=shulker,tag=grakkit,tag=glow,tag=${hash}]`;
            if (value === true && !$(selector).instance()[0]) {
               $('?shulker', instance.getLocation())
                  .tag('grakkit', 'glow', hash)
                  .effect('invisibility', { duration: Infinity, amplifier: 1 })
                  .ai(false)
                  .collidable(false)
                  .glowing(true)
                  .invulnerable(true)
                  .silent(true)
                  .health(1)
                  .vitality(1);
            } else if (value === false) {
               $(selector).remove();
            }
         },
         get instance () {
            return instance;
         },
         get location () {
            return $(instance.getLocation());
         },
         get material () {
            return $.material[instance.getType()];
         },
         set material (value) {
            instance.setType($.material[value]);
            if (value === 'air') {
               $(`@e[type=shulker,tag=grakkit,tag=glow,tag=${instance.getLocation().hashCode()}]`).remove();
            }
         },
         spawn: (lifeform) => {
            return $(`?${lifeform}`, instance.getLocation());
         },
         get world () {
            return instance.getLocation().getWorld();
         }
      };
      return block;
   };
};

export const parser = (_, $) => {
   return () => {
      return {};
   };
};

export const chain = (_, $) => {
   return {
      data: 'appender',
      distance: 'runner',
      drops: 'runner',
      facing: 'setter',
      glowing: 'setter',
      instance: 'getter',
      location: 'getter',
      material: 'setter',
      serialize: (block) => {
         return {};
      },
      spawn: 'runner',
      world: 'getter'
   };
};
