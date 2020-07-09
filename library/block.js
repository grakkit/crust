const Material = Java.type('org.bukkit.Material');
const BlockFace = Java.type('org.bukkit.block.BlockFace');
const ItemStack = Java.type('org.bukkit.inventory.ItemStack');
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
            if (typeof value === 'object') {
               const state = instance.getState();
               if (state instanceof PersistentDataHolder) {
                  $('+').data(state.getPersistentDataContainer(), value);
                  state.update(true);
               }
            } else {
               throw 'TypeError: You must supply an object or null value!';
            }
         },
         distance: (target, option) => {
            try {
               return $('+').distance(instance.getLocation(), target, option);
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
         drops: (item) => {
            if (_.def(item)) {
               item instanceof ItemStack || (item = $('+').instance(item));
               if (item instanceof ItemStack) {
                  return $([ ...instance.getDrops(item) ]);
               } else {
                  throw 'TypeError: You must specify an item stack or nothing at all!';
               }
            } else {
               return $([ ...instance.getDrops() ]);
            }
         },
         get facing () {
            const data = instance.getBlockData();
            if (data instanceof Directional) return $('+').backs('blockFace')[data.getFacing()];
         },
         set facing (value) {
            typeof value === 'string' && (value = $('+').fronts('blockFace')[value]);
            if (value instanceof BlockFace) {
               const data = instance.getBlockData();
               if (data instanceof Directional) {
                  data.setFacing(value);
                  instance.setBlockData(data);
               }
            } else {
               throw 'TypeError: You must specify a block face!';
            }
         },
         get instance () {
            return instance;
         },
         get location () {
            return instance.getLocation();
         },
         get material () {
            return $('+').backs('material')[instance.getType()];
         },
         set material (value) {
            typeof value === 'string' && (value = $('+').fronts('material')[value]);
            if (value instanceof Material) {
               instance.setType(value);
            } else {
               throw 'TypeError: You must specify a material!';
            }
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
      throw 'SyntaxError: Blocks cannot be parsed and serialized!';
   };
};

export const chain = (_, $) => {
   return {
      data: 'appender',
      distance: 'runner',
      drops: 'runner',
      // re-add in future commit, use silent, no AI, invisible magma cubes for clean outlines
      // glowing: 'setter',
      instance: 'getter',
      location: 'getterLink',
      material: 'setter',
      serialize: (thing) => {
         throw 'SyntaxError: Blocks cannot be parsed and serialized!';
      },
      vector: 'getterLink',
      world: 'getter',
      x: 'getter',
      y: 'getter',
      z: 'getter'
   };
};
