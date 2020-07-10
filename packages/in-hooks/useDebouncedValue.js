import { create } from 'reactive-observables';
import { useState, useEffect } from 'react';

export default function useDebouncedValue(value, onChange, delay = 1000) {
  const [value$] = useState(create());
  const [stateValue, setStateValue] = useState(value);
  useEffect(
    () => {
      value$.emit(stateValue);
    },
    [stateValue]
  );

  let subscription = null;
  useEffect(() => {
    if (!subscription) {
      subscription = value$
        .debounce(delay)
        .distinct()
        .subscribe(onChange);
    }

    return () => {
      if (subscription) {
        subscription.dispose();
        subscription = null;
      }
    };
  }, []);

  return { value: stateValue, onChange: setStateValue };
}
