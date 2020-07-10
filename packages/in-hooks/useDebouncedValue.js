import { useState, useRef, useEffect } from 'react';
import { create } from 'reactive-observables';

// Just a small alias to make usage of time configs in React components
// a lot more explicit.
export default function useTimeConfig(value, onChange, delay = 1000) {
  const [value$] = useState(create());
  const [stateValue, setStateValue] = useState(value);
  const [subscription, setSubscription] = useState(null);

  const onChangeRef = useRef();
  onChangeRef.current = onChange;

  if (!subscription) {
    setSubscription(
      value$
        .debounce(delay)
        .distinct()
        .subscribe(v => onChangeRef.current(v))
    );
  }

  useEffect(
    () => {
      if (value !== stateValue) {
        setStateValue(value);
      }
    },
    [value]
  );

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
