////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//  ########  ########  ########  ##        ########            ##  ########  //
//     ##     ##    ##  ##    ##  ##        ##                  ##  ##        //
//     ##     ##    ##  ##    ##  ##        ##                  ##  ##        //
//     ##     ##    ##  ##    ##  ##        ########            ##  ########  //
//     ##     ##    ##  ##    ##  ##              ##            ##        ##  //
//     ##     ##    ##  ##    ##  ##              ##      ##    ##        ##  //
//     ##     ########  ########  ########  ########  ##  ########  ########  //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

/** @type {import('./types')} */
const {
   // helper
   NamespacedKey,
   PersistentDataType,

   // def
   Attribute,
   Enchantment,
   EntityType,
   EquipmentSlot,
   ItemFlag,
   Material,
   PotionEffectType,

   // nbt
   NBTTagByte,
   NBTTagByteArray,
   NBTTagCompound,
   NBTTagDouble,
   NBTTagFloat,
   NBTTagInt,
   NBTTagIntArray,
   NBTTagList,
   NBTTagLong,
   NBTTagShort,
   NBTTagString
} = core.import('./types.js');

/** @type {import('./tools-spec').num} */
export const num = {
   clamp: (number, min, max) => {
      max || ((max = min), (min = 0));
      return number < min ? min : number > max ? max : number;
   }
};

/** @type {import('./tools-spec').obj} */
export const obj = {
   key: (object, value) => {
      return Object.keys(object)[Object.values(object).indexOf(value)];
   },
   strain: (object, filter) => {
      filter || (filter = (value) => value);
      if (is.array(object)) {
         return object.filter(filter);
      } else {
         return Object.fromEntries(Object.entries(object).filter((entry, ...args) => filter(entry[1], ...args)));
      }
   }
};

/** @type {import('./tools-spec').helper} */
export const helper = {
   adventure: (value) => {
      return helper.collect(...value.map((entry) => NamespacedKey.minecraft(entry)));
   },
   bounds: {
      max_health: [ 1024 ],
      follow_range: [ 2048 ],
      knockback_resistance: [ 1 ],
      movement_speed: [ 1024 ],
      attack_damage: [ 2048 ],
      armor: [ 30 ],
      armor_toughness: [ 20 ],
      attack_knockback: [ 5 ],
      attack_speed: [ 1024 ],
      luck: [ -1024, 1024 ],
      jump_strength: [ 2 ],
      flying_speed: [ 1024 ],
      spawn_reinforcements: [ 1 ]
   },
   bridge: (type, filter, consumer) => {
      const output = {};
      [ ...type.values() ].map((value) => {
         if (typeof filter !== 'function' || filter(value)) {
            let name;
            if (consumer) name = consumer(value);
            else if (typeof value.getKey === 'function') name = value.getKey().getKey();
            else name = value.name().toLowerCase();
            output[name] = value;
         }
      });
      return output;
   },
   collect: (...array) => {
      return new ArrayList({ toArray: () => array });
   },
   data: (host, value) => {
      const key = new NamespacedKey(core.plugin, 'jx');
      const type = PersistentDataType.STRING;
      const container = host.getPersistentDataContainer();
      switch (value) {
         case null:
            container.remove(key);
            break;
         case undefined:
            return JSON.parse(container.get(key, type)) || {};
         default:
            const data = JSON.stringify(core.serialize(value, true));
            container.set(key, type, data);
      }
   },
   dist: (source, target, flat) => {
      if (target instanceof Location) {
         if (source.getWorld() === target.getWorld()) {
            const deltaX = source.getX() - target.getX();
            const deltaY = source.getY() - target.getY();
            const deltaZ = source.getZ() - target.getZ();
            if (flat) {
               return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
            } else {
               return Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
            }
         } else {
            return Infinity;
         }
      } else if (typeof target.getLocation === 'function') {
         return helper.dist(source.getLocation(), target, flat);
      } else {
         return NaN;
      }
   },
   meta: (item, modifier) => {
      const meta = item.getItemMeta();
      if (meta) {
         const output = modifier(meta);
         if (output === void 0) {
            item.setItemMeta(meta);
         } else {
            return output;
         }
      }
   },
   slots: {
      chest: 'chestplate',
      feet: 'boots',
      hand: 'itemInMainHand',
      head: 'helmet',
      legs: 'leggings',
      off_hand: 'itemInOffHand'
   }
};

export const def = {
   attribute: helper.bridge(Attribute, 0, (value) => value.getKey().getKey().split('.')[1]),
   enchantment: helper.bridge(Enchantment),
   entityType: helper.bridge(EntityType, (value) => value.name() !== 'UNKNOWN'),
   equipmentSlot: helper.bridge(EquipmentSlot),
   itemFlag: helper.bridge(ItemFlag, 0, (value) => value.name().split('_')[1].toLowerCase()),
   material: helper.bridge(Material, (value) => !value.isLegacy()),
   peType: helper.bridge(PotionEffectType, 0, (value) => value.getHandle().c().split('.')[2])
};

/** @type {import('./tools-spec').nbt} */
export const nbt = {
   new: () => {
      return new NBTTagCompound();
   },
   parse: (data) => {
      switch (data.type) {
         case 'None':
            return data.value;
         case 'Int':
            return NBTTagInt.a(data.value);
         case 'Float':
            return NBTTagFloat.a(data.value);
         case 'Double':
            return NBTTagDouble.a(data.value);
         case 'Long':
            return NBTTagLong.a(data.value);
         case 'Short':
            return NBTTagShort.a(data.value);
         case 'Byte':
            return NBTTagByte.a(data.value);
         case 'String':
            return NBTTagString.a(data.value);
         case 'End':
            return null;
         case 'List':
            const list = new NBTTagList();
            data.value.forEach((entry) => list.add(nbt.parse(entry)));
            return list;
         case 'ByteArray':
            const bytes = new NBTTagByteArray(helper.collect());
            data.value.forEach((entry) => bytes.add(nbt.parse(entry)));
            return bytes;
         case 'IntArray':
            const ints = new NBTTagIntArray(helper.collect());
            data.value.forEach((entry) => ints.add(nbt.parse(entry)));
            return ints;
         case 'Compound':
            const compound = new NBTTagCompound();
            Object.entries(data.value).forEach((entry) => compound.set(entry[0], nbt.parse(entry[1])));
            return compound;
      }
   },
   serialize: (data) => {
      if ([ null, undefined ].includes(data)) {
         return { type: 'None', value: data };
      } else {
         let value = undefined;
         const type = data.getClass().getCanonicalName().split('NBTTag')[1];
         switch (type) {
            case 'Int':
               value = data.asInt();
               break;
            case 'Float':
               value = data.asFloat();
               break;
            case 'Double':
               value = data.asDouble();
               break;
            case 'Long':
               value = data.asLong();
               break;
            case 'Short':
               value = data.asShort();
               break;
            case 'Byte':
               value = data.asByte();
               break;
            case 'String':
               value = data.asString();
               break;
            case 'End':
               value = null;
               break;
            case 'List':
            case 'ByteArray':
            case 'IntArray':
               value = [ ...data ].map(nbt.serialize);
               break;
            case 'Compound':
               value = Object.fromEntries(
                  [ ...data.map.entrySet() ].map((entry) => {
                     return [ entry.getKey(), nbt.serialize(entry.getValue()) ];
                  })
               );
               break;
         }
         return { type: type, value: value };
      }
   }
};
