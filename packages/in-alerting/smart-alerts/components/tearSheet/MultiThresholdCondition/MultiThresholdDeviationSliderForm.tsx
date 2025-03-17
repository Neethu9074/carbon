/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Checkbox, Stack } from '@instana/components';

import {
  updateAlertChannelSelectionOnWarningThresholdFieldChange,
  updateAlertChannelSelectionOnCriticalThresholdFieldChange
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
//@ts-expect-error TS migration
import { DebouncedSensitivitySlider } from 'in-alerting/smart-alerts/components/dialog/advanced/SensitivitySlider';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/MultiThresholdCondition/MultiThresholdDeviationSliderForm.mless';

interface MultiThresholdDeviationSliderFormProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  defaultValue: number;
}

export function MultiThresholdDeviationSliderForm({
  form,
  updateForm,
  defaultValue
}: MultiThresholdDeviationSliderFormProps) {
  const warningThresholdField = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const warningThresholdCheckBoxField = warningThresholdField.get('isCheckboxSelected');
  const criticalThresholdCheckBoxField = criticalThresholdField.get('isCheckboxSelected');
  const isWarningChecked = warningThresholdCheckBoxField?.value;
  const isCriticalChecked = criticalThresholdCheckBoxField?.value;
  const alertChannelSelection = form.get('alertChannels').value;

  useEffect(() => {
    updateAlertChannelSelectionOnWarningThresholdFieldChange(
      alertChannelSelection,
      isWarningChecked,
      isCriticalChecked,
      form,
      updateForm
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningThresholdCheckBoxField]);

  useEffect(() => {
    updateAlertChannelSelectionOnCriticalThresholdFieldChange(
      alertChannelSelection,
      isWarningChecked,
      isCriticalChecked,
      form,
      updateForm
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criticalThresholdCheckBoxField]);

  const handleCheckboxChange = (thresholdType: 'warningThreshold' | 'criticalThreshold', target: boolean) => {
    const field = form.get('threshold').get(thresholdType) as MapForm<any>;

    // Toggle the checkbox state
    const updatedForm = form.updateIn(['threshold', thresholdType], thresholdMapForm =>
      (thresholdMapForm as MapForm<any>).updateIn(['isCheckboxSelected'], item =>
        (item as Field<boolean>).setValue(target).setTouched(true)
      )
    );

    updateForm(updatedForm);

    // Set the default deviation factor if unchecked and deviationFactor is 0
    if (target && field.get('deviationFactor')?.value === 0) {
      updateForm(
        (updatedForm as MapForm<any>).updateIn(['threshold', thresholdType], thresholdMapForm =>
          (thresholdMapForm as MapForm<any>).updateIn(['deviationFactor'], item =>
            (item as Field<number>).setValue(defaultValue).setTouched(true)
          )
        )
      );
    }
  };

  const handleSliderChange = (thresholdType: 'warningThreshold' | 'criticalThreshold', value: number) => {
    updateForm(
      form.updateIn(['threshold', thresholdType], thresholdMapForm =>
        (thresholdMapForm as MapForm<any>).updateIn(['deviationFactor'], item =>
          (item as Field<number>).setValue(value).setTouched(true)
        )
      )
    );
  };

  return (
    <Stack gap="small">
      {/* threshold dropdown */}
      <div className={locals.smallDropDown}>
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
      </div>
      <Checkbox
        label={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
        size="large"
        checked={isWarningChecked}
        onChange={({ target }) => handleCheckboxChange('warningThreshold', target.checked)}
      />
      <DebouncedSensitivitySlider
        value={getFormValueOrDefault(form.get('threshold').get('warningThreshold'), 'deviationFactor', defaultValue)}
        defaultValue={defaultValue}
        onChange={(value: number) => handleSliderChange('warningThreshold', value)}
        disabled={!isWarningChecked}
      />

      <Checkbox
        label={t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')}
        size="large"
        checked={isCriticalChecked}
        onChange={({ target }) => handleCheckboxChange('criticalThreshold', target.checked)}
      />
      <DebouncedSensitivitySlider
        value={getFormValueOrDefault(form.get('threshold').get('criticalThreshold'), 'deviationFactor', defaultValue)}
        defaultValue={defaultValue}
        onChange={(value: number) => handleSliderChange('criticalThreshold', value)}
        disabled={!isCriticalChecked}
      />

      <TouchedMessages field={form.get('threshold')} />
      {t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo')}
    </Stack>
  );
}
