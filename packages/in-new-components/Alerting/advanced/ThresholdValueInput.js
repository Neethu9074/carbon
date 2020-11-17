import React from 'react';

import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import {
  getValueRoundedToDecimals,
  getThresholdValueForPercentageMetric
} from 'in-new-components/Alerting/utils/formatUtils';

/*
 * input field can represent a percentage or normal number field
 */
export default function ThresholdValueInput({
  delay = 300,
  id = 'thresholdValue',
  type = 'number',
  min = '0',
  max,
  step = '1',
  name = 'thresholdValue',
  form,
  onChange,
  trackChange,
  percentageMetric,
  ...props
}) {
  const onValueChange = targetValue => {
    const value =
      targetValue === '' ? '' : getThresholdValueForPercentageMetric(Math.abs(targetValue), percentageMetric);
    if (value > max) {
      return;
    }
    onChange?.(['threshold', 'value'], f => f.setValue(value).setTouched(true));
    trackChange?.(getTrackingObject(form, { value }));
  };

  const value = getValueRoundedToDecimals(form.get('threshold').get('value').value, percentageMetric);

  return (
    <DebouncedInput
      delay={delay}
      id={id}
      name={name}
      type={type}
      min={min}
      step={step}
      {...props}
      onValueChange={onValueChange}
      value={value ?? ''}
    />
  );
}
