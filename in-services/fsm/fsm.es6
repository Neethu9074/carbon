import invariant from 'invariant';

export class AbstractState {
  setTransitionManager(transitionManager) {
    this._transitionManager = transitionManager;
  }
  onEnter() {}
  onLeave() {}
}

export function createFsm(opts) {
  if (__DEV__) {
    validateStateApi(opts.publicApiMethods, states);
  }

  const transitionManager = {
    transitionTo
  };

  const states = opts.states;
  let activeState;
  Object.keys(states).forEach(stateName => {
    states[stateName].setTransitionManager(transitionManager);
  });
  transitionTo(opts.initialState);

  const publicInterface = {};
  opts.publicApiMethods.forEach(methodName => {
    publicInterface[methodName] = (...args) => {
      activeState[methodName].apply(activeState, args);
    };
  });

  return publicInterface;

  function transitionTo(name) {
    if (activeState) {
      activeState.onLeave();
    }

    activeState = states[name];
    activeState.onEnter();
  }
}

function validateStateApi(publicApiMethods, states) {
  invariant(
    publicApiMethods.indexOf('setTransitionManager') === -1,
    'A public API method setTransitionManager is not supported'
  );
  invariant(publicApiMethods.indexOf('onEnter') === -1, 'A public API method onEnter is not supported');
  invariant(publicApiMethods.indexOf('onLeave') === -1, 'A public API method onLeave is not supported');

  Object.keys(states).forEach(stateName => {
    invariant(
      typeof states[stateName].setTransitionManager === 'function',
      `State ${stateName} must define a method setTransitionManager`
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
