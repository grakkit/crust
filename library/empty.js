export const wrapper = (_, $) => {
   return (instance) => {
      return {
         get instance () {
            return instance;
         }
      };
   };
};

export const parser = (_, $) => {
   return (thing) => {
      return $({});
   };
};

export const chain = (_, $) => {
   return {
      instance: 'getter',
      serialize: (thing) => {
         return {
            format: 'empty'
         };
      }
   };
};
