import shallowEquals from 'fbjs/lib/shallowEqual';
import { useEffect, useState } from 'react';
import invariant from 'invariant';

import { emptyObject } from 'in-services/fixedObjects';

export default function useObservable(
  observable,
  fieldsToWatch,
  {
    // Whether or not to ignore observable updates that equal (===) the current state.
    //  pure=true  => Only re-render when newValue !== currentState.
    //  pure=false => Always re-render when the observable emits a value.
    pure = true,
    // In order to ensure consistency this hook will reset the state to `undefined`
    // whenever `fieldsToWatch` changes. This can sometimes be undesirable and can
    // even result in too many render executions / wrong behavior. However it is
    // the technically consistent behavior.
    resetStateOnObservableChange = true
  } = emptyObject
) {
  invariant(fieldsToWatch, 'fieldsToWatch (second parameter) must be defined.');

  // once the refactoring is done, we can assume to always get a function here
  if (typeof observable === 'function') {
    observable = observable(fieldsToWatch);
  }

  // We access a field _lastEmittedValue from observables in order to avoid excessive updates.
  // This helps because our observables are often able to synchronously provide the latest state.
  // Therefore the value from the initial subscribe call can often be ignored.
  //
  // In development mode we do not provide an initial value immediately/as part of the first render.
  // We do this in order to encourage proper usage of this hook. In production mode we will still get
  // improved rendering performance (through fewer render calls).
  const initialStateValue = __DEV__ ? undefined : observable?._lastEmittedValue;
  const [lastKnownRenderState, scheduleRenderStateUpdate] = useState(
    {
      value: initialStateValue,
      fieldsToWatch
    },
    pure
  );

  useEffect(() => {
    // We may have multiple state updates between React updates. In order to avoid any diffing
    // problems we have to keep track of the last set state manually. All logic within the
    // effect should only use the 'state' and 'setState' fields. The render state should be
    // considered a side-effect that we cannot trust.
    let state = lastKnownRenderState;
    function setState(v) {
      const newState = {
        value: v,
        fieldsToWatch
      };
      state = newState;
      scheduleRenderStateUpdate(newState);
    }

    // We allow usage such as useObservable(maybeTrue && createObservable(Ã¢â‚¬Â¦)) to support
    // React typical short-circuit logic. If also means that useObservable can be
    // combined with conditionals
    if (!observable) {
      if (state.value !== undefined) {
        setState(undefined);
      }
      return;
    }

    if (resetStateOnObservableChange && (!pure || state.value !== initialStateValue)) {
      // Re-set the state on observable change immediately to ensure consistent views.
      setState(initialStateValue);
    }

    let disposing = false;

    const subscription = observable
      // React hooks effect logic is executed very often:
      //
      // > The clean-up function runs before the component is removed from the UI to prevent memory leaks.
      // > Additionally, if a component renders multiple times (as they typically do), the previous effect is cleaned
      // > up before executing the next effect. In our example, this means a new subscription is created on every update.
      // > Source: https://reactjs.org/docs/hooks-reference.html#useeffect
      //
      // We therefore need to make sure that we do not trigger excessive backend requests by temporarily
      // stopping and then re-establishing backend requests. We can achieve this by using a delayed stop.
      //
      // In order to avoid calling setState for a subscription that is already supposed to have been
      // stopped/disposed, we use a separate boolean flag.
      .delayedStop(500)
      .subscribe(v => {
        if (disposing || (pure && v === state.value)) {
          return;
        }

        setState(v);
      });

    return () => {
      disposing = true;
      subscription.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, fieldsToWatch);

  // Return the initial state value on observable change immediately to ensure consistent views.
  // Within the useEffect code path we are ensuring that the state kept in the useState hook
  // is updated as well. Unfortunately the update path via useEffect => useState is asynchronous.
  // This in turn requires us to have the logic two times.
  let valueToReturn = lastKnownRenderState.value;
  if (resetStateOnObservableChange && !shallowEquals(lastKnownRenderState.fieldsToWatch, fieldsToWatch)) {
    valueToReturn = initialStateValue;
  }
  return valueToReturn;
}
