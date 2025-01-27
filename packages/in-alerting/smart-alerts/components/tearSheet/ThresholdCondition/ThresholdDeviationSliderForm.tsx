/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error TS migration
import { DebouncedSensitivitySlider } from 'in-alerting/smart-alerts/components/dialog/advanced/SensitivitySlider';
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';

interface ThresholdDeviationSliderFormProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  defaultValue: number;
}

export function ThresholdDeviationSliderForm({ form, updateForm, defaultValue }: ThresholdDeviationSliderFormProps) {
  return (
    <DebouncedSensitivitySlider
      value={getFormValueOrDefault(form.get('threshold'), 'deviationFactor', '')}
      defaultValue={defaultValue}
      onChange={(value: number) => {
        updateForm(
          form.updateIn(['threshold', 'deviationFactor'], f => (f as Field<number>).setValue(value).setTouched(true))
        );
      }}
    />
  );
}
