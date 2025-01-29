/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import { isNaN } from 'lodash';
import React from 'react';

import { CarbonNumberInput } from '@instana/components';

import { ThresholdValueInputWithValidationMessageProps } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import {
  getValueRoundedToDecimals,
  getThresholdValueForPercentageMetric
} from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { isNotBlank } from 'in-services/util/string';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/ThresholdCondition.mless';

interface ThresholdValueInputProps extends ThresholdValueInputWithValidationMessageProps {
  delay?: number;
  id?: string;
  type?: string;
  min?: string;
  step?: string;
  name?: string;
  thresholdField?: Field<any>;
  getUpdatedForm?: (targetValue: number | null) => MapForm<any>;
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
  thresholdField = form?.get('threshold')?.get('value'),
  getUpdatedForm,
  ...props
}: ThresholdValueInputProps) {
  const onValueChange = (targetValue: number | null) => {
    const value = targetValue ? getThresholdValueForPercentageMetric(Math.abs(targetValue), percentageMetric) : null;
    if ((value && value > max) || isNaN(value)) {
      return;
    }

    if (updateForm) {
      const updatedForm = getUpdatedForm
        ? getUpdatedForm(value)
        : form.updateIn(['threshold', 'value'], f => (f as Field<number | null>).setValue(value).setTouched(true));

      updateForm(updatedForm);
    }
  };

  const hasError = !thresholdField?.valid && thresholdField?.touched;

  const value = getValueRoundedToDecimals(thresholdField?.value, percentageMetric);

  const mapOnChange = (_e: any, state?: { value: number | string; direction: string }) => {
    const stateValue = state?.value ?? value ?? 0;
    onValueChange(Number(stateValue));
  };

  return (
    <>
      <CarbonNumberInput
        id={id}
        name={name}
        type={type}
        min={Number(min)}
        step={parseInt(step) ?? 1}
        className={classNames({
          [locals.narrowControl]: isSmall,
          [locals.inputMd]: props.isTearSheet,
          [locals.numberInput]: true
        })}
        value={value ?? ''}
        invalid={hasError}
        allowEmpty
        onChange={mapOnChange}
      />
      {isNotBlank(metricUnitPostfix) && <span>{metricUnitPostfix}</span>}
    </>
  );
}
