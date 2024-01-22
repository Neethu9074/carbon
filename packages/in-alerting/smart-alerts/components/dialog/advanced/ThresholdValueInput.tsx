/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field } from 'formalistic';
import React from 'react';

import { ThresholdValueInputWithValidationMessageProps } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import {
  getValueRoundedToDecimals,
  getThresholdValueForPercentageMetric
} from 'in-alerting/smart-alerts/components/utils/formatUtils';
//@ts-expect-error TS migration
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import { isNotBlank } from 'in-services/util/string';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/ThresholdCondition.mless';

interface ThresholdValueInputProps extends ThresholdValueInputWithValidationMessageProps {
  delay?: number;
  id?: string;
  type?: string;
  min?: string;
  step?: string;
  name?: string;
}
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
  updateForm,
  percentageMetric,
  metricUnitPostfix,
  isSmall,
  ...props
}: ThresholdValueInputProps) {
  const onValueChange = (targetValue: number | undefined) => {
    const value = targetValue ? getThresholdValueForPercentageMetric(Math.abs(targetValue), percentageMetric) : null;
    if (value && value > max) {
      return;
    }

    if (updateForm) {
      updateForm?.(
        form.updateIn(['threshold', 'value'], f => (f as Field<number | null>).setValue(value).setTouched(true))
      );
    }
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
        className={isSmall && locals.narrowControl}
        onValueChange={onValueChange}
        value={value ?? ''}
        hasError={hasError}
        pure={false}
      />
      {isNotBlank(metricUnitPostfix) && <span>{metricUnitPostfix}</span>}
    </>
  );
}
