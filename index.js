////////////////////////////////////////////////////////////////////////////
//                                                                        //
//  ####  ########  ######    ########  ##    ##            ##  ########  //
//   ##   ##    ##  ##    ##  ##         ##  ##             ##  ##        //
//   ##   ##    ##  ##    ##  ##          ####              ##  ##        //
//   ##   ##    ##  ##    ##  #######      ##               ##  ########  //
//   ##   ##    ##  ##    ##  ##          ####              ##        ##  //
//   ##   ##    ##  ##    ##  ##         ##  ##       ##    ##        ##  //
//  ####  ##    ##  ######    ########  ##    ##  ##  ########  ########  //
//                                                                        //
////////////////////////////////////////////////////////////////////////////

/** @type {import('./library/engine')} */
const { Registry, is } = core.import('./library/engine.js');

/** @type {import('./library/wraps')} */
const wrappers = core.import('./library/wraps.js');

Registry.register('bar', wrappers.bar);
Registry.register('block', wrappers.block);
Registry.register('entity', wrappers.entity);
Registry.register('item', wrappers.item);
Registry.register('location', wrappers.location);
Registry.register('modifier', wrappers.modifier);
Registry.register('player', wrappers.player);
Registry.register('vector', wrappers.vector);

/** @type {import('./module').Main} */
function $ (object) {
   const control = is.array(object) ? object.filter(is.defined)[0] : object;
   if (is.object(control)) {
      for (const wrapper of Object.values(wrappers).reverse()) {
         if (control instanceof wrapper.valid) {
            return is.array(object) ? wrapper.chainerNest(object) : wrapper.chainer(object);
         }
      }
   }
}

core.export($);
