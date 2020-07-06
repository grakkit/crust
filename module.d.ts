import { Block, Entity, ItemStack, Location, Vector } from './dictionary/bukkit';

import { BlockChainer, BlockChainerNest, BlockSerialized } from './dictionary/block';
import { EntityChainer, EntityChainerNest, EntitySerialized } from './dictionary/entity';
import { ItemChainer, ItemChainerNest, ItemSerialized } from './dictionary/item';
import { LocationChainer, LocationChainerNest, LocationSerialized } from './dictionary/location';
import { VectorChainer, VectorChainerNest, VectorSerialized } from './dictionary/vector';

export function Main (input: Block): BlockChainer;
export function Main (input: Block[]): BlockChainerNest;
export function Main (input: Entity): EntityChainer;
export function Main (input: Entity[]): EntityChainerNest;
export function Main (input: ItemStack): ItemChainer;
export function Main (input: ItemStack[]): ItemChainerNest;
export function Main (input: Location): LocationChainer;
export function Main (input: Location[]): LocationChainerNest;
export function Main (input: Vector): VectorChainer;
export function Main (input: Vector[]): VectorChainerNest;

export function Main (input: BlockChainer): BlockSerialized;
export function Main (input: BlockSerialized): BlockChainer;

export function Main (input: EntityChainer): EntitySerialized;
export function Main (input: EntitySerialized): EntityChainer;

export function Main (input: ItemChainer): ItemSerialized;
export function Main (input: ItemSerialized): ItemChainer;

export function Main (input: LocationChainer): LocationSerialized;
export function Main (input: LocationSerialized): LocationChainer;

export function Main (input: VectorChainer): VectorSerialized;
export function Main (input: VectorSerialized): VectorChainer;
