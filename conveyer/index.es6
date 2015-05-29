'use strict';

import * as ro from 'reactive-observables';

export function create(Conveyer, params) {
  params = params || {};

  const uniqueId = Conveyer.getUniqueId(params);
  /*eslint-disable no-underscore-dangle*/
  const conveyerCache = Conveyer._conveyerCache = Conveyer._conveyerCache || {};
  /*eslint-enable no-underscore-dangle*/
  if (uniqueId in conveyerCache) {
    const cachedConveyer = conveyerCache[uniqueId];
    return cachedConveyer.observable;
  }

  const conveyer = new Conveyer(params);
  let stoppedOnce = false;

  const observable = ro.create({
    start() {
      if (stoppedOnce) {
        const err = 'Observables may not be reused once everyone unsubscribed!';
        throw new Error(err);
      }

      conveyer.start(observable.emit.bind(observable));
    },

    stop() {
      conveyer.stop();
      stoppedOnce = true;
      delete conveyerCache[uniqueId];
    },

    emitLatestOnSubscribe: true
  });

  conveyerCache[uniqueId] = {
    observable
  };

  return observable;
}
