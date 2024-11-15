/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import { round } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { t } from 'in-i18n';

export const DebouncedSensitivitySlider = ({ value, defaultValue, onChange, disabled }) => {
  const sliderStepCount = 600;
  const linearScaleValueOne = 2; // slider-scale value that yields a sensitivity-scale of 1
  const defaultValueLog = Math.log(defaultValue);
  const toSensitivityScale = x => roundToInterval(Math.exp((linearScaleValueOne - x) * defaultValueLog), 0.005);
  const toSliderScale = x => linearScaleValueOne - Math.log(x) / defaultValueLog;
  const linearScaleMin = toSliderScale(16);
  const linearScaleMax = toSliderScale(0.5);
  const labeledTicks = [
    { value: linearScaleMin, label: t('in-alerting:smartAlerts.components.smartAlertDialog.sensitivitySliderLow') },
    { value: toSliderScale(defaultValue) },
    { value: linearScaleMax, label: t('in-alerting:smartAlerts.components.smartAlertDialog.sensitivitySliderHigh') }
  ];
  return (
    <DebouncedDistinctSlider
      debounceMaxWait={5000}
      valueLabelFormat={valueLabelFormat}
      valueLabelDisplay="auto"
      marks={labeledTicks}
      min={linearScaleMin}
      max={linearScaleMax}
      step={(linearScaleMax - linearScaleMin) / sliderStepCount}
      value={clamp(toSliderScale(value), linearScaleMin, linearScaleMax)}
      onChange={sliderValue => {
        onChange(toSensitivityScale(sliderValue));
      }}
      disabled={disabled}
    />
  );

  function valueLabelFormat(value) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.sensitivitySliderValueLabel', {
      count: round(toSensitivityScale(value), 2, true)
    });
  }

  function roundToInterval(value, stepInterval) {
    const inverseStepInterval = parseInt(1 / stepInterval);
    return Math.round(value * inverseStepInterval) / inverseStepInterval;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }
};
