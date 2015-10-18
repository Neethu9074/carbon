import * as ro from 'reactive-observables';
import invariant from 'invariant';

const reemitSpec = {emitLatestOnSubscribe: true};

// Keeps track of the current state of all created stores. Will
// be used for debugging purposes in the future.
export const allStates = {};

export function createStore({name, initialValue = null}) {
  invariant(!(name in allStates), 'Store already exists');

  let currentState = allStates[name] = initialValue;
  const observable = ro.create(reemitSpec);
  observable.emit(currentState);

  return {
    // We do not want store users to see the emit function. It could occur
    // to them that they can just emit() data without going through a
    // state reducer.
    observable: observable.freeze(),
    applyStateMutation: applyModification
  };

  function applyModification(reducer) {
    currentState = allStates[name] = reducer(currentState);
    observable.emit(currentState);
  }
}
