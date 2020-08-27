import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

import { mutateUrl, navigationParameters$, getModifiedUrlStream } from 'in-stores/navigation';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { addReset, removeReset } from 'in-stores/navigation/urlParameterResets';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import { identity } from 'in-services/util/function';
import history from 'in-stores/navigation/history';

export default function useUrlState({
  bind,
  resets = emptyArray,
  reducer = defaultingReducer,
  onUpdate,
  replaceHistory = true
}) {
  const [state, setState] = useState(determineStateChange(bind, history.location, emptyObject) || emptyObject);

  useEffect(() => {
    addReset(executeResets);

    const subscription = navigationParameters$
      .skipFirst()
      // Simple yet effective way to avoid state updates when navigating away from a route.
      // When not doing this, it can happen that we update this state and a downstream
      // component makes a backend request. Following that request, the component is
      // immediately unmounted and therefore the request is pointless.
      // Handling updates on the next frame will mean that React gets a chance to unmount
      // a component which will call this component's componentWillUnmount which will
      // cancel the location subscription.
      .nextFrame()
      .subscribe(location => {
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
      });

    return () => {
      subscription.dispose();
      removeReset(executeResets);
    };
  }, []);

  return [state, exposedSetState, exposedGetStateChangedUrl];

  function exposedSetState(change) {
    mutateUrl(location => {
      // Synchronously update the state to ensure that quick user interaction will correctly
      // be reflected within the React state tree. The successive URL update will
      // (asynchronously) update the state again. This state update will be a noop in all interaction
      // cases that happen via the Instana user interface. Cases in which this is not a noop are
      // URL changes caused by the browser itself, e.g. browser back button.
      setState(prev => {
        const newState = reducer(prev, change);
        modifyLocation(bind, newState, location);
        return newState;
      });
    }, replaceHistory);
  }

  function exposedGetStateChangedUrl(change) {
    const newState = reducer(state, change);
    return getModifiedUrlStream(location => modifyLocation(bind, newState, location));
  }

  function executeResets(previousLocation, nextLocation) {
    for (const { bind: resetBind, reset } of resets) {
      if (shouldExecuteReset(previousLocation, nextLocation, resetBind)) {
        for (const key of Object.keys(reset)) {
          const binding = getBind(bind, key);
          setBindValue(binding, reset[key], nextLocation);
        }
      }
    }
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
