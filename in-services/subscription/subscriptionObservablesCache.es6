/**
 * Uses the factory to create new observable instances if there is not yet an
 * instance witht he ID specified by `factory.getId(opts)`. Observables are
 * created via `factory.createObservable(opts)`.
 *
 * @param {Object} factory Factory object with `getId` and `createObservable` property.
 *   See documentation above for details.
 * @param {Object} opts Observable configuration options. Will be used to deduce an ID
 *   and to provide observable configuration options.
 * @return {Observable} A reactive observable which starts upon first subscribe.
 */
export default function createObservableIfMissing(factory, opts) {
  // we add a _cache flag to each factory to cache created observable
  // instances.
  const cache = factory._cache = factory._cache || {};
  const id = factory.getId(opts);

  if (id in cache) {
    return cache[id];
  }

  const observable = factory.createObservable(opts);
  cache[id] = observable;
  return observable;
}
