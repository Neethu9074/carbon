/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';
import invariant from 'invariant';

interface StoreSpec<T> {
  // The store name is used for debugging purposes.
  name: string,
  // Only global stores can be inspected for debugging purposes.
  // Defaults to true.
  isGlobal?: boolean,
  initialValue?: T | null,
  reducers?: {
    [type: string]: (currentState: T | null, action: ActionDefinition) => T
  }
}

interface ActionDefinition {
  type: string
}

type Action<T> = ((currentState: T | null) => T) | ActionDefinition;

interface TrackingStoreSpec<T> {
  // The store name is used for debugging purposes.
  name: string,
  observable: Observable<T>
}

interface TrackingStore<T> {
  observable: Observable<T>
}

// Keeps track of the current state of all created stores. Will
// be used for debugging purposes in the future.
export const allStates: {
  [storeName: string]: any
} = {};

export function createStore<T>(spec: StoreSpec<T>) {
  spec.isGlobal = spec.isGlobal !== false;

  if (spec.initialValue === undefined) {
    spec.initialValue = null;
  }

  if (spec.isGlobal) {
    invariant(!(spec.name in allStates), 'Store (' + spec.name + ') already exists');
  }

  let currentState = spec.initialValue;
  if (spec.isGlobal) {
    allStates[spec.name] = currentState;
  }
  const observable = create<T>();
  // as any because the store implementation is borked
  observable.emit(currentState as any);

  return {
    // We do not want store users to see the emit function. It could occur
    // to them that they can just emit() data without going through a
    // state reducer.
    observable: observable.freeze(),
    applyStateMutation,
    mutateTo
  };

  function applyStateMutation(action: Action<T>) {
    if (typeof action === 'function') {
      mutateTo(action(currentState));
    } else if (spec.reducers) {
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

  function mutateTo(newValue: T) {
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
    observable: spec.observable.tap(v => {
      allStates[spec.name] = v;
    })
  };
}

// only use this for testing purposes to clear the store registry. This
// is required when using proxyquire with stores.
export function resetStoreRegistry() {
  Object.keys(allStates).forEach(key => delete allStates[key]);
}
