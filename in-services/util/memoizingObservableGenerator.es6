export default function memoize(createObservable, idGenerator, tti = 10000) {
  const cache = {};

  return function memoizedObservableCreator() {
    const id = idGenerator.apply(this, arguments);
    if (id in cache) {
      return cache[id];
    }

    const observable = createObservable.apply(this, arguments)
      .delayedStop(tti, () => {
        delete cache[id];
      }, setTimeout, clearTimeout);
    cache[id] = observable;
    return observable;
  };
}
