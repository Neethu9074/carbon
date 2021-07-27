/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useRef, useEffect } from 'react';

import { create, DebounceOptions, Disposable, Subject } from '@instana/observables';

// Just a small alias to debounce value setting, similar to rxjs.debounce but
// for functional React components
export default function<T>(
  value: T,
  onChange: (v: T) => void,
  delay: number = 1000,
  opts: DebounceOptions,
  pure: boolean = true
) {
  const [value$] = useState<Subject<T>>(create());
  const [stateValue, setStateValue] = useState(value);
  const [debouncedStateValue, setDebouncedStateValue] = useState(value);
  const [subscription, setSubscription] = useState<Disposable | null>(null);

  const onChangeRef = useRef<(v: T) => any>(onChange);
  // onChangeRef.current = onChange;

  if (!subscription) {
    setSubscription(
      value$
        .debounce(delay, opts)
        .distinct((a, b) => {
          return !pure || a !== b;
        })
        .subscribe(v => {
          setDebouncedStateValue(v);
          onChangeRef.current(v);
        })
    );
  }

  useEffect(() => {
    if (!pure || value !== stateValue) {
      setStateValue(value);
    }
    // we only want to call the effect when value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.dispose();
        setSubscription(null);
      }
    };
    // only update on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    value: stateValue,
    debouncedValue: debouncedStateValue,
    onChange: (v: T) => {
      setStateValue(v);
      value$.emit(v);
    }
  };
}
