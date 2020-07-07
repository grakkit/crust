import { BlockChainer, BlockChainerNest } from './block';
import { Block, Entity, Location, Vector, World, UUID } from './bukkit';
import { EntityChainer, EntityChainerNest } from './entity';
import { LocationChainer, LocationChainerNest } from './location';

/*
 * ## Serialized Bukkit Vector
 * A serialized instance of `org.bukkit.util.Vector`
 */
interface VectorSerialized {
   format: 'vector';
   x: number;
   y: number;
   z: number;
}

/*
 * ## Distance Target
 * A catch-all for valid values which can be passed into Chainer.distance() calls.
 */
export type DistanceTarget =
   | Vector
   | VectorChainer
   | Location
   | LocationChainer
   | Entity
   | EntityChainer
   | Block
   | BlockChainer;

/*
 * ## Distance Target Nest
 * A catch-all for valid values which can be passed into ChainerNest.distance() calls.
 */
export type DistanceTargetNest =
   | Vector[]
   | VectorChainerNest
   | Location[]
   | LocationChainerNest
   | Entity[]
   | EntityChainerNest
   | Block[]
   | BlockChainerNest;

/**
 * ## Vector Chainer
 * A set of utility methods which access `org.bukkit.util.Vector` objects.
 * 
 * `VectorChainer.add(x, y, z, source?)`
 * 
 * `VectorChainer.distance(target, flat?)`
 * 
 * `VectorChainer.distance(targets, flat?)`
 * 
 * `VectorChainer.location(world, pitch?, yaw?)`
 * 
 * `VectorChainer.serialize()`
 * 
 * `VectorChainer.x()`
 * 
 * `VectorChainer.x(value)`
 * 
 * `VectorChainer.y()`
 * 
 * `VectorChainer.y(value)`
 * 
 * `VectorChainer.z()`
 *
 * `VectorChainer.z(value)`
 */
export interface VectorChainer {
   /**
    * ### `VectorChainer.add(x, y, z, source?)`
    * Adds velocity to this vector.
    * @param x Amount of X velocity to add
    * @param y Amount of Y velocity to add
    * @param z Amount of Z velocity to add
    * @param source Rotate the vector around a location's pitch and yaw before adding velocity
    */
   add(x: number, y: number, z: number, source?: Location): VectorChainer;
   /**
    * ### `VectorChainer.distance(target, flat?)`
    * Calculates the distance between this vector and another vector, location, or an object with a vector or location attached.
    * @param target The target to calculate against
    * @param flat Ignore the y-axis in the calculation
    */
   distance(target: DistanceTarget, flat?: boolean): number;
   /**
    * ### `VectorChainer.distance(targets, flat?)`
    * Calculates the distances between this vector and other vectors, locations, or an array of objects with a vector or location attached.
    * @param targets The targets to calculate against
    * @param flat Ignore the y-axis in the calculations
    */
   distance(targets: DistanceTargetNest, flat?: boolean): number[];
   /**
    * ### `VectorChainer.instance()`
    * Returns this vector chainer's server instance.
    */
   instance(): Vector;
   /**
    * ### `VectorChainer.location(world, pitch?, yaw?)`
    * Returns the equivalent location from this vector, given a world.
    * @param world The world the location should exist within
    * @param pitch The pitch to add
    * @param yaw The yaw to add
    */
   location(world: string | UUID | World, pitch?: number, yaw?: number): LocationChainer;
   /**
    * ### `VectorChainer.serialize()`
    * Returns a JSON-serializable object representation of this vector chainer's instance.
    */
   serialize(): VectorSerialized;
   /**
    * ### `VectorChainer.x()`
    * Returns the current X value of the vector.
    */
   x(): number;
   /**
    * ### `VectorChainerNest.x(value)`
    * Sets the X value of this vector to the given input.
    * @param value The X value to set
    */
   x(value: number): VectorChainer;
   /**
    * ### `VectorChainer.y()`
    * Returns the current Y value of the vector.
    */
   y(): number;
   /**
    * ### `VectorChainerNest.y(value)`
    * Sets the Y value of this vector to the given input.
    * @param value The Y value to set
    */
   y(value: number): VectorChainer;
   /**
    * ### `VectorChainer.z()`
    * Returns the current Z value of the vector.
    */
   z(): number;
   /**
    * ### `VectorChainerNest.z(value)`
    * Sets the Z value of this vector to the given input.
    * @param value The Z value to set
    */
   z(value: number): VectorChainer;
}

/**
 * ## Vector Chainer Nest
 * A set of utility methods which access multiple `org.bukkit.util.Vector` objects simultaneously.
 * 
 * `VectorChainerNest.add(x, y, z, source?)`
 * 
 * `VectorChainerNest.distance(target, flat?)`
 * 
 * `VectorChainerNest.distance(targets, flat?)`
 * 
 * `VectorChainerNest.location(world, pitch?, yaw?)`
 * 
 * `VectorChainerNest.serialize()`
 * 
 * `VectorChainerNest.x()`
 * 
 * `VectorChainerNest.x(value)`
 * 
 * `VectorChainerNest.y()`
 * 
 * `VectorChainerNest.y(value)`
 * 
 * `VectorChainerNest.z()`
 *
 * `VectorChainerNest.z(value)`
 */

export interface VectorChainerNest {
   /**
    * ### `VectorChainerNest.add(x, y, z, source?)`
    * Adds velocity to each vector.
    * @param x Amount of X velocity to add
    * @param y Amount of Y velocity to add
    * @param z Amount of Z velocity to add
    * @param source Rotate each vector around a location's pitch and yaw before adding velocity
    */
   add(x: number, y: number, z: number, source?: Location): VectorChainerNest;
   /**
    * ### `VectorChainerNest.distance(target, flat?)`
    * Calculates the distances between these vectors and another vector, location, or an object with a vector or location attached.
    * @param target The target to calculate against
    * @param flat Ignore the y-axis in the calculation
    */
   distance(target: DistanceTarget, flat?: boolean): number[];
   /**
    * ### `VectorChainerNest.distance(targets, flat?)`
    * Calculates the distances between these vectors and an array of other vectors, locations, or objects with a vector or location attached.
    * @param targets The targets to calculate against
    * @param flat Ignore the y-axis in the calculations
    */
   distance(targets: DistanceTargetNest, flat?: boolean): number[][];
   /**
    * ### `VectorChainerNest.instance()`
    * Returns the server instance for each vector in this chainer nest.
    */
   instance(): Vector[];
   /**
    * ### `VectorChainerNest.location(world, pitch?, yaw?)`
    * Returns a location chainer nest with the equivalent locations from each vector in this chainer nest, given a world
    * @param world The world the locations should exist within
    * @param pitch The pitch value to set
    * @param yaw The yaw value to set
    */
   location(world: World | UUID | string, pitch?: number, yaw?: number): LocationChainerNest;
   /**
    * ### `VectorChainerNest.serialize()`
    * Returns JSON-serializable object representations for each instance in this chainer nest.
    */
   serialize(): VectorSerialized[];
   /**
    * ### `VectorChainerNest.x()`
    * Returns the current X value of each vector.
    */
   x(): number[];
   /**
    * ### `VectorChainerNest.x(value)`
    * Sets the X value of each vector to the given input.
    * @param value The X value to set
    */
   x(value: number): VectorChainerNest;
   /**
    * ### `VectorChainerNest.y()`
    * Returns the current Y value of the each vector.
    */
   y(): number[];
   /**
    * ### `VectorChainerNest.y(value)`
    * Sets the Y value of each vector to the given input.
    * @param value The Y value to set
    */
   y(value: number): VectorChainerNest;
   /**
    * ### `VectorChainerNest.z()`
    * Returns the current Z value of each vector.
    */
   z(): number[];
   /**
    * ### `VectorChainerNest.z(value)`
    * Sets the Z value of each vector to the given input.
    * @param value The Z value to set
    */
   z(value: number): VectorChainerNest;
}
