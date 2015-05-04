'use strict';

import rx from 'rx';

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
  const observers = [];
  let running = false;
  let stoppedOnce = false;
  let lastValue = null;

  const observable = rx.Observable.create(observer => {
    if (stoppedOnce) {
      const err = 'Observables may not be reused once everyone unsubscribed!';
      throw new Error(err);
    }

    observers.push(observer);
    if (lastValue) {
      observer.onNext(lastValue);
    }

    if (!running) {
      running = true;
      conveyer.start(onNext, onError);
    }

    return () => {
      observers.splice(observers.indexOf(observer), 1);
      if (observers.length === 0) {
        running = false;
        stoppedOnce = true;
        conveyer.stop();
        delete conveyerCache[uniqueId];
      }
    };
  });

  conveyerCache[uniqueId] = {
    observable
  };

  return observable;

  function onNext(v) {
    lastValue = v;
    for (let i = 0, len = observers.length; i < len; i++) {
      observers[i].onNext(v);
    }
  }

  function onError(error) {
    for (let i = 0, len = observers.length; i < len; i++) {
      observers[i].onError(error);
    }
  }
}
