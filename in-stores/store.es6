import { create } from 'reactive-observables';
import invariant from 'invariant';

// Keeps track of the current state of all created stores. Will
// be used for debugging purposes in the future.
export const allStates = {};

export function createStore({ name, initialValue = null, reducers = null }) {
  invariant(!(name in allStates), 'Store (' + name + ') already exists');

  let currentState = (allStates[name] = initialValue);
  const observable = create();
  observable.emit(currentState);

  return {
    // We do not want store users to see the emit function. It could occur
    // to them that they can just emit() data without going through a
    // state reducer.
    observable: observable.freeze(),
    applyStateMutation,
    mutateTo
  };

  function applyStateMutation(action) {
    if (reducers == null) {
      mutateTo(action(currentState));
    } else {
      const reducer = reducers[action.type];
      if (__DEV__) {
        invariant(
          typeof reducer === 'function',
          `Unsupported action type ${action.type}. Did you forget to specify a reducer?`
        );
      }
      mutateTo(reducer(currentState, action));
    }
  }

  function mutateTo(newValue) {
    currentState = allStates[name] = newValue;
    observable.emit(currentState);
  }
}

export function createTrackingStore({ name, observable }) {
  invariant(!(name in allStates), 'Store (' + name + ') already exists');
  invariant(observable != null, 'Observable must be provided');

  allStates[name] = undefined;

  return {
    observable: observable.tap(v => {
      allStates[name] = v;
    })
  };
}

// only use this for testing purposes to clear the store registry. This
// is required when using proxyquire with stores.
export function resetStoreRegistry() {
  Object.keys(allStates).forEach(key => delete allStates[key]);
}
