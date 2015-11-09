import * as ro from 'reactive-observables';

export function create(Conveyer, params) {
  params = params || {};

  const uniqueId = Conveyer.getUniqueId(params);
  const conveyerCache = Conveyer._conveyerCache = Conveyer._conveyerCache || {};
  const cachedConveyer = conveyerCache[uniqueId];

  if (cachedConveyer) {
    return cachedConveyer;
  }

  let running = false;
  let stopTimeoutHandle;
  const conveyer = new Conveyer(params);

  const observable = ro.create({
    emitLatestOnSubscribe: true,

    start() {
      if (stopTimeoutHandle) {
        clearTimeout(stopTimeoutHandle);
        stopTimeoutHandle = null;
      }
      if (!running) {
        running = true;
        conveyer.start(observable.emit.bind(observable));
      }
    },

    stop() {
      // Evict stopped conveyers from cache after a small
      // amount of time has passed.
      stopTimeoutHandle = setTimeout(() => {
        if (running) {
          running = false;
          delete conveyerCache[uniqueId];
          conveyer.stop();
        }
      }, 1000);
    }
  });

  conveyerCache[uniqueId] = observable;

  return observable;
}
