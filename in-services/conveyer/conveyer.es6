import * as ro from 'reactive-observables';

export function create(Conveyer, params) {
  params = params || {};

  const uniqueId = Conveyer.getUniqueId(params);
  const conveyerCache = Conveyer._conveyerCache = Conveyer._conveyerCache || {};
  const cachedConveyer = conveyerCache[uniqueId];

  if (cachedConveyer) {
    return cachedConveyer;
  }

  const conveyer = new Conveyer(params);

  const observable = ro.create({
    start() {
      conveyer.start(observable.emit.bind(observable));
    },

    stop() {
      // TODO Ben evict stopped converyers from cache after a certain amount of time
      // has passed.
      conveyer.stop();
    },

    emitLatestOnSubscribe: true
  });

  conveyerCache[uniqueId] = observable;

  return observable;
}
