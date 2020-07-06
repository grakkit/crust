const TileState = Java.type('org.bukkit.block.TileState');
const Directional = Java.type('org.bukkit.block.data.Directional');
const NamespacedKey = Java.type('org.bukkit.NamespacedKey');
const PersistentDataType = Java.type('org.bukkit.persistence.PersistentDataType');
const PersistentDataHolder = Java.type('org.bukkit.persistence.PersistentDataHolder');

export const wrapper = (_, $) => {
   // $('*blockBreak').if(true).do((event) => $(event.getBlock()).glowing(false));
   // $('*entityDamage').if(true).do((event) => $(event.getEntity()).block().glowing(false));
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
            if (state instanceof PersistentDataHolder) {
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
            const input = $(':standardize', target);
            if (input) {
               if (typeof input[Symbol.iterator] === 'function') {
                  return input.map((entry) => _.dist(block.location.instance, entry, flat));
               } else {
                  return _.dist(block.location.instance, input, flat);
               }
            }
         },
         drops: (item) => {
            const drops = instance.getDrops($(':standardize', item));
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
         /*
         get glowing () {
            return !!$(`@e[type=magma_cube,tag=glowing,tag=${instance.getLocation().hashCode()}]`).instance()[0];
         },
         set glowing (value) {
            const hash = instance.getLocation().hashCode().toString();
            if (value && block.material !== 'air' && !$(instance).glowing()) {
               $(instance.getLocation())
                  .spawn('magma_cube')
                  .tag('glowing', hash)
                  .effect('invisibility', { duration: Infinity, amplifier: 1 })
                  .ai(false)
                  .silent(true)
                  .glowing(true)
                  .collidable(false)
                  .invulnerable(true)
                  .vitality(1)
                  .health(1)
                  .instance()
                  .setSize(2);
            } else if (value === false) {
               $(`@e[type=magma_cube,tag=glowing,tag=${hash}]`).remove();
            }
         },
         */
         get instance () {
            return instance;
         },
         get location () {
            return instance.getLocation().toVector();
         },
         get material () {
            return $.material[instance.getType()];
         },
         set material (value) {
            instance.setType($.material[value]);
            value === 'air' && $(instance).glowing(false);
         },
         spawn: (lifeform) => {
            return $(`?${lifeform}`, instance.getLocation());
         },
         get vector () {
            return instance.getLocation().toVector();
         },
         get world () {
            return instance.getWorld();
         },
         get x () {
            return instance.getX();
         },
         get y () {
            return instance.getY();
         },
         get z () {
            return instance.getZ();
         }
      };
      return block;
   };
};

export const parser = (_, $) => {
   return (thing) => {
      return {
         data: server.createBlockData(thing.data),
         state: $('!stone').nbt(thing.state).meta().getBlockState()
      };
   };
};

export const chain = (_, $) => {
   return {
      data: 'appender',
      distance: 'runner',
      drop: 'runnerLink',
      drops: 'runner',
      glowing: 'setter',
      instance: 'getter',
      location: 'getterLink',
      material: 'setter',
      serialize: (thing) => {
         return {
            format: 'block',
            data: thing.instance.getBlockData().getAsString(),
            state: $(`!${thing.material}`).meta((meta) => meta.setBlockState(thing.instance.getState())).nbt()
         };
      },
      spawn: 'runnerLink',
      vector: 'getterLink',
      world: 'getter',
      x: 'getter',
      y: 'getter',
      z: 'getter'
   };
};
