/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getValueRoundedToDecimals,
  getThresholdValueForPercentageMetric
} from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import { isNotBlank } from 'in-services/util/string';

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
  metricUnitPostfix,
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
      updateForm?.(form.updateIn(['threshold', 'value'], f => f.setValue(value).setTouched(true)));
    }

    trackChange?.(getTrackingObject(form, { value }));
  };

  const thresholdField = form.get('threshold').get('value');
  const hasError = !thresholdField.valid && thresholdField.touched;
  const value = getValueRoundedToDecimals(thresholdField.value, percentageMetric);

  return (
    <>
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
        hasError={hasError}
        pure={false}
      />
      {isNotBlank(metricUnitPostfix) && <span>{metricUnitPostfix}</span>}
    </>
  );
}
