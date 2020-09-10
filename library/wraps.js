//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
//  ##  ##  ##  ########  ########  ########  ########            ##  ########  //
//  ##  ##  ##  ##    ##  ##    ##  ##    ##  ##                  ##  ##        //
//  ##  ##  ##  ##    ##  ##    ##  ##    ##  ##                  ##  ##        //
//  ##  ##  ##  ########  ########  ########  ########            ##  ########  //
//  ##  ##  ##  ## ###    ##    ##  ##              ##            ##        ##  //
//  ##  ##  ##  ##  ###   ##    ##  ##              ##      ##    ##        ##  //
//  ##########  ##   ###  ##    ##  ##        ########  ##  ########  ########  //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////

/** @type {import('./tools')} */
const { num, obj, helper, def, nbt } = core.import('./tools.js');

/** @type {import('./engine')} */
const { Wrapper } = core.import('./engine.js');

/** @type {import('./types')} */
const {
   // main
   KeyedBossBar,
   Block,
   LivingEntity,
   ItemStack,
   Location,
   AttributeModifier,
   Player,
   Vector,

   // utility
   EnchantmentStorageMeta
} = core.import('./types.js');

/** @type {any} */
const BaseInstance = Object;

const base = new Wrapper(BaseInstance, {
   instance: {
      type: 'getter',
      get () {
         return this;
      }
   }
});

const positional = base.extend(BaseInstance, {
   dist: {
      type: 'runner',
      run (target) {}
   },
   location: {
      type: 'getter',
      link: 'location',
      get () {}
   }
});

/** @type {import('./types').KeyedBossBar} */
const BarInstance = KeyedBossBar;

export const bar = base.extend(BarInstance, {});

/** @type {import('./types').Block} */
const BlockInstance = Block;

export const block = positional.extend(BlockInstance, {});

/** @type {import('./types').LivingEntity} */
const EntityInstance = LivingEntity;

export const entity = positional.extend(EntityInstance, {
   ai: {
      type: 'setter',
      policy: 'boolean',
      get () {
         return this.hasAI();
      },
      set (value) {
         this.setAI(value);
      }
   },
   attribs: {
      type: 'merger',
      policy: '~{~number}',
      get () {
         return Object.fromEntries(
            Object.entries(def.attribute).map((entry) => {
               const inst = this.getAttribute(entry[1]);
               if (inst) {
                  return [ entry[0], inst.getBaseValue() ];
               } else {
                  return [ entry[0], null ];
               }
            })
         );
      },
      set (value) {
         value || (value = {});
         for (const [ key, attrib ] of Object.entries(def.attribute)) {
            const inst = this.getAttribute(attrib);
            if (inst) {
               const entry = value[key] || inst.getDefaultValue();
               inst.setBaseValue(num.clamp(entry, ...helper.bounds[key]));
            }
         }
      }
   },
   block: {
      type: 'getter',
      link: 'block',
      get () {
         return this.getLocation().getBlock();
      }
   },
   collidable: {
      type: 'setter',
      policy: 'boolean',
      get () {
         return this.isCollidable();
      },
      set (value) {
         this.setCollidable(value);
      }
   },
   data: {
      type: 'merger',
      policy: '~object',
      get () {
         return helper.data(this);
      },
      set (value) {
         helper.data(this, value);
      }
   },
   effect: {
      type: 'merger',
      policy: '~{~[number]}',
      get () {
         return Object.fromEntries(
            Object.entries(def.peType).map(([ key, value ]) => {
               const inst = this.getPotionEffect(value);
               if (inst) {
                  return [ key, [ inst.getDuration(), inst.getAmplifier() + 1 ] ];
               } else {
                  return [ key, null ];
               }
            })
         );
      },
      set (value) {
         value || (value = {});
         for (const [ key, type ] of Object.entries(def.peType)) {
            if (value[key] && value[key][0] > 0 && value[key][1] > 0) {
               this.addPotionEffect(type.createEffect(value[key][0], value[key][1] - 1));
            } else {
               this.removePotionEffect(type);
            }
         }
      }
   },
   equipment: {
      type: 'merger',
      policy: '~object',
      get () {
         return Object.fromEntries(
            Object.keys(def.equipmentSlot).map((key) => {
               return [ key, this.getEquipment()[`get${helper.equipment[key]}`] ];
            })
         );
      },
      set (value) {
         value || (value = {});
         for (const key in def.equipmentSlot) {
            item.assert(value[key], (item) => {
               this.getEquipment()[`set${helper.equipment[key]}`](item);
            });
         }
      }
   },
   health: {
      type: 'setter',
      policy: 'number',
      get () {
         return this.getHealth();
      },
      set (value) {
         this.setHealth(num.clamp(value, this.getMaxHealth()));
      }
   },
   invulnerable: {
      type: 'setter',
      policy: 'boolean',
      get () {
         return this.isInvulnerable();
      },
      set (value) {
         this.setInvulnerable(value);
      }
   },
   name: {
      type: 'setter',
      policy: '~string',
      get () {
         return this.getCustomName();
      },
      set (value) {
         this.setCustomName(value);
         this.setCustomNameVisible(value !== null);
      }
   },
   nbt: {
      type: 'merger',
      policy: 'object',
      get () {
         return nbt.serialize(this.getHandle().save(nbt.new()));
      },
      set (value) {
         try {
            this.getHandle().load(nbt.parse(value));
         } catch (error) {
            throw new SyntaxError('Cannot parse input as NBT in .nbt()');
         }
      }
   },
   passengers: {
      type: 'setter',
      policy: '~[~object]',
      get () {
         return [ ...this.getPassengers() ];
      },
      set (value) {
         value || (value = []);
         const previous = [ ...this.getPassengers() ];
         const next = obj.strain(entity.assert(value));
         for (const rider of previous) {
            next.includes(rider) || this.removePassenger(rider);
         }
         for (const rider of next) {
            previous.includes(rider) || this.addPassenger(rider);
         }
      }
   },
   remove: {
      type: 'runner',
      run () {
         this.remove();
      }
   },
   silent: {
      type: 'setter',
      policy: 'boolean',
      get () {
         return this.isSilent();
      },
      set (value) {
         this.setSilent(value);
      }
   },
   tags: {
      type: 'setter',
      policy: '~[string]',
      get () {
         return [ ...this.getScoreboardTags() ];
      },
      set (value) {
         value || (value = []);
         const previous = [ ...this.getScoreboardTags() ];
         const next = value;
         for (const tag of previous) {
            next.includes(tag) || this.removeScoreboardTag(tag);
         }
         for (const tag of next) {
            previous.includes(tag) || this.addScoreboardTag(tag);
         }
      }
   },
   type: {
      type: 'getter',
      get () {
         return obj.key(def.entityType, this.getType());
      }
   },
   uuid: {
      type: 'getter',
      get () {
         return this.getUniqueId().toString();
      }
   },
   velocity: {
      type: 'setter',
      link: 'vector',
      policy: 'object',
      get () {
         return this.getVelocity();
      },
      set (value) {
         this.setVelocity(vector.assert(value) || new Vector(0, 0, 0));
      }
   }
});

/** @type {import('./types').ItemStack} */
const ItemInstance = ItemStack;

export const item = base.extend(ItemInstance, {
   amount: {
      type: 'setter',
      policy: '~number',
      get () {
         return this.getAmount();
      },
      set (value) {
         this.setAmount(num.clamp(Math.floor(value || 0), 1, 127));
      }
   },
   data: {
      type: 'merger',
      policy: '~object',
      get () {
         return helper.meta(this, (meta) => helper.data(meta));
      },
      set (value) {
         helper.meta(this, (meta) => helper.data(meta, value));
      }
   },
   destroys: {
      type: 'setter',
      policy: '~[string]',
      get () {
         return helper.meta(this, (meta) => {
            return [ ...meta.getDestroyableKeys() ].map((value) => {
               return value.getKey();
            });
         });
      },
      set (value) {
         helper.meta(this, (meta) => {
            meta.setDestroyableKeys(helper.adventure(value || []));
         });
      }
   },
   drop: {
      type: 'runner',
      run () {}
   },
   durability: {
      type: 'setter',
      policy: '~number',
      get () {
         return helper.meta(this, (meta) => {
            return this.getType().getMaxDurability() - meta.getDamage();
         });
      },
      set (value) {
         helper.meta(this, (meta) => {
            const max = this.getType().getMaxDurability();
            meta.setDamage(max - num.clamp(Math.floor(value || max), max));
         });
      }
   },
   enchants: {
      type: 'merger',
      policy: '~{~number}',
      get () {
         return Object.fromEntries(
            Object.entries(def.enchantment).map((entry) => {
               return helper.meta(this, (meta) => {
                  if (meta instanceof EnchantmentStorageMeta) {
                     return [ entry[0], meta.getStoredEnchantLevel(entry[1]) ];
                  } else {
                     return [ entry[0], meta.getEnchantLevel(entry[1]) ];
                  }
               });
            })
         );
      },
      set (value) {
         value || (value = {});
         helper.meta(this, (meta) => {
            if (meta instanceof EnchantmentStorageMeta) {
               for (const [ key, enchant ] of Object.entries(def.enchantment)) {
                  if (value[key]) {
                     meta.addStoredEnchant(enchant, value[key], true);
                  } else {
                     meta.removeStoredEnchant(enchant);
                  }
               }
            } else {
               for (const [ key, enchant ] of Object.entries(def.enchantment)) {
                  if (value[key]) {
                     meta.addEnchant(enchant, value[key], true);
                  } else {
                     meta.removeEnchant(enchant);
                  }
               }
            }
         });
      }
   },
   flags: {
      type: 'setter',
      policy: '~[string]',
      get () {
         return helper.meta(this, (meta) => {
            return [ ...meta.getItemFlags() ].map((flag) => {
               return obj.key(def.itemFlag, flag);
            });
         });
      },
      set (value) {
         value || (value = []);
         helper.meta(this, (meta) => {
            const adds = [];
            const removes = [];
            for (const [ key, flag ] of Object.entries(def.itemFlag)) {
               if (value.includes(key)) {
                  meta.hasItemFlag(flag) || adds.push(flag);
               } else {
                  meta.hasItemFlag(flag) && removes.push(flag);
               }
            }
            meta.addItemFlags(...adds);
            meta.removeItemFlags(...removes);
         });
      }
   },
   lore: {
      type: 'setter',
      policy: '~[~string]',
      get () {
         return helper.meta(this, (meta) => [ ...(meta.getLore() || []) ]);
      },
      set (value) {
         helper.meta(this, (meta) => meta.setLore(value || []));
      }
   },
   modifier: {
      type: 'runner',
      run (uuid) {}
   },
   modifiers: {
      type: 'setter',
      policy: '~{~[object]}',
      get () {},
      set (value) {}
   },
   name: {
      type: 'setter',
      policy: '~string',
      get () {
         return helper.meta(this, (meta) => meta.getDisplayName());
      },
      set (value) {
         helper.meta(this, (meta) => meta.setDisplayName(value));
      }
   },
   nbt: {
      type: 'merger',
      policy: 'object',
      get () {
         return nbt.serialize(this.getHandle().getTag());
      },
      set (value) {
         try {
            this.getHandle().setTag(nbt.parse(value));
         } catch (error) {
            throw new SyntaxError('Cannot parse input as NBT in .nbt()');
         }
      }
   },
   places: {
      type: 'setter',
      policy: '~[string]',
      get () {
         return helper.meta(this, (meta) => {
            return [ ...meta.getPlaceableKeys() ].map((value) => value.getKey());
         });
      },
      set (value) {
         helper.meta(this, (meta) => {
            meta.setDestroyableKeys(helper.adventure(value || []));
         });
      }
   },
   title: {
      type: 'getter',
      get () {
         return this.getI18NDisplayName();
      }
   },
   type: {
      type: 'setter',
      policy: '~string',
      get () {
         return obj.key(def.material, this.getType());
      },
      set (value) {
         this.setType(def.material[value || 'air']);
      }
   }
});

/** @type {import('./types').Location} */
const LocationInstance = Location;

export const location = base.extend(LocationInstance, {
   block: {
      type: 'getter',
      link: 'block',
      get () {
         return this.getBlock();
      }
   },
   pitch: {
      type: 'setter',
      policy: 'number',
      get () {
         return this.getPitch();
      },
      set (value) {
         this.setPitch(value);
      }
   },
   x: {
      type: 'setter',
      policy: 'number',
      get () {
         return this.getX();
      },
      set (value) {
         this.setX(value);
      }
   },
   y: {
      type: 'setter',
      policy: 'number',
      get () {
         return this.getY();
      },
      set (value) {
         this.setY(value);
      }
   },
   yaw: {
      type: 'setter',
      policy: 'number',
      get () {
         return this.getYaw();
      },
      set (value) {
         this.setYaw(value);
      }
   },
   z: {
      type: 'setter',
      policy: 'number',
      get () {
         return this.getZ();
      },
      set (value) {
         this.setZ(value);
      }
   }
});

/** @type {import('./types').AttributeModifier} */
const ModifierInstance = AttributeModifier;

export const modifier = base.extend(ModifierInstance, {});

/** @type {import('./types').Player} */
const PlayerInstance = Player;

export const player = entity.extend(PlayerInstance, {
   item: {
      type: 'getter',
      link: 'item',
      get () {
         return this.getItemInHand();
      }
   },
   name: {
      type: 'setter',
      policy: '~string',
      get () {
         return this.getDisplayName();
      },
      set (value) {
         this.setDisplayName(value);
      }
   }
});

/** @type {import('./types').Vector} */
const VectorInstance = Vector;

export const vector = base.extend(VectorInstance, {});
