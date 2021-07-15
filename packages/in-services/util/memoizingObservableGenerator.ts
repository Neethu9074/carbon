/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function memoize(createObservable, idGenerator, tti = 10000) {
  const originalTti = tti;
  const cache = new Map();

  return function memoizedObservableCreator() {
    const id = idGenerator.apply(this, arguments);
    if (cache.has(id)) {
      return cache.get(id);
    }

    if (typeof tti === 'function') {
      // non-deopt arguments copy
      const args = new Array(arguments.length);
      for (let i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }
      tti = lastEmittedValue => originalTti(args, lastEmittedValue);
    }

    const observable = createObservable.apply(this, arguments).delayedStop(tti, () => {
      cache.delete(id);
    });
    cache.set(id, observable);
    return observable;
  };
}
