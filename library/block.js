const Directional = Java.type('org.bukkit.block.data.Directional');
const PersistentDataHolder = Java.type('org.bukkit.persistence.PersistentDataHolder');

export const wrapper = (_, $) => {
   return (instance) => {
      const block = {
         get data () {
            const state = instance.getState();
            return state instanceof PersistentDataHolder ? $('+').data(state.getPersistentDataContainer()) : {};
         },
         set data (value) {
            const state = instance.getState();
            if (state instanceof PersistentDataHolder) {
               $('+').data(state.getPersistentDataContainer(), value);
               state.update(true);
            }
         },
         distance: (target, option) => {
            try {
               return $('+').distance(instance.location, target, option);
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
         drops: (item) => {
            const drops = instance.getDrops($(':standardize', item));
            return drops.length === 0 ? null : drops;
         },
         get facing () {
            const data = instance.getBlockData();
            if (data instanceof Directional) return $('+').fronts('blockFace')[data.getFacing()];
         },
         set facing (value) {
            const data = instance.getBlockData();
            if (data instanceof Directional) {
               data.setFacing($.blockFace[value]);
               instance.setBlockData(data);
            }
         },
         get instance () {
            return instance;
         },
         get inventory () {
            const state = instance.getState();
         },
         set inventory (value) {},
         get location () {
            return instance.getLocation();
         },
         get material () {
            return $('+').backs('material')[instance.getType()];
         },
         set material (value) {
            instance.setType($('+').fronts('material')[value]);
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
