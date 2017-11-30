export default function memoize(createObservable, idGenerator, tti = 10000) {
  const cache = new Map();

  return function memoizedObservableCreator() {
    const id = idGenerator.apply(this, arguments);
    if (cache.has(id)) {
      return cache.get(id);
    }

    const observable = createObservable.apply(this, arguments).delayedStop(tti, () => {
      cache.delete(id);
    });
    cache.set(id, observable);
    return observable;
  };
}
