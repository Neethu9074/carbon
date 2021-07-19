/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

export class AbstractState {
  _setTransitionManager(transitionManager) {
    this._transitionManager = transitionManager;
  }

  transitionTo(stateName) {
    this._transitionManager.transitionTo(stateName);
  }

  getActiveState() {
    return this._transitionManager.getActiveState();
  }

  onEnter() {}
  onLeave() {}
}

export function createFsm(opts) {
  if (__DEV__) {
    validateStateApi(opts.publicApiMethods, opts.states);
  }

  const transitionManager = {
    transitionTo,
    getActiveState
  };

  const states = opts.states;
  let activeStateName;
  Object.keys(states).forEach(stateName => {
    states[stateName]._setTransitionManager(transitionManager);
  });
  transitionTo(opts.initialState);

  const publicInterface = {};
  opts.publicApiMethods.forEach(methodName => {
    publicInterface[methodName] = function() {
      return states[activeStateName][methodName].apply(states[activeStateName], arguments);
    };
  });

  return publicInterface;

  function transitionTo(name) {
    if (activeStateName) {
      states[activeStateName].onLeave();
    }

    activeStateName = name;
    states[activeStateName].onEnter();
  }

  function getActiveState() {
    return activeStateName;
  }
}

function validateStateApi(publicApiMethods, states) {
  invariant(
    publicApiMethods.indexOf('_setTransitionManager') === -1,
    'A public API method _setTransitionManager is not supported'
  );
  invariant(publicApiMethods.indexOf('onEnter') === -1, 'A public API method onEnter is not supported');
  invariant(publicApiMethods.indexOf('onLeave') === -1, 'A public API method onLeave is not supported');

  Object.keys(states).forEach(stateName => {
    invariant(
      typeof states[stateName]._setTransitionManager === 'function',
      `State ${stateName} must define a method _setTransitionManager`
    );
    invariant(typeof states[stateName].onEnter === 'function', `State ${stateName} must define a method onEnter`);
    invariant(typeof states[stateName].onLeave === 'function', `State ${stateName} must define a method onLeave`);

    publicApiMethods.forEach(methodName => {
      invariant(
        typeof states[stateName][methodName] === 'function',
        `State ${stateName} must define a method ${methodName}`
      );
    });
  });
}
