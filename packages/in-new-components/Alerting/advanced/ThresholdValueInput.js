/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  getValueRoundedToDecimals,
  getThresholdValueForPercentageMetric
} from 'in-new-components/Alerting/utils/formatUtils';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import DebouncedInput from 'in-components/form/Input/DebouncedInput';

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
  updateForm,
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

    if (!updateForm) {
      onChange?.(['threshold', 'value'], f => f.setValue(value).setTouched(true));
    }

    if (!onChange) {
      updateForm?.(
        form
          .updateIn(['threshold', 'value'], f => f.setValue(value).setTouched(true))
          .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
          .updateIn(['hiddenFields', 'thresholdValueManuallyChanged'], f => f.setValue(true))
      );
    }

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
