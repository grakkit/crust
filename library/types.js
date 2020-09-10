////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//  ########  ##    ##  ########  ########  ########            ##  ########  //
//     ##     ##    ##  ##    ##  ##        ##                  ##  ##        //
//     ##     ##    ##  ##    ##  ##        ##                  ##  ##        //
//     ##     ########  ########  #######   ########            ##  ########  //
//     ##        ##     ##        ##              ##            ##        ##  //
//     ##        ##     ##        ##              ##      ##    ##        ##  //
//     ##        ##     ##        ########  ########  ##  ########  ########  //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

/** @type {import('./../../core/dict/core').core} */
export const core = global.core;
/** @type {import('./../../core/dict/classes').Server} */
export const server = global.server;

// aikar: NOOOO!!! You can't just use notch's superior NBT system!!!
// harrix: haha nms go brrr
const nms = `net.minecraft.server.${server.getClass().getCanonicalName().split('.')[3]}`;

export const NBTTagInt = core.type(`${nms}.NBTTagInt`);
export const NBTTagByte = core.type(`${nms}.NBTTagByte`);
export const NBTTagList = core.type(`${nms}.NBTTagList`);
export const NBTTagLong = core.type(`${nms}.NBTTagLong`);
export const NBTTagFloat = core.type(`${nms}.NBTTagFloat`);
export const NBTTagShort = core.type(`${nms}.NBTTagShort`);
export const NBTTagDouble = core.type(`${nms}.NBTTagDouble`);
export const NBTTagString = core.type(`${nms}.NBTTagString`);
export const NBTTagCompound = core.type(`${nms}.NBTTagCompound`);
export const NBTTagIntArray = core.type(`${nms}.NBTTagIntArray`);
export const NBTTagByteArray = core.type(`${nms}.NBTTagByteArray`);

export const Block = core.type('org.bukkit.block.Block');
export const Vector = core.type('org.bukkit.util.Vector');
export const Player = core.type('org.bukkit.entity.Player');
export const Iterable = core.type('java.lang.Iterable');
export const Location = core.type('org.bukkit.Location');
export const Material = core.type('org.bukkit.Material');
export const ItemFlag = core.type('org.bukkit.inventory.ItemFlag');
export const ArrayList = core.type('java.util.ArrayList');
export const Attribute = core.type('org.bukkit.attribute.Attribute');
export const ItemStack = core.type('org.bukkit.inventory.ItemStack');
export const EntityType = core.type('org.bukkit.entity.EntityType');
export const Enchantment = core.type('org.bukkit.enchantments.Enchantment');
export const KeyedBossBar = core.type('org.bukkit.boss.KeyedBossBar');
export const LivingEntity = core.type('org.bukkit.entity.LivingEntity');
export const NamespacedKey = core.type('org.bukkit.NamespacedKey');
export const CommandSender = core.type('org.bukkit.command.CommandSender');
export const EquipmentSlot = core.type('org.bukkit.inventory.EquipmentSlot');
export const PotionEffectType = core.type('org.bukkit.potion.PotionEffectType');
export const AttributeModifier = core.type('org.bukkit.attribute.AttributeModifier');
export const PersistentDataType = core.type('org.bukkit.persistence.PersistentDataType');
export const EnchantmentStorageMeta = core.type('org.bukkit.inventory.meta.EnchantmentStorageMeta');
