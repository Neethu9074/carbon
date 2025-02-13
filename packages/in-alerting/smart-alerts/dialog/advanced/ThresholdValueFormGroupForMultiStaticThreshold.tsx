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
import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForMultiStaticThreshold.mless';

interface ThresholdValueFormGroupForMultiStaticThresholdProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  maxValue: number;
  metricUnitPostfix: string;
  percentageMetric: boolean;
  hasSmallInputField?: boolean;
  isGlobalSmartAlert?: boolean;
  label?: string;
  isTearSheet?: boolean;
  showLabel?: boolean;
}

export default function ThresholdValueFormGroupForMultiStaticThreshold({
  form,
  updateForm,
  maxValue,
  metricUnitPostfix,
  percentageMetric = false,
  hasSmallInputField,
  isGlobalSmartAlert,
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdValue'),
  isTearSheet = false,
  showLabel
}: ThresholdValueFormGroupForMultiStaticThresholdProps) {
  const warningThresholdField = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const warningThresholdCheckBoxField = warningThresholdField.get('isCheckboxSelected');
  const criticalThresholdCheckBoxField = criticalThresholdField.get('isCheckboxSelected');
  const warningThresholdValuePresent = warningThresholdCheckBoxField?.value;
  const criticalThresholdValuePresent = criticalThresholdCheckBoxField?.value;
  const alertChannelSelection = form.get('alertChannels').value;

  useEffect(() => {
    updateAlertChannelSelectionOnWarningThresholdFieldChange(
      alertChannelSelection,
      warningThresholdValuePresent,
      criticalThresholdValuePresent,
      form,
      updateForm
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningThresholdCheckBoxField]);

  useEffect(() => {
    updateAlertChannelSelectionOnCriticalThresholdFieldChange(
      alertChannelSelection,
      warningThresholdValuePresent,
      criticalThresholdValuePresent,
      form,
      updateForm
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criticalThresholdCheckBoxField]);

  return (
    <ThresholdConditionFormGroup iconType="lib_threshold" label={label} isTearSheet={isTearSheet} showLabel={showLabel}>
      <div className={locals.multiThresholdContainer}>
        <Stack>
          <div className={locals.multiThresholdFieldContainer}>
            <Checkbox
              label={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
              size="large"
              checked={warningThresholdValuePresent}
              onChange={() =>
                updateForm(updatedThresholdCheckboxSelection(warningThresholdValuePresent, 'warningThreshold'))
              }
            />
            <ThresholdValueInputWithValidationMessage
              max={maxValue}
              form={form}
              updateForm={updateForm}
              percentageMetric={percentageMetric}
              metricUnitPostfix={metricUnitPostfix}
              isSmall={hasSmallInputField}
              isTearSheet={isTearSheet}
              thresholdField={warningThresholdField.get('value')}
              getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
              isMultiThreshold
              id="warningThreshold"
            />

            <UseSuggestedValueButton
              form={form}
              updateForm={updateForm}
              metricUnitPostfix={metricUnitPostfix}
              percentageMetric={percentageMetric}
              thresholdField={warningThresholdField.get('value')}
              isMultiThreshold
              isGlobalSmartAlert={isGlobalSmartAlert}
              getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
              isTearSheet={isTearSheet}
            />
          </div>
          <div className={locals.multiThresholdFieldContainer}>
            <Checkbox
              label={t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')}
              size="large"
              checked={criticalThresholdValuePresent}
              onChange={() =>
                updateForm(updatedThresholdCheckboxSelection(criticalThresholdValuePresent, 'criticalThreshold'))
              }
            />
            <ThresholdValueInputWithValidationMessage
              max={maxValue}
              form={form}
              updateForm={updateForm}
              percentageMetric={percentageMetric}
              metricUnitPostfix={metricUnitPostfix}
              isSmall={hasSmallInputField}
              isTearSheet={isTearSheet}
              thresholdField={criticalThresholdField.get('value')}
              getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'criticalThreshold')}
              isMultiThreshold
              id="criticalThreshold"
            />
          </div>
          <TouchedMessages field={form.get('threshold')} />
          <span>{t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo')}</span>
        </Stack>
      </div>
    </ThresholdConditionFormGroup>
  );

  function updatedThresholdValue(targetValue: number | null, thresholdType: string) {
    return form
      .updateIn(['threshold', thresholdType], thresholdMapForm =>
        (thresholdMapForm as MapForm<any>).updateIn(['value'], item =>
          (item as Field<any>).setValue(targetValue).setTouched(true)
        )
      )
      .updateIn(['threshold', thresholdType], thresholdMapForm =>
        (thresholdMapForm as MapForm<any>).updateIn(['isCheckboxSelected'], item =>
          (item as Field<any>).setValue(targetValue === null ? false : true).setTouched(true)
        )
      );
  }

  function updatedThresholdCheckboxSelection(isChecked: boolean, thresholdType: string) {
    return updatedThresholdValue(isChecked ? null : 0, thresholdType);
  }
}
