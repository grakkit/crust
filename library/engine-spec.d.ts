import * as accessors from './accessors';
import * as wrappers from './wrappers';

type Callback = (link: Wrapper<any>, output: any[]) => any;

type Consumer = (
   args: any[],
   property: {
      get(): any[];
      get(index: number): any;
      set(value: any, index: number): void;
      run(args: any[]): any[];
      run(args: any[], index: number): any;
   }
) => void | any[];

type Enforcer<X> = (things: X[], args: any[], policy: string) => void | any[];

type Entries<X> = {
   key: string;
   link?: keyof typeof wrappers;
   policy: string;
   accessor: Enforcer<X>;
}[];

type Property<X> = {
   get?(this: X): any;
   link?: keyof typeof wrappers;
   policy?: string;
   run?(this: X, ...args: any[]): void;
   set?(this: X, value: any): void;
   type: keyof typeof accessors;
};

class Processor<X> {
   constructor (entries: Entries<X>, ...things: X[]);
}

type Properties<X> = { [x: string]: Property<X> };

export class Accessor<X> {
   consumer: Consumer;
   constructor (consumer: Consumer);
   new (valid: X, property: Property<X>): Enforcer<X>;
}

export class Violation {
   template: string;
   constructor (policy: string);
   message (key: string): string;
}

export class Wrapper<X> {
   valid: X;
   properties: Properties<X>;
   entries: Entries<X>;
   static add (addons: { [x: string]: Wrapper<any> }): void;
   static processor (callback: Callback): typeof Processor;
   constructor (valid: X, properties: Properties<X>);
   chainer (thing: X): any;
   chainerNest (things: X[]): any;
   extend<Y> (valid: Y, properties: Properties<Y>): Wrapper<Y>;
}

export interface Registry {
   storage: { [x: string]: Wrapper<any> };
   register(name: string, wrapper: Wrapper<any>): void;
}

export interface is {
   array(object: any): boolean;
   defined(object: any): boolean;
   object(object: any): boolean;
   safe(policy: string, object: any, violation?: Violation): true | never;
}
