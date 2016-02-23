import * as ro from 'reactive-observables';
import invariant from 'invariant';

// Keeps track of the current state of all created stores. Will
// be used for debugging purposes in the future.
export const allStates = {};

export function createStore({name, initialValue = null}) {
  invariant(!(name in allStates), 'Store already exists');

  let currentState = allStates[name] = initialValue;
  const observable = ro.create();
  observable.emit(currentState);

  return {
    // We do not want store users to see the emit function. It could occur
    // to them that they can just emit() data without going through a
    // state reducer.
    observable: observable.freeze(),
    applyStateMutation
  };

  function applyStateMutation(reducer) {
    currentState = allStates[name] = reducer(currentState);
    observable.emit(currentState);
  }
}


export function createTrackingStore({name, observable}) {
  invariant(!(name in allStates), 'Store already exists');
  invariant(observable != null, 'Observable must be provided');

  allStates[name] = undefined;

  return {
    observable: observable.map(v => {
      allStates[name] = v;
      return v;
    })
  };
}

// only use this for testing purposes to clear the store registry. This
// is required when using proxyquire with stores.
export function resetStoreRegistry() {
  Object.keys(allStates).forEach(key => delete allStates[key]);
}
