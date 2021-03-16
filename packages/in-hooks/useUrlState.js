/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { isEqual } from 'lodash';

import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { addReset, removeReset } from 'in-stores/navigation/urlParameterResets';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import { mutateUrl, getModifiedUrl } from 'in-stores/navigation';
import { identity } from 'in-services/util/function';

export default function useUrlState({
  bind,
  resets = emptyArray,
  reducer = defaultingReducer,
  onUpdate,
  replaceHistory = true
}) {
  const location = useLocation();
  const [state, setState] = useState(() => determineStateChange(bind, location, emptyObject) || emptyObject);

  // Whenever we update the state, we cannot at the same time update the URL. This is caused by……
  //
  //  1. The fact that even old exposedSetState function must continue to be work. This is similar to the
  //     contract of useState.
  //
  //     > React guarantees that setState function identity is stable and won’t change on re-renders. This is why it’s
  //     > safe to omit from the useEffect or useCallback dependency list.
  //
  //     This in turn requires us to use the function variant of useState, i.e. setState(() => {}).
  //
  //  2. The setState variant which accepts a function, i.e. setState(() => {}), does not guarantee sync/async
  //     execution nor the number times the function is going to be executed. As a result, we cannot mutate the URL
  //     in the function passed to setState.
  useEffect(() => {
    // We need to know when we should start writing URL state into the URL. Without this check, we would start
    // manipulating the URL as soon as a component leveraging useUrlState is mounted. This is not the behavior
    // we want. Furthermore, this can have nasty consequences when replaceHistory=false, e.g., back button might
    // break because the previous page will immediately change the URL and through this initiate a 'forward'-action.
    if (state.__writeToUrl) {
      mutateUrl(location => modifyLocation(bind, state, location), replaceHistory);
      state.__writeToUrl = false;
    }
  }, [state]);

  useEffect(() => {
    addReset(executeResets);
    return () => removeReset(executeResets);

    function executeResets(previousLocation, nextLocation) {
      for (const { bind: resetBind, reset } of resets) {
        if (shouldExecuteReset(previousLocation, nextLocation, resetBind)) {
          let newState = reset;
          if (typeof reset === 'function') {
            const stateOfResetBoundFields = determineStateChange(resetBind, nextLocation, emptyObject) || emptyObject;
            newState = reset(stateOfResetBoundFields);
          }
          for (const key of Object.keys(newState)) {
            const binding = getBind(bind, key);
            setBindValue(binding, newState[key], nextLocation);
          }
        }
      }
    }
  }, [resets]);

  // Keep the state up to date when the location changes.
  useEffect(() => {
    setState(prevState => {
      const newState = determineStateChange(bind, location, prevState);
      if (!newState) {
        return prevState;
      }
      if (onUpdate) {
        onUpdate(prevState, newState);
      }

      return newState;
    });
  }, [location]);

  return [state, exposedSetState, exposedGetStateChangeUrl];

  function exposedSetState(change) {
    // Users of useUrlState might memoize an older variant of useUrlState. If we wouldn't use this function variant
    // of setState, we could be losing some prior state updates.
    setState(prev => {
      // Synchronously update the state to ensure that quick user interaction will correctly
      // be reflected within the React state tree. The successive URL update will
      // (asynchronously) update the state again. This state update will be a noop in all interaction
      // cases that happen via the Instana user interface. Cases in which this is not a noop are
      // URL changes caused by the browser itself, e.g. browser back button.
      return {
        ...reducer(prev, change),
        // We need to instruct our URL-updating useEffect call that a change in state must result in a location update.
        __writeToUrl: true
      };
    });
  }

  function exposedGetStateChangeUrl(change) {
    return getModifiedUrl(location, location => {
      const newState = reducer(state, change);
      modifyLocation(bind, newState, location);
    });
  }
}

function getBind(binds, as) {
  return binds.find(b => (b.as || b.name) === as);
}

function determineStateChange(bind, location, prevState) {
  const newState = {};

  for (const { path, name, as, parser = identity, initialState, getInitialState } of bind) {
    let value = undefined;
    if (path) {
      value = getMatrixParameter(location, path, name);
    } else {
      value = location.query[name];
    }

    if (value != null) {
      newState[as || name] = parser(value);
    } else {
      newState[as || name] = getInitialState ? getInitialState() : initialState;
    }
  }
  return isEqual(newState, prevState) ? null : newState;
}

export function defaultingReducer(state, change) {
  return {
    ...state,
    ...change
  };
}

function modifyLocation(bind, state, location) {
  bind.forEach(bind => setBindValue(bind, state[bind.as || bind.name], location));
}

function setBindValue({ path, name, serializer = String }, value, location) {
  if (path) {
    if (value != null) {
      setOrDeleteMatrixKey(location, path, name, serializer(value));
    } else {
      setOrDeleteMatrixKey(location, path, name);
    }
  } else {
    if (value != null) {
      location.query[name] = serializer(value);
    } else {
      delete location.query[name];
    }
  }
}

function shouldExecuteReset(previousLocation, nextLocation, bind) {
  for (const { path, name } of bind) {
    let previousValue;
    let nextValue;

    if (path) {
      previousValue = getMatrixParameter(previousLocation, path, name);
      nextValue = getMatrixParameter(nextLocation, path, name);
    } else {
      previousValue = previousLocation.query[name];
      nextValue = nextLocation.query[name];
    }

    if (nextValue !== previousValue) {
      return true;
    }
  }

  return false;
}
