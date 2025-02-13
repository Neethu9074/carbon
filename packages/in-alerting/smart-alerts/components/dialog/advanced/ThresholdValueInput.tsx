/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { CarbonNumberInput } from '@instana/components';

import { ThresholdValueInputWithValidationMessageProps } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import { shiftDecimalLeft, shiftDecimalRight } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { isNotBlank } from 'in-services/util/string';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/ThresholdCondition.mless';

const roundDecimalPlaces = 2;
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
  const onValueChange = (targetValue: number | string | null) => {
    const value = targetValue != null ? shiftDecimalLeft(targetValue, roundDecimalPlaces, percentageMetric) : null;

    if (updateForm) {
      const updatedForm = getUpdatedForm
        ? getUpdatedForm(value as any)
        : form.updateIn(['threshold', 'value'], f =>
            (f as Field<number | null>).setValue(value as any).setTouched(true)
          );

      updateForm(updatedForm);
    }
  };

  const hasError = !thresholdField?.valid && thresholdField?.touched;

  const value = shiftDecimalRight(thresholdField?.value, roundDecimalPlaces, percentageMetric);

  const mapOnChange = (_e: any, state?: { value: number | string | null; direction: string }) => {
    const stateValue = state?.value ?? value ?? 0;
    onValueChange(stateValue);
  };

  return (
    <>
      <CarbonNumberInput
        id={id}
        name={name}
        type={type}
        min={0}
        step={parseInt(step) ?? 1}
        className={classNames({
          [locals.narrowControl]: isSmall,
          [locals.numberInput]: !props.isTearSheet
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
