import {
   KeyedBossBar,
   Block,
   LivingEntity,
   ItemStack,
   Location,
   AttributeModifier,
   Player,
   Vector,
   CommandSender
} from './../../../dict/classes';

type Bar = KeyedBossBar;
type Entity = LivingEntity;
type Item = ItemStack;
type Modifier = AttributeModifier;

type Setter<X> = X | ((value: X) => void | X);

interface BaseChainer<X> {
   instance(): X;
}

interface BaseChainerNest<X> extends BaseChainer<X> {
   instance(): X[];
}

interface XYZChainer<X> extends BaseChainer<X> {
   x(): number;
   x(value: Setter<number>): this;
   y(): number;
   y(value: Setter<number>): this;
   z(): number;
   z(value: Setter<number>): this;
}

interface XYZChainerNest<X> extends BaseChainerNest<X>, XYZChainer<X> {
   x(): number[];
   x(value: Setter<number>): this;
   y(): number[];
   y(value: Setter<number>): this;
   z(): number[];
   z(value: Setter<number>): this;
}

interface PositionalChainer<X> extends BaseChainer<X> {}

interface PositionalChainerNest<X> extends BaseChainerNest<X>, PositionalChainer<X> {}

interface BarChainer<X> extends BaseChainer<X> {}

interface BarChainerNest<X> extends BaseChainerNest<X>, BarChainer<X> {}

interface BlockChainer<X> extends PositionalChainer<X> {}

interface BlockChainerNest<X> extends PositionalChainerNest<X>, BlockChainer<X> {}

interface EntityChainer<X> extends PositionalChainer<X> {}

interface EntityChainerNest<X> extends PositionalChainerNest<X>, EntityChainer<X> {}

interface ItemChainer<X> extends BaseChainer<X> {}

interface ItemChainerNest<X> extends BaseChainerNest<X>, ItemChainer<X> {}

interface LocationChainer<X> extends XYZChainer<X> {
   pitch(): number;
   pitch(value: Setter<number>): this;
   yaw(): number;
   yaw(value: Setter<number>): this;
}

interface LocationChainerNest<X> extends XYZChainerNest<X>, LocationChainer<X> {
   pitch(): number[];
   pitch(value: Setter<number>): this;
   yaw(): number[];
   yaw(value: Setter<number>): this;
}

interface ModifierChainer<X> extends BaseChainer<X> {}

interface ModifierChainerNest<X> extends BaseChainerNest<X>, ModifierChainer<X> {}

interface PlayerChainer<X> extends EntityChainer<X> {}

interface PlayerChainerNest<X> extends EntityChainerNest<X>, PlayerChainer<X> {}

interface VectorChainer<X> extends XYZChainer<X> {}

interface VectorChainerNest<X> extends XYZChainerNest<X>, VectorChainer<X> {}

type BarChained = BarChainer<Bar>;
type BarChainedNest = BarChainerNest<Bar>;
type BarValid = Bar | BarChained;
type BarValidNest = BarValid[] | BarChainedNest;

type BlockChained = BlockChainer<Block>;
type BlockChainedNest = BlockChainerNest<Block>;
type BlockValid = Block | BlockChained;
type BlockValidNest = BlockValid[] | BlockChainedNest;

type EntityChained = EntityChainer<Entity>;
type EntityChainedNest = EntityChainerNest<Entity>;
type EntityValid = Entity | EntityChained;
type EntityValidNest = EntityValid[] | EntityChainedNest;

type ItemChained = ItemChainer<Item>;
type ItemChainedNest = ItemChainerNest<Item>;
type ItemValid = Item | ItemChained;
type ItemValidNest = ItemValid[] | ItemChainedNest;

type LocationChained = LocationChainer<Location>;
type LocationChainedNest = LocationChainerNest<Location>;
type LocationValid = Location | LocationChained;
type LocationValidNest = LocationValid[] | LocationChainedNest;

type ModifierChained = ModifierChainer<Modifier>;
type ModifierChainedNest = ModifierChainerNest<Modifier>;
type ModifierValid = Modifier | ModifierChained;
type ModifierValidNest = ModifierValid[] | ModifierChainedNest;

type PlayerChained = PlayerChainer<Player>;
type PlayerChainedNest = PlayerChainerNest<Player>;
type PlayerValid = Player | PlayerChained;
type PlayerValidNest = PlayerValid[] | PlayerChainedNest;

type VectorChained = VectorChainer<Vector>;
type VectorChainedNest = VectorChainerNest<Vector>;
type VectorValid = Vector | VectorChained;
type VectorValidNest = VectorValid[] | VectorChainedNest;

export interface Main {
   (query: string, context?: CommandSender): EntityChainedNest;
   (bar: BarValid): BarChained;
   (block: BlockValid): BlockChained;
   (player: PlayerValid): PlayerChained;
   (entity: EntityValid): EntityChained;
   (item: ItemValid): ItemChained;
   (location: LocationValid): LocationChained;
   (modifier: ModifierValid): ModifierChained;
   (vector: VectorValid): VectorChained;
   (bars: BarValidNest): BarChainedNest;
   (blocks: BlockValidNest): BlockChainedNest;
   (players: PlayerValidNest): PlayerChainedNest;
   (entities: EntityValidNest): EntityChainedNest;
   (items: ItemValidNest): ItemChainedNest;
   (locations: LocationValidNest): LocationChainedNest;
   (modifiers: ModifierValidNest): ModifierChainedNest;
   (vectors: VectorValidNest): VectorChainedNest;
}
