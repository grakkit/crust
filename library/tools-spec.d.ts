import { ArrayList, ItemMeta, PersistentDataHolder } from '../../../../dict/classes';

type Parsed = {
   asInt(): number;
   asFloat(): number;
   asDouble(): number;
   asLong(): number;
   asShort(): number;
   asByte(): number;
   asString(): string;
   [Symbol.iterator](): IterableIterator<Parsed>;
   map: {
      entrySet(): {
         [Symbol.iterator](): IterableIterator<{
            getKey(): string;
            getValue(): any;
         }>;
      };
   };
};

type Serialized =
   | { type: 'None'; value: void }
   | { type: 'Int' | 'Float' | 'Double' | 'Long' | 'Short' | 'Byte'; value: number }
   | { type: 'String'; value: string }
   | { type: 'End'; value: unknown }
   | { type: 'List' | 'ByteArray' | 'IntArray'; value: Serialized[] }
   | { type: 'Compound'; value: { [x: string]: Serialized } };

export interface num {
   clamp(number: number, min: number, max?: number): number;
}

export interface obj {
   key(object: any, value: any): string;
   strain(object: any, filter?: (value: any) => any): any;
}

export interface helper {
   adventure(value: string[]): ArrayList;
   bounds: {
      [x: string]: number[];
   };
   bridge<X>(
      type: X,
      filter?: (value: any) => any,
      consumer?: (value: any) => string
   ): { [x: string]: InstanceType<X> };
   collect(...array: any[]): ArrayList;
   data(host: PersistentDataHolder): any;
   data(host: PersistentDataHolder, value: any): void;
   dist(source: Location, target: Location, flat?: boolean): number;
   meta(item: ItemStack, modifier: (meta: ItemMeta) => any): any;
   meta(item: ItemStack, modifier: (meta: ItemMeta) => void): void;
}

export interface nbt {
   new (): Parsed;
   parse(data: Serialized): Parsed;
   serialize(data: Parsed): Serialized;
}
