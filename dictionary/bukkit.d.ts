export interface Block extends Metadatable {
   breakNaturally(): boolean;
   breakNaturally(tool: ItemStack, trigger_effect: boolean): boolean;
   breakNaturally(tool: ItemStack): boolean;
   getBiome(): Biome;
   getBlockData(): BlockData;
   getBlockKey(): number;
   static getBlockKey(x: int, y: int, z: int): number;
   static getBlockKeyX(packed: long): number;
   static getBlockKeyY(packed: long): number;
   static getBlockKeyZ(packed: long): number;
   getBlockPower(): number;
   getBlockPower(face: BlockFace): number;
   getBoundingBox(): BoundingBox;
   getChunk(): Chunk;
   getData(): number;
   getDrops(): Collection<ItemStack>;
   getDrops(tool: ItemStack, entity: Entity): Collection<ItemStack>;
   getDrops(tool: ItemStack): Collection<ItemStack>;
   getFace(block: Block): BlockFace;
   getHumidity(): number;
   getLightFromBlocks(): number;
   getLightFromSky(): number;
   getLightLevel(): number;
   getLocation(): Location;
   getLocation(loc: Location): Location;
   getPistonMoveReaction(): PistonMoveReaction;
   getRelative(mod_x: int, mod_y: int, mod_z: int): Block;
   getRelative(face: BlockFace): Block;
   getRelative(face: BlockFace, distance: int): Block;
   getSoundGroup(): BlockSoundGroup;
   getState(): BlockState;
   getState(use_snapshot: boolean): BlockState;
   getTemperature(): number;
   getType(): Material;
   getWorld(): World;
   getX(): number;
   getY(): number;
   getZ(): number;
   isBlockFaceIndirectlyPowered(face: BlockFace): boolean;
   isBlockFacePowered(face: BlockFace): boolean;
   isBlockIndirectlyPowered(): boolean;
   isBlockPowered(): boolean;
   isEmpty(): boolean;
   isLiquid(): boolean;
   isPassable(): boolean;
   rayTrace(
      start: Location,
      direction: Vector,
      max_distance: double,
      fluid_collision_mode: FluidCollisionMode
   ): RayTraceResult;
   setBiome(bio: Biome): void;
   setBlockData(data: BlockData): void;
   setBlockData(data: BlockData, apply_physics: boolean): void;
   setType(type: Material): void;
   setType(type: Material, apply_physics: boolean): void;
}
export interface Entity extends Metadatable, CommandSender, Nameable, PersistentDataHolder {
   addPassenger(passenger: Entity): boolean;
   addScoreboardTag(tag: string): boolean;
   eject(): boolean;
   fromMobSpawner(): boolean;
   getBoundingBox(): BoundingBox;
   getChunk(): Chunk;
   getEntityId(): number;
   getEntitySpawnReason(): CreatureSpawnEvent.SpawnReason;
   getFacing(): BlockFace;
   getFallDistance(): number;
   getFireTicks(): number;
   getHeight(): number;
   getLastDamageCause(): EntityDamageEvent;
   getLocation(): Location;
   getLocation(loc: Location): Location;
   getMaxFireTicks(): number;
   getNearbyEntities(x: double, y: double, z: double): List<Entity>;
   getOrigin(): Location;
   getPassenger(): Entity;
   getPassengers(): List<Entity>;
   getPistonMoveReaction(): PistonMoveReaction;
   getPortalCooldown(): number;
   getPose(): Pose;
   getScoreboardTags(): Set<string>;
   getServer(): Server;
   getTicksLived(): number;
   getType(): EntityType;
   getUniqueId(): UUID;
   getVehicle(): Entity;
   getVelocity(): Vector;
   getWidth(): number;
   getWorld(): World;
   hasGravity(): boolean;
   isCustomNameVisible(): boolean;
   isDead(): boolean;
   isEmpty(): boolean;
   isGlowing(): boolean;
   isInsideVehicle(): boolean;
   isInvulnerable(): boolean;
   isOnGround(): boolean;
   isPersistent(): boolean;
   isSilent(): boolean;
   isValid(): boolean;
   leaveVehicle(): boolean;
   playEffect(type: EntityEffect): void;
   remove(): void;
   removePassenger(passenger: Entity): boolean;
   removeScoreboardTag(tag: string): boolean;
   setCustomNameVisible(flag: boolean): void;
   setFallDistance(distance: float): void;
   setFireTicks(ticks: int): void;
   setGlowing(flag: boolean): void;
   setGravity(gravity: boolean): void;
   setInvulnerable(flag: boolean): void;
   setLastDamageCause(event: EntityDamageEvent): void;
   setPassenger(passenger: Entity): boolean;
   setPersistent(persistent: boolean): void;
   setPortalCooldown(cooldown: int): void;
   setRotation(yaw: float, pitch: float): void;
   setSilent(flag: boolean): void;
   setTicksLived(value: int): void;
   setVelocity(velocity: Vector): void;
   spigot(): Entity.Spigot;
   teleport(destination: Entity): boolean;
   teleport(destination: Entity, cause: PlayerTeleportEvent.TeleportCause): boolean;
   teleport(location: Location): boolean;
   teleport(location: Location, cause: PlayerTeleportEvent.TeleportCause): boolean;
   teleportAsync(loc: Location): CompletableFuture<Boolean>;
   teleportAsync(loc: Location, cause: PlayerTeleportEvent.TeleportCause): CompletableFuture<Boolean>;
}
export class ItemStack extends Object implements Cloneable, ConfigurationSerializable {
   constructor ();
   constructor (stack: ItemStack);
   constructor (type: Material);
   constructor (type: Material, amount: number);
   constructor (type: Material, amount: number, damage: number);
   constructor (type: Material, amount: number, damage: number, data: Byte);
   add (): ItemStack;
   add (qty: int): ItemStack;
   addEnchantment (ench: Enchantment, level: int): void;
   addEnchantments (enchantments: Map<Enchantment, Integer>): void;
   addItemFlags (...item_flags: ItemFlag): void;
   addUnsafeEnchantment (ench: Enchantment, level: int): void;
   addUnsafeEnchantments (enchantments: Map<Enchantment, Integer>): void;
   asOne (): ItemStack;
   asQuantity (qty: int): ItemStack;
   clone (): ItemStack;
   containsEnchantment (ench: Enchantment): boolean;
   static deserialize (args: Map<string, JavaObject>): ItemStack;
   static deserializeBytes (bytes: byte[]): ItemStack;
   ensureServerConversions (): ItemStack;
   equals (obj: JavaObject): boolean;
   getAmount (): number;
   getData (): MaterialData;
   getDurability (): number;
   getEnchantmentLevel (ench: Enchantment): number;
   getEnchantments (): Map<Enchantment, Integer>;
   getI18NDisplayName (): string;
   getItemFlags (): Set<ItemFlag>;
   getItemMeta (): ItemMeta;
   getLore (): List<string>;
   getMaxItemUseDuration (): number;
   getMaxStackSize (): number;
   getType (): Material;
   hashCode (): number;
   hasItemFlag (flag: ItemFlag): boolean;
   hasItemMeta (): boolean;
   isSimilar (stack: ItemStack): boolean;
   removeEnchantment (ench: Enchantment): number;
   removeItemFlags (...item_flags: ItemFlag): void;
   serialize (): Map<string, JavaObject>;
   serializeAsBytes (): number[];
   setAmount (amount: int): void;
   setData (data: MaterialData): void;
   setDurability (durability: short): void;
   setItemMeta (item_meta: ItemMeta): boolean;
   setLore (lore: List<string>): void;
   setType (type: Material): void;
   subtract (): ItemStack;
   subtract (qty: int): ItemStack;
   tostring (): string;
}
export class Location extends Object implements Cloneable, ConfigurationSerializable {
   constructor (world: World, x: number, y: number, z: number);
   constructor (world: World, x: number, y: number, z: number, yaw: number, pitch: number);
   add (x: double, y: double, z: double): Location;
   add (vec: Location): Location;
   add (base: Location, x: double, y: double, z: double): Location;
   add (vec: Vector): Location;
   checkFinite (): void;
   clone (): Location;
   createExplosion (power: float): boolean;
   createExplosion (power: float, set_fire: boolean): boolean;
   createExplosion (power: float, set_fire: boolean, break_blocks: boolean): boolean;
   createExplosion (source: Entity, power: float, set_fire: boolean, break_blocks: boolean): boolean;
   createExplosion (source: Entity, power: float): boolean;
   createExplosion (source: Entity, power: float, set_fire: boolean): boolean;
   static deserialize (args: Map<string, JavaObject>): Location;
   distance (o: Location): number;
   distanceSquared (o: Location): number;
   equals (obj: JavaObject): boolean;
   getBlock (): Block;
   getBlockX (): number;
   getBlockY (): number;
   getBlockZ (): number;
   getChunk (): Chunk;
   getDirection (): Vector;
   getNearbyEntities (x: double, y: double, z: double): Collection<Entity>;
   getNearbyEntitiesByType<T extends Entity> (
      clazz: Class<Entity>,
      x_radius: double,
      y_radius: double,
      z_radius: double,
      predicate: Predicate<T>
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (clazz: Class<T>, radius: double): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (clazz: Class<T>, xz_radius: double, y_radius: double): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (
      clazz: Class<T>,
      x_radius: double,
      y_radius: double,
      z_radius: double
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (
      clazz: Class<T>,
      xz_radius: double,
      y_radius: double,
      predicate: Predicate<T>
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (clazz: Class<T>, radius: double, predicate: Predicate<T>): Collection<T>;
   getNearbyLivingEntities (radius: double): Collection<LivingEntity>;
   getNearbyLivingEntities (xz_radius: double, y_radius: double): Collection<LivingEntity>;
   getNearbyLivingEntities (x_radius: double, y_radius: double, z_radius: double): Collection<LivingEntity>;
   getNearbyLivingEntities (
      x_radius: double,
      y_radius: double,
      z_radius: double,
      predicate: Predicate<LivingEntity>
   ): Collection<LivingEntity>;
   getNearbyLivingEntities (
      xz_radius: double,
      y_radius: double,
      predicate: Predicate<LivingEntity>
   ): Collection<LivingEntity>;
   getNearbyLivingEntities (radius: double, predicate: Predicate<LivingEntity>): Collection<LivingEntity>;
   getNearbyPlayers (radius: double): Collection<Player>;
   getNearbyPlayers (xz_radius: double, y_radius: double): Collection<Player>;
   getNearbyPlayers (x_radius: double, y_radius: double, z_radius: double): Collection<Player>;
   getNearbyPlayers (
      x_radius: double,
      y_radius: double,
      z_radius: double,
      predicate: Predicate<Player>
   ): Collection<Player>;
   getNearbyPlayers (xz_radius: double, y_radius: double, predicate: Predicate<Player>): Collection<Player>;
   getNearbyPlayers (radius: double, predicate: Predicate<Player>): Collection<Player>;
   getPitch (): number;
   getWorld (): World;
   getX (): number;
   getY (): number;
   getYaw (): number;
   getZ (): number;
   hashCode (): number;
   isChunkLoaded (): boolean;
   isGenerated (): boolean;
   isWorldLoaded (): boolean;
   length (): number;
   lengthSquared (): number;
   static locToBlock (loc: double): number;
   multiply (m: double): Location;
   static normalizePitch (pitch: float): number;
   static normalizeYaw (yaw: float): number;
   serialize (): Map<string, JavaObject>;
   set (x: double, y: double, z: double): Location;
   setDirection (vector: Vector): Location;
   setPitch (pitch: float): void;
   setWorld (world: World): void;
   setX (x: double): void;
   setY (y: double): void;
   setYaw (yaw: float): void;
   setZ (z: double): void;
   subtract (x: double, y: double, z: double): Location;
   subtract (vec: Location): Location;
   subtract (base: Location, x: double, y: double, z: double): Location;
   subtract (vec: Vector): Location;
   toBlockKey (): number;
   toBlockLocation (): Location;
   toCenterLocation (): Location;
   toHighestLocation (): Location;
   toHighestLocation (heightmap: HeightmapType): Location;
   tostring (): string;
   toVector (): Vector;
   zero (): Location;
}
export class Vector extends Object implements Cloneable, ConfigurationSerializable {
   constructor ();
   constructor (x: number, y: number, z: number);
   constructor (x: number, y: number, z: number);
   constructor (x: number, y: number, z: number);
   add (vec: Vector): Vector;
   angle (other: Vector): number;
   checkFinite (): void;
   clone (): Vector;
   copy (vec: Vector): Vector;
   crossProduct (o: Vector): Vector;
   static deserialize (args: Map<string, JavaObject>): Vector;
   distance (o: Vector): number;
   distanceSquared (o: Vector): number;
   divide (vec: Vector): Vector;
   dot (other: Vector): number;
   equals (obj: JavaObject): boolean;
   getBlockX (): number;
   getBlockY (): number;
   getBlockZ (): number;
   getCrossProduct (o: Vector): Vector;
   static getEpsilon (): number;
   static getMaximum (v1: Vector, v2: Vector): Vector;
   getMidpoint (other: Vector): Vector;
   static getMinimum (v1: Vector, v2: Vector): Vector;
   static getRandom (): Vector;
   getX (): number;
   getY (): number;
   getZ (): number;
   hashCode (): number;
   isInAABB (min: Vector, max: Vector): boolean;
   isInSphere (origin: Vector, radius: double): boolean;
   isNormalized (): boolean;
   length (): number;
   lengthSquared (): number;
   midpoint (other: Vector): Vector;
   multiply (m: double): Vector;
   multiply (m: float): Vector;
   multiply (m: int): Vector;
   multiply (vec: Vector): Vector;
   normalize (): Vector;
   rotateAroundAxis (axis: Vector, angle: double): Vector;
   rotateAroundNonUnitAxis (axis: Vector, angle: double): Vector;
   rotateAroundX (angle: double): Vector;
   rotateAroundY (angle: double): Vector;
   rotateAroundZ (angle: double): Vector;
   serialize (): Map<string, JavaObject>;
   setX (x: double): Vector;
   setX (x: float): Vector;
   setX (x: int): Vector;
   setY (y: double): Vector;
   setY (y: float): Vector;
   setY (y: int): Vector;
   setZ (z: double): Vector;
   setZ (z: float): Vector;
   setZ (z: int): Vector;
   subtract (vec: Vector): Vector;
   toBlockVector (): BlockVector;
   toLocation (world: World): Location;
   toLocation (world: World, yaw: float, pitch: float): Location;
   tostring (): string;
   zero (): Vector;
}
