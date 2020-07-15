const EquipmentSlot = Java.type('org.bukkit.inventory.EquipmentSlot');
const AttributeModifier = Java.type('org.bukkit.attribute.AttributeModifier');

export const wrapper = (_, $) => {
   return (instance) => {
      const thing = {
         get amount () {
            return instance.getAmount();
         },
         set amount (value) {
            if (typeof value === 'number') {
               instance = $('+').instance(Object.assign($(instance).serialize(), { amount: value }));
            } else {
               throw 'TypeError: You must supply a numeric value!';
            }
         },
         get instance () {
            return instance;
         },
         get operation () {
            return $('+').backs('amOperation')[instance.getOperation()];
         },
         set operation (value) {
            typeof value === 'string' && (value = $('+').fronts('amOperation')[value]);
            if (value instanceof AttributeModifier.Operation) {
               instance = $('+').instance(Object.assign($(instance).serialize(), { operation: value }));
            } else {
               throw 'TypeError: That equipment slot is invalid!';
            }
         },
         get slot () {
            const slot = instance.getSlot();
            return _.def(slot) ? $('+').backs('equipmentSlot')[slot] : null;
         },
         set slot (value) {
            typeof value === 'string' && (value = $('+').fronts('equipmentSlot')[value]);
            if (value instanceof EquipmentSlot || value === null) {
               instance = $('+').instance(Object.assign($(instance).serialize(), { slot: value }));
            } else {
               throw 'TypeError: That equipment slot is invalid!';
            }
         },
         get uuid () {
            return instance.getUniqueId().toString();
         }
      };
      return thing;
   };
};

export const parser = (_, $) => {
   return (thing) => {
      return new AttributeModifier(
         _.uuid(thing.uuid),
         '',
         thing.amount,
         $('+').fronts('amOperation')[thing.operation],
         _.def(thing.slot) ? $('+').fronts('equipmentSlot')[thing.slot] : null
      );
   };
};

export const chain = (_, $) => {
   return {
      amount: 'setter',
      instance: 'getter',
      operation: 'setter',
      serialize: (thing) => {
         if (_.def(thing)) {
            return {
               format: 'modifier',
               uuid: thing.uuid,
               amount: thing.amount,
               operation: thing.operation,
               slot: thing.slot
            };
         } else {
            return thing;
         }
      },
      slot: 'setter',
      uuid: 'getter'
   };
};
