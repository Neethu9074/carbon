import React, { useState } from 'react';

import RestrictedSlider from 'in-new-components/Slider/RestrictedSlider';
import DistinctSlider from 'in-new-components/Slider/DistinctSlider';

export default {
  title: 'Molecules|slider/Slider',
  component: RestrictedSlider
};

export const restrictedSlider = () => {
  const marks = [
    {
      value: 1,
      label: '1 min'
    },
    {
      value: 5,
      label: '5 min'
    },
    {
      value: 10,
      label: '10 min'
    },
    {
      value: 30,
      label: '30 min'
    }
  ];
  const [value, setValue] = useState(marks[2].value);
  return (
    <RestrictedSlider
      marks={marks}
      min={0}
      valueLabelFormat={x => x + ' min'}
      max={marks[marks.length - 1].value}
      value={value}
      onChange={value => {
        setValue(value);
      }}
    />
  );
};

export const distinctSlider = () => {
  const [value, setValue] = useState(0.3);
  return (
    <DistinctSlider
      marks={[{ value: 0.5, label: '50%' }]}
      min={0}
      max={1}
      step={0.1}
      value={value}
      onChange={value => {
        setValue(value);
      }}
    />
  );
};
