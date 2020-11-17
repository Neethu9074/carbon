import React from 'react';

import DebouncedDistinctSlider from 'in-new-components/Slider/DebouncedDistinctSlider';

export const DebouncedSensitivitySlider = ({ value, defaultValue, onChange }) => {
  const linearScaleMin = 0;
  const linearScaleMax = 2;
  const defaultValueLog = Math.log(defaultValue);
  const toSensitivityScale = x => Math.round(Math.exp((linearScaleMax - x) * defaultValueLog) * 200) / 200;
  const toSliderScale = x =>
    Math.max(linearScaleMin, Math.min(linearScaleMax - Math.log(x) / defaultValueLog, linearScaleMax));
  const labeledTicks = [
    { value: linearScaleMin, label: 'low' },
    { value: toSliderScale(defaultValue) },
    { value: linearScaleMax, label: 'high' }
  ];

  return (
    <DebouncedDistinctSlider
      debounceMaxWait={5000}
      valueLabelDisplay="off"
      marks={labeledTicks}
      min={linearScaleMin}
      max={linearScaleMax}
      step={2 / 600}
      value={toSliderScale(value)}
      onChange={sliderValue => {
        onChange(toSensitivityScale(sliderValue));
      }}
    />
  );
};
