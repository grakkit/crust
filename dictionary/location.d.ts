import { DistanceTarget, DistanceTargetNest, VectorChainer, VectorChainerNest } from './vector';
import { EntityType, Location, World, Vector, ItemStack } from './bukkit';
import { EntityChainer, EntityChainerNest } from './entity';
import { ItemChainer, ItemChainerNest } from './item';
import { BlockChainer, BlockChainerNest } from './block';

/*
 * ## Serialized Bukkit Location
 * A serialized instance of `org.bukkit.Location`
 */
interface LocationSerialized {
   format: 'location';
   pitch: number;
   world: string;
   x: number;
   y: number;
   yaw: number;
   z: number;
}

/**
 * ## Location Chainer
 * A set of utility methods which access `org.bukkit.Location` objects.
 * 
 * `LocationChainer.block()`
 * 
 * `LocationChainer.distance(target, flat?)`
 * 
 * `LocationChainer.distance(targets, flat?)`
 * 
 * `LocationChainer.drop(item, naturally?)`
 * 
 * `LocationChainer.instance()`
 * 
 * `LocationChainer.pitch()`
 * 
 * `LocationChainer.pitch(value)`
 * 
 * `LocationChainer.serialize()`
 * 
 * `LocationChainer.spawn(lifeform)`
 * 
 * `LocationChainer.vector()`
 * 
 * `LocationChainer.vector(value)`
 * 
 * `LocationChainer.world()`
 * 
 * `LocationChainer.world(value)`
 * 
 * `LocationChainer.x()`
 * 
 * `LocationChainer.x(value)`
 * 
 * `LocationChainer.y()`
 * 
 * `LocationChainer.y(value)`
 * 
 * `LocationChainer.yaw()`
 * 
 * `LocationChainer.yaw(value)`
 * 
 * `LocationChainer.z()`
 *
 * `LocationChainer.z(value)`
 */
export interface LocationChainer {
   /**
    * ### `LocationChainer.block()`
    * Returns the block at this location.
    */
   block(): BlockChainer;
   /**
    * ### `LocationChainer.block(material)`
    * Sets the block at this location.
    * @param material The block type to set
    */
   block(material: string): LocationChainer;
   /**
    * ### `LocationChainer.distance(target, flat?)`
    * Calculates the distance between this vector and another vector, location, or an object with a vector or location attached.
    * @param target The target to calculate against
    * @param flat Ignore the y-axis in the calculation
    */
   distance(target: DistanceTarget, flat?: boolean): number;
   /**
    * ### `LocationChainer.distance(targets, flat?)`
    * Calculates the distances between this vector and other vectors, locations, or an array of objects with a vector or location attached.
    * @param targets The targets to calculate against
    * @param flat Ignore the y-axis in the calculations
    */
   distance(targets: DistanceTargetNest, flat?: boolean): number[];
   /**
    * Drops an item at this location.
    * ### `LocationChainer.drop(item, naturally)`
    * @param item The item to drop
    * @param naturally Add randomized initial velocity to the drop
    */
   drop(item: ItemStack | ItemChainer, naturally?: boolean): ItemChainer;
   /**
    * Drops a set of items at this location.
    * ### `LocationChainer.drop(item, naturally)`
    * @param items The items to drop
    * @param naturally Add randomized initial velocity to each drop
    */
   drop(item: ItemStack[] | ItemChainerNest, naturally?: boolean): ItemChainerNest;
   /**
    * ### `LocationChainer.instance()`
    * Returns this location chainer's server instance.
    */
   instance(): LocationChainer;
   /**
    * ### `LocationChainer.pitch()`
    * Returns the current pitch value of the location.
    */
   pitch(): number;
   /**
    * ### `LocationChainer.pitch(value)`
    * Sets the pitch value of this location to the given input.
    * @param value The pitch value to set
    */
   pitch(value: number): LocationChainer;
   /**
    * ### `LocationChainer.serialize()`
    * Returns a JSON-serializable object representation of this location chainer's instance.
    */
   serialize(): LocationSerialized;
   /**
    * Spawns an entity at this location.
    * ### `LocationChainer.spawn(lifeform)`
    * @param lifeform The entity type to spawn
    */
   spawn(lifeform: string | EntityType): EntityChainer;
   /**
    * Spawns a set of entities at this location.
    * ### `LocationChainer.spawn(lifeforms)`
    * @param lifeforms The entity types to spawn
    */
   spawn(lifeforms: string[] | EntityType[]): EntityChainerNest;
   /**
    * ### `LocationChainer.vector()`
    * Returns the equivalent vector from this location.
    */
   vector(): VectorChainer;
   /**
    * ### `LocationChainer.world()`
    * Returns the current world of the location.
    */
   world(): LocationChainer;
   /**
    * ### `LocationChainer.world(value)`
    * Sets the world value of this location to the world represented by the given input.
    * @param world The world value to set
    */
   world(world: string | UUID | World): LocationChainer;
   /**
    * ### `LocationChainer.x()`
    * Returns the current X value of the location.
    */
   x(): number;
   /**
    * ### `LocationChainer.x(value)`
    * Sets the X value of this location to the given input.
    * @param value The X value to set
    */
   x(value: number): LocationChainer;
   /**
    * ### `LocationChainer.y()`
    * Returns the current Y value of the location.
    */
   y(): number;
   /**
    * ### `LocationChainer.y(value)`
    * Sets the Y value of this location to the given input.
    * @param value The Y value to set
    */
   y(value: number): LocationChainer;
   /**
    * ### `LocationChainer.yaw()`
    * Returns the current yaw value of the location.
    */
   yaw(): number;
   /**
    * ### `LocationChainer.yaw(value)`
    * Sets the yaw value of this location to the given input.
    * @param value The yaw value to set
    */
   yaw(value: number): LocationChainer;
   /**
    * ### `LocationChainer.z()`
    * Returns the current Z value of the location.
    */
   z(): number;
   /**
    * ### `LocationChainer.z(value)`
    * Sets the Z value of this location to the given input.
    * @param value The Z value to set
    */
   z(value: number): LocationChainer;
}

/**
 * ## Location Chainer Nest
 * A set of utility methods which access `org.bukkit.Location` objects.
 * 
 * `LocationChainerNest.block()`
 * 
 * `LocationChainerNest.distance(target, flat?)`
 * 
 * `LocationChainerNest.distance(targets, flat?)`
 * 
 * `LocationChainerNest.drop(item, naturally?)`
 * 
 * `LocationChainerNest.instance()`
 * 
 * `LocationChainerNest.pitch()`
 * 
 * `LocationChainerNest.pitch(value)`
 * 
 * `LocationChainerNest.serialize()`
 * 
 * `LocationChainerNest.spawn(lifeform)`
 * 
 * `LocationChainerNest.vector()`
 * 
 * `LocationChainerNest.vector(value)`
 * 
 * `LocationChainerNest.world()`
 * 
 * `LocationChainerNest.world(value)`
 * 
 * `LocationChainerNest.x()`
 * 
 * `LocationChainerNest.x(value)`
 * 
 * `LocationChainerNest.y()`
 * 
 * `LocationChainerNest.y(value)`
 * 
 * `LocationChainerNest.yaw()`
 * 
 * `LocationChainerNest.yaw(value)`
 * 
 * `LocationChainerNest.z()`
 *
 * `LocationChainerNest.z(value)`
 */
export interface LocationChainerNest {
   /**
    * ### `LocationChainerNest.block()`
    * Returns a nest with the blocks at each location in this chainer nest.
    */
   block(): BlockChainerNest;
   /**
    * ### `LocationChainerNest.block(material)`
    * Sets the block at each location in the nest to a given type.
    * @param material The block type to set
    */
   block(material: string): LocationChainerNest;
   /**
    * ### `LocationChainerNest.distance(target, flat?)`
    * For each vector in this nest, calculates the distance between it and another vector, location, or an object with a vector or location attached.
    * @param target The target to calculate against
    * @param flat Ignore the y-axis in the calculation
    */
   distance(target: DistanceTarget, flat?: boolean): number[];
   /**
    * ### `LocationChainerNest.distance(targets, flat?)`
    * For each vector in this nest, calculates the distances between it and other vectors, locations, or an array of objects with a vector or location attached.
    * @param targets The targets to calculate against
    * @param flat Ignore the y-axis in the calculations
    */
   distance(targets: DistanceTargetNest, flat?: boolean): number[][];
   /**
    * Drops a given item at each location in this nest and returns a nest with each item dropped.
    * ### `LocationChainerNest.drop(item, naturally)`
    * @param item The item to drop
    * @param naturally Add randomized initial velocity to each drop
    */
   drop(item: ItemStack | ItemChainer, naturally?: boolean): ItemChainerNest;
   /**
    * Drops a set of items at each location in this nest, and returns an array of nests, one for each source location, each containing the items dropped at said location.
    * ### `LocationChainerNest.drop(item, naturally)`
    * @param items The items to drop
    * @param naturally Add randomized initial velocity to each drop
    */
   drop(item: ItemStack[] | ItemChainerNest, naturally?: boolean): ItemChainerNest[];
   /**
    * ### `LocationChainerNest.instance()`
    * Returns the server instance for each location in the nest.
    */
   instance(): Location[];
   /**
    * ### `LocationChainerNest.pitch()`
    * Returns the current pitch value of each location.
    */
   pitch(): number[];
   /**
    * ### `LocationChainerNest.pitch(value)`
    * Sets the pitch value of each location to the given input.
    * @param value The pitch value to set
    */
   pitch(value: number): LocationChainerNest;
   /**
    * ### `LocationChainerNest.serialize()`
    * Returns JSON-serializable object representations for each instance in this chainer nest.
    */
   serialize(): LocationSerialized[];
   /**
    * Spawns an entity at each location in the nest, and returns a chainer nest with each spawned entity.
    * ### `LocationChainerNest.spawn(lifeform)`
    * @param lifeform The entity type to spawn
    */
   spawn(lifeform: string | EntityType): EntityChainerNest;
   /**
    * Spawns a set of entities at each location in the nest, and returns an array of nests, one for each source location, each containing the entities spawned at said location.
    * ### `LocationChainerNest.spawn(lifeforms)`
    * @param lifeforms The entity types to spawn
    */
   spawn(lifeforms: string[] | EntityType[]): EntityChainerNest[];
   /**
    * ### `LocationChainerNest.vector()`
    * Returns a vector chainer nest with the equivalent vectors from each location in this chainer nest.
    */
   vector(): VectorChainerNest;
   /**
    * ### `LocationChainerNest.vector()`
    * Returns a vector chainer nest with the equivalent vectors from each location in this chainer nest.
    */
   vector(value: Vector | VectorChainer): VectorChainerNest;
   /**
    * ### `LocationChainerNest.world()`
    * Returns the current world of the location.
    */
   world(): World;
   /**
    * ### `LocationChainerNest.world(value)`
    * Sets the world value of this location to the world represented by the given input.
    * @param world The world value to set
    */
   world(world: string | UUID | World): LocationChainerNest;
   /**
    * ### `LocationChainerNest.x()`
    * Returns the current X value of the location.
    */
   x(): number[];
   /**
    * ### `LocationChainerNest.x(value)`
    * Sets the X value of this location to the given input.
    * @param value The X value to set
    */
   x(value: number): LocationChainerNest;
   /**
    * ### `LocationChainerNest.y()`
    * Returns the current Y value of each location in the nest.
    */
   y(): number[];
   /**
    * ### `LocationChainerNest.y(value)`
    * Sets the Y value of each location in the nest to the given input.
    * @param value The Y value to set
    */
   y(value: number): LocationChainerNest;
   /**
    * ### `LocationChainerNest.yaw()`
    * Returns the current yaw value of each location in the nest.
    */
   yaw(): number[];
   /**
    * ### `LocationChainerNest.yaw(value)`
    * Sets the yaw value of each location in the nest to the given input.
    * @param value The yaw value to set
    */
   yaw(value: number): LocationChainerNest;
   /**
    * ### `LocationChainerNest.z()`
    * Returns the current Z value of each location in the nest.
    */
   z(): number[];
   /**
    * ### `LocationChainerNest.z(value)`
    * Sets the Z value of each location in the nest to the given input.
    * @param value The Z value to set
    */
   z(value: number): LocationChainerNest;
}
