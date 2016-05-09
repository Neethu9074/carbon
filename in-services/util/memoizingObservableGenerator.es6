export default function memoize(createObservable, idGenerator, tti = 10000) {
  const cache = {};

  return function memoizedObservableCreator(arg) {
    const id = idGenerator(arg);
    if (id in cache) {
      return cache[id];
    }

    const observable = createObservable(arg)
      .delayedStop(tti, () => {
        delete cache[id];
      });
    cache[id] = observable;
    return observable;
  };
}
