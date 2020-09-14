import { useState, useRef, useEffect } from 'react';
import { create } from 'reactive-observables';

// Just a small alias to debounce value setting, similar to rxjs.debounce but
// for functional React components
export default function useDebouncedValue(value, onChange, delay = 1000, opts) {
  const [value$] = useState(create());
  const [stateValue, setStateValue] = useState(value);
  const [subscription, setSubscription] = useState(null);

  const onChangeRef = useRef();
  onChangeRef.current = onChange;

  if (!subscription) {
    setSubscription(
      value$
        .debounce(delay, opts)
        .distinct()
        .subscribe(v => onChangeRef.current(v))
    );
  }

  useEffect(() => {
    if (value !== stateValue) {
      setStateValue(value);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.dispose();
        setSubscription(null);
      }
    };
  }, []);

  return {
    value: stateValue,
    onChange: v => {
      setStateValue(v);
      value$.emit(v);
    }
  };
}
