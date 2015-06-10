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

  const observable = ro.create({
    start() {
      conveyer.start(observable.emit.bind(observable));
    },

    stop() {
      conveyer.stop();
    },

    emitLatestOnSubscribe: true
  });

  conveyerCache[uniqueId] = {
    observable
  };

  return observable;
}
