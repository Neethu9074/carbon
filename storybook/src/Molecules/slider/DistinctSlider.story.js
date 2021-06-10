/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import DistinctSlider from 'in-components/Slider/DistinctSlider';

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

export const Disabled = () => {
  const [value, setValue] = useState(0.26);
  const formatPercent = value => `${value * 100}%`;
  const labeledTicks = [0, 1].map(value => ({ value, label: formatPercent(value) }));

  return (
    <DistinctSlider
      disabled
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

export const externallyHaveLogarithmicScale = () => {
  // Range will be 1 (e^0) - 25 (e^2)
  // In the middle of the slider, it will be 5 (e^1)

  const ln5 = Math.log(5);
  const expoValue = x => '' + Math.round(Math.exp(x * ln5) * 100) / 100;
  const labeledTicks = [0, 0.5, 1, 1.5, 2].map(value => ({ value, label: expoValue(value) }));

  const [sliderValue, setSliderValue] = useState(0.5);

  return (
    <DistinctSlider
      valueLabelDisplay="auto"
      valueLabelFormat={expoValue}
      marks={labeledTicks}
      min={0}
      max={2}
      step={2 / 100}
      value={sliderValue}
      onChange={sliderValue => {
        setSliderValue(sliderValue);
        // externally we would convert via expoValue(sliderValue)
      }}
    />
  );
};
