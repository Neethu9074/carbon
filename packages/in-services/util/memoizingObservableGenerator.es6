export default function memoize(createObservable, idGenerator, tti = 10000) {
  const originalTti = tti;
  const cache = new Map();

  return function memoizedObservableCreator(...args) {
    const id = idGenerator.apply(this, arguments);
    if (cache.has(id)) {
      return cache.get(id);
    }

    if (typeof tti === 'function') {
      tti = lastEmittedValue => originalTti(args, lastEmittedValue);
    }

    const observable = createObservable.apply(this, arguments).delayedStop(tti, () => {
      cache.delete(id);
    });
    cache.set(id, observable);
    return observable;
  };
}
