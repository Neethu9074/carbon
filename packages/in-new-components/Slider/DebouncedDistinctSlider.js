import React, { useState, useEffect } from 'react';
import { create } from 'reactive-observables';

import DistinctSlider from 'in-new-components/Slider/DistinctSlider';

export default function DebouncedDistinctSlider(props) {
  const [value$] = useState(create());
  const [value, setValue] = useState(props.value);
  useEffect(
    () => {
      value$.emit(value);
    },
    [value]
  );

  let subscription = null;
  useEffect(() => {
    if (!subscription) {
      subscription = value$
        .debounce(500)
        .distinct()
        .subscribe(props.onChange);
    }

    return () => {
      if (subscription) {
        subscription.dispose();
        subscription = null;
      }
    };
  }, []);

  return <DistinctSlider {...props} value={value} onChange={setValue} />;
}
