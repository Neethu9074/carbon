import { useEffect, useState } from 'react';

import { emptyObject } from 'in-services/fixedObjects';
import invariant from 'invariant';

export default function useObservable(observable, fieldsToWatch, { pure = true } = emptyObject) {
  invariant(fieldsToWatch, 'fieldsToWatch (second parameter) must be defined.');

  // We access a field _lastEmittedValue from observables in order to avoid excessive updates.
  // This helps because our observables are often able to synchronously provide the latest state.
  // Therefore the value from the initial subscribe call can often be ignored.
  //
  // In development mode we do not provide an initial value immediately/as part of the first render.
  // We do this in order to encourage proper usage of this hook. In production mode we will still get
  // improved rendering performance (through fewer render calls).
  const initialState = __DEV__ ? undefined : observable?._lastEmittedValue;
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // We allow usage such as useObservable(maybeTrue && createObservable(Ã¢â‚¬Â¦)) to support
    // React typical short-circuit logic. If also means that useObservable can be
    // combined with conditionals
    if (!observable) {
      if (state !== undefined) {
        setState(undefined);
      }
      return;
    }

    if (!pure || state !== initialState) {
      // Re-set the state on observable changed immediately to ensure consistent views.
      setState(initialState);
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
        if (disposing || (pure && v === state)) {
          return;
        }

        setState(v);
      });

    return () => {
      disposing = true;
      subscription.dispose();
    };
  }, fieldsToWatch);
  return state;
}
