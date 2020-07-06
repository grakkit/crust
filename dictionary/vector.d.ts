import { Vector, Location } from './bukkit';

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

/**
 * ## Vector Chainer
 * A set of utility methods which access `org.bukkit.util.Vector` objects
 */
export interface VectorChainer {
   add(x: number, y: number, z: number, source?: Location): VectorChainer;
   distance(target: Vector | VectorChainer, flat?: boolean): number;
   distance(target: Vector[] | VectorChainerNest, flat?: boolean): number[];
   instance(): Vector;
   serialize(): VectorSerialized;
   wrapper(): VectorWrapper;
   x(): number;
   x(value: number): VectorChainer;
   y(): number;
   y(value: number): VectorChainer;
   z(): number;
   z(value: number): VectorChainer;
}

/**
 * ## Vector Chainer Nest
 * A set of utility methods which access multiple `org.bukkit.util.Vector` objects simultaneously
 */
export interface VectorChainerNest {
   add(x: number, y: number, z: number, source?: Location): VectorChainerNest;
   distance(target: Vector | VectorChainer, flat?: boolean): number[];
   distance(target: Vector[] | VectorChainerNest, flat?: boolean): number[][];
   instance(): Vector[];
   serialize(): VectorSerialized[];
   wrapper(): VectorWrapper[];
   x(): number[];
   x(value: number): VectorChainerNest;
   y(): number[];
   y(value: number): VectorChainerNest;
   z(): number[];
   z(value: number): VectorChainerNest;
}
