export class Tag<X> {}
export class Byte {}
export class Item {}
export class List<X> {}
export class Pose {}
export class Raid {}
export class Arrow {}
export class Biome {}
export class Chunk {}
export class Class<X> {}
export class Keyed {}
export class Sound {}
export class World {}
export class Effect {}
export class Logger {}
export class Player {}
export class Recipe {}
export class Server {}
export class BanList {}
export class BarFlag {}
export class BossBar {}
export class HelpMap {}
export class Integer {}
export class MapView {}
export class BarColor {}
export class BarStyle {}
export class Consumer<X> {}
export class GameMode {}
export class GameRule<X> {}
export class ItemFlag {}
export class ItemMeta {}
export class TreeType {}
export class Material {}
export class Merchant {}
export class MobGoals {}
export class Nameable {}
export class Particle {}
export class BlockData {}
export class BlockFace {}
export class Cloneable {}
export class HeightMap {}
export class Inventory {}
export class LootTable {}
export class Messenger {}
export class Predicate<X> {}
export class WorldType {}
export class BlockState {}
export class CommandMap {}
export class Comparable<X> {}
export class Difficulty {}
export class EntityType {}
export class JavaObject {}
export class Collection<X> {}
export class Advancement {}
export class BlockVector {}
export class BoundingBox {}
export class Enchantment {}
export class ItemFactory {}
export class Metadatable {}
export class WorldBorder {}
export class DragonBattle {}
export class EntityEffect {}
export class FallingBlock {}
export class KeyedBossBar {}
export class LivingEntity {}
export class MaterialData {}
export class Serializable {}
export class UnsafeValues {}
export class WorldCreator {}
export class AbstractArrow {}
export class BaseComponent {}
export class BufferedImage {}
export class ChunkSnapshot {}
export class CommandSender {}
export class HeightmapType {}
export class InventoryType {}
export class NamespacedKey {}
export class OfflinePlayer {}
export class PlayerProfile {}
export class PluginCommand {}
export class PluginManager {}
export class SoundCategory {}
export class StructureType {}
export class BlockPopulator {}
export class ChunkGenerator {}
export class RayTraceResult {}
export class BlockSoundGroup {}
export class BukkitScheduler {}
export class InventoryHolder {}
export class LightningStrike {}
export class ServicesManager {}
export class CachedServerIcon {}
export class CompletableFuture<X> {}
export class EntityDamageEvent {}
export class ScoreboardManager {}
export class FluidCollisionMode {}
export class PistonMoveReaction {}
export class BlockChangeDelegate {}
export class ConsoleCommandSender {}
export class PersistentDataHolder {}
export class PluginMessageRecipient {}
export class ConfigurationSerializable {}

export class BanList$Type {}
export class World$Spigot {}
export class Entity$Spigot {}
export class Server$Spigot {}
export class World$Environment {}
export class Warning$WarningState {}
export class World$ChunkLoadCallback {}
export class ChunkGenerator$ChunkData {}
export class CreatureSpawnEvent$SpawnReason {}
export class PlayerTeleportEvent$TeleportCause {}

export class UUID extends Object implements Serializable, Comparable<UUID> {
   constructor (mostSigBits: number, leastSigBits: number);
   clockSequence (): number;
   compareTo (val: UUID): number;
   equals (obj: JavaObject): boolean;
   static fromstring (name: string): UUID;
   getLeastSignificantBits (): number;
   getMostSignificantBits (): number;
   hashCode (): number;
   static nameUUIDFromBytes (name: number[]): UUID;
   node (): number;
   static randomUUID (): UUID;
   timestamp (): number;
   tostring (): string;
   variant (): number;
   version (): number;
}

export interface World extends PluginMessageRecipient, Metadatable {
   addPluginChunkTicket(x: number, z: number, plugin: Plugin): boolean;
   canGenerateStructures(): boolean;
   createExplosion(x: number, y: number, z: number, power: number): boolean;
   createExplosion(x: number, y: number, z: number, power: number, set_fire: boolean): boolean;
   createExplosion(x: number, y: number, z: number, power: number, set_fire: boolean, break_blocks: boolean): boolean;
   createExplosion(
      x: number,
      y: number,
      z: number,
      power: number,
      set_fire: boolean,
      break_blocks: boolean,
      source: Entity
   ): boolean;
   createExplosion(source: Entity, power: number): boolean;
   createExplosion(source: Entity, power: number, set_fire: boolean): boolean;
   createExplosion(source: Entity, power: number, set_fire: boolean, break_blocks: boolean): boolean;
   createExplosion(source: Entity, loc: Location, power: number): boolean;
   createExplosion(source: Entity, loc: Location, power: number, set_fire: boolean): boolean;
   createExplosion(source: Entity, loc: Location, power: number, set_fire: boolean, break_blocks: boolean): boolean;
   createExplosion(loc: Location, power: number): boolean;
   createExplosion(loc: Location, power: number, set_fire: boolean): boolean;
   createExplosion(loc: Location, power: number, set_fire: boolean, break_blocks: boolean): boolean;
   createExplosion(loc: Location, power: number, set_fire: boolean, break_blocks: boolean, source: Entity): boolean;
   dropItem(location: Location, item: ItemStack): Item;
   dropItemNaturally(location: Location, item: ItemStack): Item;
   generateTree(location: Location, type: TreeType): boolean;
   generateTree(loc: Location, type: TreeType, delegate: BlockChangeDelegate): boolean;
   getAllowAnimals(): boolean;
   getAllowMonsters(): boolean;
   getAmbientSpawnLimit(): number;
   getAnimalSpawnLimit(): number;
   getBiome(x: number, z: number): Biome;
   getBiome(x: number, y: number, z: number): Biome;
   getBlockAt(x: number, y: number, z: number): Block;
   getBlockAt(location: Location): Block;
   getBlockAtKey(key: number): Block;
   getChunkAt(x: number, z: number): Chunk;
   getChunkAt(chunk_key: number): Chunk;
   getChunkAt(block: Block): Chunk;
   getChunkAt(location: Location): Chunk;
   getChunkAtAsync(x: number, z: number): CompletableFuture<Chunk>;
   getChunkAtAsync(x: number, z: number, gen: boolean): CompletableFuture<Chunk>;
   getChunkAtAsync(x: number, z: number, gen: boolean, urgent: boolean): CompletableFuture<Chunk>;
   getChunkAtAsync(x: number, z: number, gen: boolean, cb: Consumer<Chunk>): void;
   getChunkAtAsync(x: number, z: number, cb: Consumer<Chunk>): void;
   getChunkAtAsync(x: number, z: number, cb: World$ChunkLoadCallback): void;
   getChunkAtAsync(block: Block): CompletableFuture<Chunk>;
   getChunkAtAsync(block: Block, gen: boolean): CompletableFuture<Chunk>;
   getChunkAtAsync(block: Block, gen: boolean, cb: Consumer<Chunk>): void;
   getChunkAtAsync(block: Block, cb: Consumer<Chunk>): void;
   getChunkAtAsync(block: Block, cb: World$ChunkLoadCallback): void;
   getChunkAtAsync(loc: Location): CompletableFuture<Chunk>;
   getChunkAtAsync(loc: Location, gen: boolean): CompletableFuture<Chunk>;
   getChunkAtAsync(loc: Location, gen: boolean, cb: Consumer<Chunk>): void;
   getChunkAtAsync(loc: Location, cb: Consumer<Chunk>): void;
   getChunkAtAsync(loc: Location, cb: World$ChunkLoadCallback): void;
   getChunkAtAsyncUrgently(x: number, z: number): CompletableFuture<Chunk>;
   getChunkAtAsyncUrgently(block: Block): CompletableFuture<Chunk>;
   getChunkAtAsyncUrgently(block: Block, gen: boolean): CompletableFuture<Chunk>;
   getChunkAtAsyncUrgently(loc: Location): CompletableFuture<Chunk>;
   getChunkAtAsyncUrgently(loc: Location, gen: boolean): CompletableFuture<Chunk>;
   getChunkCount(): number;
   getDifficulty(): Difficulty;
   getEmptyChunkSnapshot(x: number, z: number, include_biome: boolean, include_biome_temp: boolean): ChunkSnapshot;
   getEnderDragonBattle(): DragonBattle;
   getEntities(): List<Entity>;
   getEntitiesByClass<T extends Entity>(cls: Class<T>): Collection<T>;
   getEntitiesByClass<T extends Entity>(...classes: Class<T>[]): Collection<T>;
   getEntitiesByClasses<X>(...classes: Class<X>[]): Collection<Entity>;
   getEntity(uuid: UUID): Entity;
   getEntityCount(): number;
   getEnvironment(): World$Environment;
   getForceLoadedChunks(): Collection<Chunk>;
   getFullTime(): number;
   getGameRuleDefault<T>(rule: GameRule<T>): T;
   getGameRules(): string[];
   getGameRuleValue(rule: string): string;
   getGameRuleValue<T>(rule: GameRule<T>): T;
   getGenerator(): ChunkGenerator;
   getHighestBlockAt(x: number, z: number): Block;
   getHighestBlockAt(x: number, z: number, heightmap: HeightmapType): Block;
   getHighestBlockAt(x: number, z: number, height_map: HeightMap): Block;
   getHighestBlockAt(location: Location): Block;
   getHighestBlockAt(location: Location, heightmap: HeightmapType): Block;
   getHighestBlockAt(location: Location, height_map: HeightMap): Block;
   getHighestBlockYAt(x: number, z: number): number;
   getHighestBlockYAt(x: number, z: number, heightmap: HeightmapType): number;
   getHighestBlockYAt(x: number, z: number, height_map: HeightMap): number;
   getHighestBlockYAt(location: Location): number;
   getHighestBlockYAt(location: Location, heightmap: HeightmapType): number;
   getHighestBlockYAt(location: Location, height_map: HeightMap): number;
   getHumidity(x: number, z: number): number;
   getHumidity(x: number, y: number, z: number): number;
   getKeepSpawnInMemory(): boolean;
   getLivingEntities(): List<LivingEntity>;
   getLoadedChunks(): Chunk[];
   getLocationAtKey(key: number): Location;
   getMaxHeight(): number;
   getMonsterSpawnLimit(): number;
   getName(): string;
   getNearbyEntities(location: Location, x: number, y: number, z: number): Collection<Entity>;
   getNearbyEntities(
      location: Location,
      x: number,
      y: number,
      z: number,
      filter: Predicate<Entity>
   ): Collection<Entity>;
   getNearbyEntities(bounding_box: BoundingBox): Collection<Entity>;
   getNearbyEntities(bounding_box: BoundingBox, filter: Predicate<Entity>): Collection<Entity>;
   getNearbyEntitiesByType<T extends Entity>(
      clazz: Class<Entity>,
      loc: Location,
      x_radius: number,
      y_radius: number,
      z_radius: number,
      predicate: Predicate<T>
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity>(clazz: Class<T>, loc: Location, radius: number): Collection<T>;
   getNearbyEntitiesByType<T extends Entity>(
      clazz: Class<T>,
      loc: Location,
      xz_radius: number,
      y_radius: number
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity>(
      clazz: Class<T>,
      loc: Location,
      x_radius: number,
      y_radius: number,
      z_radius: number
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity>(
      clazz: Class<T>,
      loc: Location,
      xz_radius: number,
      y_radius: number,
      predicate: Predicate<T>
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity>(
      clazz: Class<T>,
      loc: Location,
      radius: number,
      predicate: Predicate<T>
   ): Collection<T>;
   getNearbyLivingEntities(loc: Location, radius: number): Collection<LivingEntity>;
   getNearbyLivingEntities(loc: Location, xz_radius: number, y_radius: number): Collection<LivingEntity>;
   getNearbyLivingEntities(
      loc: Location,
      x_radius: number,
      y_radius: number,
      z_radius: number
   ): Collection<LivingEntity>;
   getNearbyLivingEntities(
      loc: Location,
      x_radius: number,
      y_radius: number,
      z_radius: number,
      predicate: Predicate<LivingEntity>
   ): Collection<LivingEntity>;
   getNearbyLivingEntities(
      loc: Location,
      xz_radius: number,
      y_radius: number,
      predicate: Predicate<LivingEntity>
   ): Collection<LivingEntity>;
   getNearbyLivingEntities(loc: Location, radius: number, predicate: Predicate<LivingEntity>): Collection<LivingEntity>;
   getNearbyPlayers(loc: Location, radius: number): Collection<Player>;
   getNearbyPlayers(loc: Location, xz_radius: number, y_radius: number): Collection<Player>;
   getNearbyPlayers(loc: Location, x_radius: number, y_radius: number, z_radius: number): Collection<Player>;
   getNearbyPlayers(
      loc: Location,
      x_radius: number,
      y_radius: number,
      z_radius: number,
      predicate: Predicate<Player>
   ): Collection<Player>;
   getNearbyPlayers(
      loc: Location,
      xz_radius: number,
      y_radius: number,
      predicate: Predicate<Player>
   ): Collection<Player>;
   getNearbyPlayers(loc: Location, radius: number, predicate: Predicate<Player>): Collection<Player>;
   getNoTickViewDistance(): number;
   getPlayerCount(): number;
   getPlayers(): List<Player>;
   getPluginChunkTickets(): Map<Plugin, Collection<Chunk>>;
   getPluginChunkTickets(x: number, z: number): Collection<Plugin>;
   getPopulators(): List<BlockPopulator>;
   getPVP(): boolean;
   getRaids(): List<Raid>;
   getSeaLevel(): number;
   getSeed(): number;
   getSpawnLocation(): Location;
   getTemperature(x: number, z: number): number;
   getTemperature(x: number, y: number, z: number): number;
   getThunderDuration(): number;
   getTickableTileEntityCount(): number;
   getTicksPerAmbientSpawns(): number;
   getTicksPerAnimalSpawns(): number;
   getTicksPerMonsterSpawns(): number;
   getTicksPerWaterAmbientSpawns(): number;
   getTicksPerWaterSpawns(): number;
   getTileEntityCount(): number;
   getTime(): number;
   getUID(): UUID;
   getViewDistance(): number;
   getWaterAmbientSpawnLimit(): number;
   getWaterAnimalSpawnLimit(): number;
   getWeatherDuration(): number;
   getWorldBorder(): WorldBorder;
   getWorldFolder(): File;
   getWorldType(): WorldType;
   hasStorm(): boolean;
   isAutoSave(): boolean;
   isChunkForceLoaded(x: number, z: number): boolean;
   isChunkGenerated(x: number, z: number): boolean;
   isChunkGenerated(chunk_key: number): boolean;
   isChunkInUse(x: number, z: number): boolean;
   isChunkLoaded(x: number, z: number): boolean;
   isChunkLoaded(chunk: Chunk): boolean;
   isDayTime(): boolean;
   isGameRule(rule: string): boolean;
   isHardcore(): boolean;
   isThundering(): boolean;
   loadChunk(x: number, z: number): void;
   loadChunk(x: number, z: number, generate: boolean): boolean;
   loadChunk(chunk: Chunk): void;
   locateNearestRaid(location: Location, radius: number): Raid;
   locateNearestStructure(
      origin: Location,
      structure_type: StructureType,
      radius: number,
      find_unexplored: boolean
   ): Location;
   playEffect(location: Location, effect: Effect, data: number): void;
   playEffect(location: Location, effect: Effect, data: number, radius: number): void;
   playEffect<T>(location: Location, effect: Effect, data: T): void;
   playEffect<T>(location: Location, effect: Effect, data: T, radius: number): void;
   playSound(location: Location, sound: string, volume: number, pitch: number): void;
   playSound(location: Location, sound: string, category: SoundCategory, volume: number, pitch: number): void;
   playSound(location: Location, sound: Sound, volume: number, pitch: number): void;
   playSound(location: Location, sound: Sound, category: SoundCategory, volume: number, pitch: number): void;
   rayTrace(
      start: Location,
      direction: Vector,
      max_distance: number,
      fluid_collision_mode: FluidCollisionMode,
      ignore_passable_blocks: boolean,
      ray_size: number,
      filter: Predicate<Entity>
   ): RayTraceResult;
   rayTraceBlocks(start: Location, direction: Vector, max_distance: number): RayTraceResult;
   rayTraceBlocks(
      start: Location,
      direction: Vector,
      max_distance: number,
      fluid_collision_mode: FluidCollisionMode
   ): RayTraceResult;
   rayTraceBlocks(
      start: Location,
      direction: Vector,
      max_distance: number,
      fluid_collision_mode: FluidCollisionMode,
      ignore_passable_blocks: boolean
   ): RayTraceResult;
   rayTraceEntities(start: Location, direction: Vector, max_distance: number): RayTraceResult;
   rayTraceEntities(start: Location, direction: Vector, max_distance: number, ray_size: number): RayTraceResult;
   rayTraceEntities(
      start: Location,
      direction: Vector,
      max_distance: number,
      ray_size: number,
      filter: Predicate<Entity>
   ): RayTraceResult;
   rayTraceEntities(
      start: Location,
      direction: Vector,
      max_distance: number,
      filter: Predicate<Entity>
   ): RayTraceResult;
   refreshChunk(x: number, z: number): boolean;
   regenerateChunk(x: number, z: number): boolean;
   removePluginChunkTicket(x: number, z: number, plugin: Plugin): boolean;
   removePluginChunkTickets(plugin: Plugin): void;
   save(): void;
   setAmbientSpawnLimit(limit: number): void;
   setAnimalSpawnLimit(limit: number): void;
   setAutoSave(value: boolean): void;
   setBiome(x: number, y: number, z: number, bio: Biome): void;
   setBiome(x: number, z: number, bio: Biome): void;
   setChunkForceLoaded(x: number, z: number, forced: boolean): void;
   setDifficulty(difficulty: Difficulty): void;
   setFullTime(time: number): void;
   setGameRule<T>(rule: GameRule<T>, new_value: T): boolean;
   setGameRuleValue(rule: string, value: string): boolean;
   setHardcore(hardcore: boolean): void;
   setKeepSpawnInMemory(keep_loaded: boolean): void;
   setMonsterSpawnLimit(limit: number): void;
   setNoTickViewDistance(view_distance: number): void;
   setPVP(pvp: boolean): void;
   setSpawnFlags(allow_monsters: boolean, allow_animals: boolean): void;
   setSpawnLocation(x: number, y: number, z: number): boolean;
   setSpawnLocation(location: Location): boolean;
   setStorm(has_storm: boolean): void;
   setThunderDuration(duration: number): void;
   setThundering(thundering: boolean): void;
   setTicksPerAmbientSpawns(ticks_per_ambient_spawns: number): void;
   setTicksPerAnimalSpawns(ticks_per_animal_spawns: number): void;
   setTicksPerMonsterSpawns(ticks_per_monster_spawns: number): void;
   setTicksPerWaterAmbientSpawns(ticks_per_ambient_spawns: number): void;
   setTicksPerWaterSpawns(ticks_per_water_spawns: number): void;
   setTime(time: number): void;
   setViewDistance(view_distance: number): void;
   setWaterAmbientSpawnLimit(limit: number): void;
   setWaterAnimalSpawnLimit(limit: number): void;
   setWeatherDuration(duration: number): void;
   spawn<T extends Entity>(location: Location, clazz: Class<T>): T;
   spawn<T extends Entity>(location: Location, clazz: Class<T>, reason: CreatureSpawnEvent$SpawnReason): T;
   spawn<T extends Entity>(
      location: Location,
      clazz: Class<T>,
      reason: CreatureSpawnEvent$SpawnReason,
      funktion: Consumer<T>
   ): T;
   spawn<T extends Entity>(location: Location, clazz: Class<T>, funktion: Consumer<T>): T;
   spawn<T extends Entity>(
      location: Location,
      clazz: Class<T>,
      funktion: Consumer<T>,
      reason: CreatureSpawnEvent$SpawnReason
   ): T;
   spawnArrow(location: Location, direction: Vector, speed: number, spread: number): Arrow;
   spawnArrow<T extends AbstractArrow>(
      location: Location,
      direction: Vector,
      speed: number,
      spread: number,
      clazz: Class<T>
   ): T;
   spawnEntity(loc: Location, type: EntityType): Entity;
   spawnEntity(loc: Location, type: EntityType, reason: CreatureSpawnEvent$SpawnReason): Entity;
   spawnEntity(
      loc: Location,
      type: EntityType,
      reason: CreatureSpawnEvent$SpawnReason,
      funktion: Consumer<Entity>
   ): Entity;
   spawnFallingBlock(location: Location, data: BlockData): FallingBlock;
   spawnFallingBlock(location: Location, data: MaterialData): FallingBlock;
   spawnFallingBlock(location: Location, material: Material, data: number): FallingBlock;
   spawnParticle(particle: Particle, x: number, y: number, z: number, count: number): void;
   spawnParticle(
      particle: Particle,
      x: number,
      y: number,
      z: number,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number
   ): void;
   spawnParticle(
      particle: Particle,
      x: number,
      y: number,
      z: number,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      extra: number
   ): void;
   spawnParticle<T>(
      particle: Particle,
      x: number,
      y: number,
      z: number,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      extra: number,
      data: T
   ): void;
   spawnParticle<T>(
      particle: Particle,
      x: number,
      y: number,
      z: number,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      extra: number,
      data: T,
      force: boolean
   ): void;
   spawnParticle<T>(
      particle: Particle,
      x: number,
      y: number,
      z: number,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      data: T
   ): void;
   spawnParticle<T>(particle: Particle, x: number, y: number, z: number, count: number, data: T): void;
   spawnParticle<T>(
      particle: Particle,
      receivers: List<Player>,
      source: Player,
      x: number,
      y: number,
      z: number,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      extra: number,
      data: T
   ): void;
   spawnParticle<T>(
      particle: Particle,
      receivers: List<Player>,
      source: Player,
      x: number,
      y: number,
      z: number,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      extra: number,
      data: T,
      force: boolean
   ): void;
   spawnParticle(particle: Particle, location: Location, count: number): void;
   spawnParticle(
      particle: Particle,
      location: Location,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number
   ): void;
   spawnParticle(
      particle: Particle,
      location: Location,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      extra: number
   ): void;
   spawnParticle<T>(
      particle: Particle,
      location: Location,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      extra: number,
      data: T
   ): void;
   spawnParticle<T>(
      particle: Particle,
      location: Location,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      extra: number,
      data: T,
      force: boolean
   ): void;
   spawnParticle<T>(
      particle: Particle,
      location: Location,
      count: number,
      offset_x: number,
      offset_y: number,
      offset_z: number,
      data: T
   ): void;
   spawnParticle<T>(particle: Particle, location: Location, count: number, data: T): void;
   spigot(): World$Spigot;
   strikeLightning(loc: Location): LightningStrike;
   strikeLightningEffect(loc: Location): LightningStrike;
   unloadChunk(x: number, z: number): boolean;
   unloadChunk(x: number, z: number, save: boolean): boolean;
   unloadChunk(chunk: Chunk): boolean;
   unloadChunkRequest(x: number, z: number): boolean;
}

export interface Server extends PluginMessageRecipient {
   addRecipe(recipe: Recipe): boolean;
   advancementIterator(): Iterator<Advancement>;
   banIP(address: string): void;
   broadcast(message: string, permission: string): number;
   broadcast(component: BaseComponent): void;
   broadcast(...components: BaseComponent[]): void;
   broadcastMessage(message: string): number;
   clearRecipes(): void;
   createBlockData(data: string): BlockData;
   createBlockData(material: Material): BlockData;
   createBlockData(material: Material, data: string): BlockData;
   createBlockData(material: Material, consumer: Consumer<BlockData>): BlockData;
   createBossBar(title: string, color: BarColor, style: BarStyle, ...flags: BarFlag[]): BossBar;
   createBossBar(
      key: NamespacedKey,
      title: string,
      color: BarColor,
      style: BarStyle,
      ...flags: BarFlag[]
   ): KeyedBossBar;
   createChunkData(world: World): ChunkGenerator$ChunkData;
   createExplorerMap(world: World, location: Location, structure_type: StructureType): ItemStack;
   createExplorerMap(
      world: World,
      location: Location,
      structure_type: StructureType,
      radius: number,
      find_unexplored: boolean
   ): ItemStack;
   createInventory(owner: InventoryHolder, size: number): Inventory;
   createInventory(owner: InventoryHolder, size: number, title: string): Inventory;
   createInventory(owner: InventoryHolder, type: InventoryType): Inventory;
   createInventory(owner: InventoryHolder, type: InventoryType, title: string): Inventory;
   createMap(world: World): MapView;
   createMerchant(title: string): Merchant;
   createProfile(name: string): PlayerProfile;
   createProfile(uuid: UUID): PlayerProfile;
   createProfile(uuid: UUID, name: string): PlayerProfile;
   createVanillaChunkData(world: World, x: number, z: number): ChunkGenerator$ChunkData;
   createWorld(creator: WorldCreator): World;
   dispatchCommand(sender: CommandSender, command_line: string): boolean;
   getAdvancement(key: NamespacedKey): Advancement;
   getAllowEnd(): boolean;
   getAllowFlight(): boolean;
   getAllowNether(): boolean;
   getAmbientSpawnLimit(): number;
   getAnimalSpawnLimit(): number;
   getAverageTickTime(): number;
   getBanList(type: BanList$Type): BanList;
   getBannedPlayers(): Set<OfflinePlayer>;
   getBossBar(key: NamespacedKey): KeyedBossBar;
   getBossBars(): Iterator<KeyedBossBar>;
   getBukkitVersion(): string;
   getCommandAliases(): Map<string, string[]>;
   getCommandMap(): CommandMap;
   getConnectionThrottle(): number;
   getConsoleSender(): ConsoleCommandSender;
   getCurrentTick(): number;
   getDefaultGameMode(): GameMode;
   getEntity(uuid: UUID): Entity;
   getGenerateStructures(): boolean;
   getHelpMap(): HelpMap;
   getIdleTimeout(): number;
   getIp(): string;
   getIPBans(): Set<string>;
   getItemFactory(): ItemFactory;
   getLogger(): Logger;
   getLootTable(key: NamespacedKey): LootTable;
   getMap(id: number): MapView;
   getMaxPlayers(): number;
   getMessenger(): Messenger;
   getMinecraftVersion(): string;
   getMobGoals(): MobGoals;
   getMonsterSpawnLimit(): number;
   getMotd(): string;
   getName(): string;
   getOfflinePlayer(name: string): OfflinePlayer;
   getOfflinePlayer(id: UUID): OfflinePlayer;
   getOfflinePlayers(): OfflinePlayer[];
   getOnlineMode(): boolean;
   getOnlinePlayers(): Collection<Player>;
   getOperators(): Set<OfflinePlayer>;
   getPermissionMessage(): string;
   getPlayer(name: string): Player;
   getPlayer(id: UUID): Player;
   getPlayerExact(name: string): Player;
   getPlayerUniqueId(player_name: string): UUID;
   getPluginCommand(name: string): PluginCommand;
   getPluginManager(): PluginManager;
   getPort(): number;
   getRecipesFor(result: ItemStack): List<Recipe>;
   getScheduler(): BukkitScheduler;
   getScoreboardManager(): ScoreboardManager;
   getServerIcon(): CachedServerIcon;
   getServicesManager(): ServicesManager;
   getShutdownMessage(): string;
   getSpawnRadius(): number;
   getTag<T extends Keyed>(registry: string, tag: NamespacedKey, clazz: Class<T>): Tag<T>;
   getTags<T extends Keyed>(registry: string, clazz: Class<T>): Iterable<Tag<T>>;
   getTicksPerAmbientSpawns(): number;
   getTicksPerAnimalSpawns(): number;
   getTicksPerMonsterSpawns(): number;
   getTicksPerWaterAmbientSpawns(): number;
   getTicksPerWaterSpawns(): number;
   getTickTimes(): number[];
   getTPS(): number[];
   getUnsafe(): UnsafeValues;
   getUpdateFolder(): string;
   getUpdateFolderFile(): File;
   getVersion(): string;
   getViewDistance(): number;
   getWarningState(): Warning$WarningState;
   getWaterAmbientSpawnLimit(): number;
   getWaterAnimalSpawnLimit(): number;
   getWhitelistedPlayers(): Set<OfflinePlayer>;
   getWorld(name: string): World;
   getWorld(uid: UUID): World;
   getWorldContainer(): File;
   getWorlds(): List<World>;
   getWorldType(): string;
   hasWhitelist(): boolean;
   isHardcore(): boolean;
   isPrimaryThread(): boolean;
   isStopping(): boolean;
   loadServerIcon(image: BufferedImage): CachedServerIcon;
   loadServerIcon(file: File): CachedServerIcon;
   matchPlayer(name: string): List<Player>;
   recipeIterator(): Iterator<Recipe>;
   reload(): void;
   reloadCommandAliases(): boolean;
   reloadData(): void;
   reloadPermissions(): void;
   reloadWhitelist(): void;
   removeBossBar(key: NamespacedKey): boolean;
   removeRecipe(key: NamespacedKey): boolean;
   resetRecipes(): void;
   savePlayers(): void;
   selectEntities(sender: CommandSender, selector: string): List<Entity>;
   setDefaultGameMode(mode: GameMode): void;
   setIdleTimeout(threshold: number): void;
   setSpawnRadius(value: number): void;
   setWhitelist(value: boolean): void;
   shutdown(): void;
   spigot(): Server$Spigot;
   suggestPlayerNamesWhenNullTabCompletions(): boolean;
   unbanIP(address: string): void;
   unloadWorld(name: string, save: boolean): boolean;
   unloadWorld(world: World, save: boolean): boolean;
}

export class Block extends Metadatable {
   breakNaturally (): boolean;
   breakNaturally (tool: ItemStack): boolean;
   breakNaturally (tool: ItemStack, trigger_effect: boolean): boolean;
   getBiome (): Biome;
   getBlockData (): BlockData;
   getBlockKey (): number;
   static getBlockKey (x: number, y: number, z: number): number;
   static getBlockKeyX (packed: number): number;
   static getBlockKeyY (packed: number): number;
   static getBlockKeyZ (packed: number): number;
   getBlockPower (): number;
   getBlockPower (face: BlockFace): number;
   getBoundingBox (): BoundingBox;
   getChunk (): Chunk;
   getData (): number;
   getDrops (): Collection<ItemStack>;
   getDrops (tool: ItemStack): Collection<ItemStack>;
   getDrops (tool: ItemStack, entity: Entity): Collection<ItemStack>;
   getFace (block: Block): BlockFace;
   getHumidity (): number;
   getLightFromBlocks (): number;
   getLightFromSky (): number;
   getLightLevel (): number;
   getLocation (): Location;
   getLocation (loc: Location): Location;
   getPistonMoveReaction (): PistonMoveReaction;
   getRelative (mod_x: number, mod_y: number, mod_z: number): Block;
   getRelative (face: BlockFace): Block;
   getRelative (face: BlockFace, distance: number): Block;
   getSoundGroup (): BlockSoundGroup;
   getState (): BlockState;
   getState (use_snapshot: boolean): BlockState;
   getTemperature (): number;
   getType (): Material;
   getWorld (): World;
   getX (): number;
   getY (): number;
   getZ (): number;
   isBlockFaceIndirectlyPowered (face: BlockFace): boolean;
   isBlockFacePowered (face: BlockFace): boolean;
   isBlockIndirectlyPowered (): boolean;
   isBlockPowered (): boolean;
   isEmpty (): boolean;
   isLiquid (): boolean;
   isPassable (): boolean;
   rayTrace (
      start: Location,
      direction: Vector,
      max_distance: number,
      fluid_collision_mode: FluidCollisionMode
   ): RayTraceResult;
   setBiome (bio: Biome): void;
   setBlockData (data: BlockData): void;
   setBlockData (data: BlockData, apply_physics: boolean): void;
   setType (type: Material): void;
   setType (type: Material, apply_physics: boolean): void;
}
export interface Entity extends Metadatable, CommandSender, Nameable, PersistentDataHolder {
   addPassenger(passenger: Entity): boolean;
   addScoreboardTag(tag: string): boolean;
   eject(): boolean;
   fromMobSpawner(): boolean;
   getBoundingBox(): BoundingBox;
   getChunk(): Chunk;
   getEntityId(): number;
   getEntitySpawnReason(): CreatureSpawnEvent$SpawnReason;
   getFacing(): BlockFace;
   getFallDistance(): number;
   getFireTicks(): number;
   getHeight(): number;
   getLastDamageCause(): EntityDamageEvent;
   getLocation(): Location;
   getLocation(loc: Location): Location;
   getMaxFireTicks(): number;
   getNearbyEntities(x: number, y: number, z: number): List<Entity>;
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
   isInBubbleColumn(): boolean;
   isInLava(): boolean;
   isInRain(): boolean;
   isInsideVehicle(): boolean;
   isInvulnerable(): boolean;
   isInWater(): boolean;
   isInWaterOrBubbleColumn(): boolean;
   isInWaterOrRain(): boolean;
   isInWaterOrRainOrBubbleColumn(): boolean;
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
   setFallDistance(distance: number): void;
   setFireTicks(ticks: number): void;
   setGlowing(flag: boolean): void;
   setGravity(gravity: boolean): void;
   setInvulnerable(flag: boolean): void;
   setLastDamageCause(event: EntityDamageEvent): void;
   setPassenger(passenger: Entity): boolean;
   setPersistent(persistent: boolean): void;
   setPortalCooldown(cooldown: number): void;
   setRotation(yaw: number, pitch: number): void;
   setSilent(flag: boolean): void;
   setTicksLived(value: number): void;
   setVelocity(velocity: Vector): void;
   spigot(): Entity$Spigot;
   teleport(destination: Entity): boolean;
   teleport(destination: Entity, cause: PlayerTeleportEvent$TeleportCause): boolean;
   teleport(location: Location): boolean;
   teleport(location: Location, cause: PlayerTeleportEvent$TeleportCause): boolean;
   teleportAsync(loc: Location): CompletableFuture<Boolean>;
   teleportAsync(loc: Location, cause: PlayerTeleportEvent$TeleportCause): CompletableFuture<Boolean>;
}
export class ItemStack extends Object implements Cloneable, ConfigurationSerializable {
   constructor ();
   constructor (stack: ItemStack);
   constructor (type: Material);
   constructor (type: Material, amount: number);
   constructor (type: Material, amount: number, damage: number);
   constructor (type: Material, amount: number, damage: number, data: Byte);
   add (): ItemStack;
   add (qty: number): ItemStack;
   addEnchantment (ench: Enchantment, level: number): void;
   addEnchantments (enchantments: Map<Enchantment, Integer>): void;
   addItemFlags (...item_flags: ItemFlag[]): void;
   addUnsafeEnchantment (ench: Enchantment, level: number): void;
   addUnsafeEnchantments (enchantments: Map<Enchantment, Integer>): void;
   asOne (): ItemStack;
   asQuantity (qty: number): ItemStack;
   clone (): ItemStack;
   containsEnchantment (ench: Enchantment): boolean;
   static deserialize (args: Map<string, JavaObject>): ItemStack;
   static deserializeBytes (bytes: number[]): ItemStack;
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
   removeItemFlags (...item_flags: ItemFlag[]): void;
   serialize (): Map<string, JavaObject>;
   serializeAsBytes (): number[];
   setAmount (amount: number): void;
   setData (data: MaterialData): void;
   setDurability (durability: number): void;
   setItemMeta (item_meta: ItemMeta): boolean;
   setLore (lore: List<string>): void;
   setType (type: Material): void;
   subtract (): ItemStack;
   subtract (qty: number): ItemStack;
   tostring (): string;
}
export class Location extends Object implements Cloneable, ConfigurationSerializable {
   constructor (world: World, x: number, y: number, z: number);
   constructor (world: World, x: number, y: number, z: number, yaw: number, pitch: number);
   add (x: number, y: number, z: number): Location;
   add (vec: Location): Location;
   add (base: Location, x: number, y: number, z: number): Location;
   add (vec: Vector): Location;
   checkFinite (): void;
   clone (): Location;
   createExplosion (power: number): boolean;
   createExplosion (power: number, set_fire: boolean): boolean;
   createExplosion (power: number, set_fire: boolean, break_blocks: boolean): boolean;
   createExplosion (source: Entity, power: number): boolean;
   createExplosion (source: Entity, power: number, set_fire: boolean): boolean;
   createExplosion (source: Entity, power: number, set_fire: boolean, break_blocks: boolean): boolean;
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
   getNearbyEntities (x: number, y: number, z: number): Collection<Entity>;
   getNearbyEntitiesByType<T extends Entity> (
      clazz: Class<Entity>,
      x_radius: number,
      y_radius: number,
      z_radius: number,
      predicate: Predicate<T>
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (clazz: Class<T>, radius: number): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (clazz: Class<T>, xz_radius: number, y_radius: number): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (
      clazz: Class<T>,
      x_radius: number,
      y_radius: number,
      z_radius: number
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (
      clazz: Class<T>,
      xz_radius: number,
      y_radius: number,
      predicate: Predicate<T>
   ): Collection<T>;
   getNearbyEntitiesByType<T extends Entity> (clazz: Class<T>, radius: number, predicate: Predicate<T>): Collection<T>;
   getNearbyLivingEntities (radius: number): Collection<LivingEntity>;
   getNearbyLivingEntities (xz_radius: number, y_radius: number): Collection<LivingEntity>;
   getNearbyLivingEntities (x_radius: number, y_radius: number, z_radius: number): Collection<LivingEntity>;
   getNearbyLivingEntities (
      x_radius: number,
      y_radius: number,
      z_radius: number,
      predicate: Predicate<LivingEntity>
   ): Collection<LivingEntity>;
   getNearbyLivingEntities (
      xz_radius: number,
      y_radius: number,
      predicate: Predicate<LivingEntity>
   ): Collection<LivingEntity>;
   getNearbyLivingEntities (radius: number, predicate: Predicate<LivingEntity>): Collection<LivingEntity>;
   getNearbyPlayers (radius: number): Collection<Player>;
   getNearbyPlayers (xz_radius: number, y_radius: number): Collection<Player>;
   getNearbyPlayers (x_radius: number, y_radius: number, z_radius: number): Collection<Player>;
   getNearbyPlayers (
      x_radius: number,
      y_radius: number,
      z_radius: number,
      predicate: Predicate<Player>
   ): Collection<Player>;
   getNearbyPlayers (xz_radius: number, y_radius: number, predicate: Predicate<Player>): Collection<Player>;
   getNearbyPlayers (radius: number, predicate: Predicate<Player>): Collection<Player>;
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
   static locToBlock (loc: number): number;
   multiply (m: number): Location;
   static normalizePitch (pitch: number): number;
   static normalizeYaw (yaw: number): number;
   serialize (): Map<string, JavaObject>;
   set (x: number, y: number, z: number): Location;
   setDirection (vector: Vector): Location;
   setPitch (pitch: number): void;
   setWorld (world: World): void;
   setX (x: number): void;
   setY (y: number): void;
   setYaw (yaw: number): void;
   setZ (z: number): void;
   subtract (x: number, y: number, z: number): Location;
   subtract (vec: Location): Location;
   subtract (base: Location, x: number, y: number, z: number): Location;
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
   isInSphere (origin: Vector, radius: number): boolean;
   isNormalized (): boolean;
   length (): number;
   lengthSquared (): number;
   midpoint (other: Vector): Vector;
   multiply (m: number): Vector;
   multiply (m: number): Vector;
   multiply (m: number): Vector;
   multiply (vec: Vector): Vector;
   normalize (): Vector;
   rotateAroundAxis (axis: Vector, angle: number): Vector;
   rotateAroundNonUnitAxis (axis: Vector, angle: number): Vector;
   rotateAroundX (angle: number): Vector;
   rotateAroundY (angle: number): Vector;
   rotateAroundZ (angle: number): Vector;
   serialize (): Map<string, JavaObject>;
   setX (x: number): Vector;
   setX (x: number): Vector;
   setX (x: number): Vector;
   setY (y: number): Vector;
   setY (y: number): Vector;
   setY (y: number): Vector;
   setZ (z: number): Vector;
   setZ (z: number): Vector;
   setZ (z: number): Vector;
   subtract (vec: Vector): Vector;
   toBlockVector (): BlockVector;
   toLocation (world: World): Location;
   toLocation (world: World, yaw: number, pitch: number): Location;
   tostring (): string;
   zero (): Vector;
}
