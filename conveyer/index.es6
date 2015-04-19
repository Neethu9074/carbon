'use strict';

import rx from 'rx';

export function create(Conveyer, params) {
  const conveyer = new Conveyer(params || {});
  const observers = [];
  let running = false;
  let lastValue = null;

  return rx.Observable.create(observer => {
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
        conveyer.stop();
      }
    };
  });

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
