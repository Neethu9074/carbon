import React, { useState } from 'react';

import DistinctSlider from 'in-new-components/Slider/DistinctSlider';

export default {
  title: 'Molecules|slider/Sliders/discreteValues'
};

export const withPermanentLabel = () => {
  const [value, setValue] = useState(0.26);
  const formatPercent = value => `${value * 100}%`;
  const labeledTicks = [0, 1].map(value => ({ value, label: formatPercent(value) }));

  return (
    <DistinctSlider
      valueLabelDisplay="on"
      valueLabelFormat={formatPercent}
      marks={labeledTicks}
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
export const withTicks = () => {
  const [value, setValue] = useState(0.32);
  const formatPercent = value => `${value * 100}%`;
  const labeledTicks = [0, 0.25, 0.5, 0.75, 1].map(value => ({ value, label: formatPercent(value) }));

  return (
    <DistinctSlider
      valueLabelDisplay="auto"
      valueLabelFormat={formatPercent}
      marks={labeledTicks}
      min={0}
      max={1}
      step={0.01}
      value={value}
      onChange={value => {
        setValue(value);
      }}
    />
  );
};
