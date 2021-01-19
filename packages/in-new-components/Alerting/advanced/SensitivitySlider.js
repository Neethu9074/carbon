/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DebouncedDistinctSlider from 'in-new-components/Slider/DebouncedDistinctSlider';

export const DebouncedSensitivitySlider = ({ value, defaultValue, onChange }) => {
  const sliderStepCount = 600;
  const linearScaleValueOne = 2; // slider-scale value that yields a sensitivity-scale of 1
  const defaultValueLog = Math.log(defaultValue);
  const toSensitivityScale = x => roundToInterval(Math.exp((linearScaleValueOne - x) * defaultValueLog), 0.005);
  const toSliderScale = x => linearScaleValueOne - Math.log(x) / defaultValueLog;
  const linearScaleMin = toSliderScale(16);
  const linearScaleMax = toSliderScale(0.5);
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
      step={(linearScaleMax - linearScaleMin) / sliderStepCount}
      value={clamp(toSliderScale(value), linearScaleMin, linearScaleMax)}
      onChange={sliderValue => {
        onChange(toSensitivityScale(sliderValue));
      }}
    />
  );

  function roundToInterval(value, stepInterval) {
    const inverseStepInterval = parseInt(1 / stepInterval);
    return Math.round(value * inverseStepInterval) / inverseStepInterval;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }
};
