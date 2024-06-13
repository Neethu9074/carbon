/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error TS migration
import { DebouncedSensitivitySlider } from 'in-alerting/smart-alerts/components/dialog/advanced/SensitivitySlider';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { t } from 'in-i18n';

interface ThresholdDeviationSliderFormProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  defaultValue: number;
  isTearSheet?: boolean;
}

export function ThresholdDeviationSliderForm({
  form,
  updateForm,
  defaultValue,
  isTearSheet
}: ThresholdDeviationSliderFormProps) {
  return (
    <ThresholdConditionFormGroup
      iconType="lib_threshold"
      label={t('in-alerting:smartAlerts.components.smartAlertDialog.labelSensitivity')}
      isTearSheet={isTearSheet}
    >
      <DebouncedSensitivitySlider
        value={getFormValueOrDefault(form.get('threshold'), 'deviationFactor', '')}
        defaultValue={defaultValue}
        onChange={(value: number) => {
          updateForm(
            form.updateIn(['threshold', 'deviationFactor'], f => (f as Field<number>).setValue(value).setTouched(true))
          );
        }}
      />
    </ThresholdConditionFormGroup>
  );
}
