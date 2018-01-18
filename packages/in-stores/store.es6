// @flow
import { create } from 'reactive-observables';
import Observer from 'reactive-observables/Observer';
import Observable from 'reactive-observables/Observable';
import invariant from 'invariant';

declare var __DEV__: any;

// Keeps track of the current state of all created stores. Will
// be used for debugging purposes in the future.
export const allStates: { [key: string]: any } = {};

export interface StoreSpec<T> {
  name: string;
  initialValue: ?T;
  isGlobal?: boolean;
  reducers: ?any;
}

export interface Store<T> {
  observable: Observable<T> | Observer<any, T>;
  applyStateMutation: ?Function;
  mutateTo: ?Function;
}

export interface TrackingStoreSpec<T> {
  name: string;
  observable: Observable<T>;
}

export interface TrackingStore<T> {
  observable: Observable<T> | Observer<any, T>;
}

export function createStore<T>(spec: StoreSpec<T>): Store<T> {
  spec.isGlobal = spec.isGlobal !== false;
  if (spec.isGlobal) {
    invariant(!(spec.name in allStates), 'Store (' + spec.name + ') already exists');
  }

  let currentState = spec.initialValue;
  if (spec.isGlobal) {
    allStates[spec.name] = currentState;
  }
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
    if (spec.reducers == null) {
      mutateTo(action(currentState));
    } else {
      const reducer = spec.reducers[action.type];
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
    currentState = newValue;
    if (spec.isGlobal) {
      allStates[spec.name] = currentState;
    }
    observable.emit(currentState);
  }
}

export function createTrackingStore<T>(spec: TrackingStoreSpec<T>): TrackingStore<T> {
  invariant(!(spec.name in allStates), 'Store (' + spec.name + ') already exists');
  invariant(spec.observable != null, 'Observable must be provided');

  allStates[spec.name] = undefined;

  return {
    observable: spec.observable.tap((v: ?T) => {
      allStates[spec.name] = v;
    })
  };
}

// only use this for testing purposes to clear the store registry. This
// is required when using proxyquire with stores.
export function resetStoreRegistry(): void {
  Object.keys(allStates).forEach(key => delete allStates[key]);
}
