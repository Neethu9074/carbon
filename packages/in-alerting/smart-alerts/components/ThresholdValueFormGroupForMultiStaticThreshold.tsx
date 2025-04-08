/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Checkbox, Spacer, Stack } from '@instana/components';

import {
  updateAlertChannelSelectionOnWarningThresholdFieldChange,
  updateAlertChannelSelectionOnCriticalThresholdFieldChange
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from './ThresholdValueFormGroupForMultiStaticThreshold.mless';

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
  const warningThresholdValue = warningThresholdField.get('value').value;
  const criticalThresholdValue = criticalThresholdField.get('value').value;
  const warningThresholdValuePresent = !isEmpty(warningThresholdValue);
  const criticalThresholdValuePresent = !isEmpty(criticalThresholdValue);
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

  const UseSuggestionButton = (
    <UseSuggestedValueButton
      form={form}
      updateForm={updateForm}
      metricUnitPostfix={metricUnitPostfix}
      percentageMetric={percentageMetric}
      thresholdField={warningThresholdField.get('value')}
      isMultiThreshold
      isGlobalSmartAlert={isGlobalSmartAlert}
      getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
    />
  );

  return (
    <ThresholdConditionFormGroup iconType="lib_threshold" label={label} isTearSheet={isTearSheet} showLabel={showLabel}>
      <Stack direction="vertical" gap="normal">
        <Spacer size="normal" />
        <Stack direction="horizontal" gap="normal" align="center">
          {/*warning threshold */}
          <div className={locals.checkboxWidth}>
            <Checkbox
              label={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
              size="large"
              checked={warningThresholdValuePresent}
              onChange={() =>
                updateForm(updatedThresholdCheckboxSelection(warningThresholdValuePresent, 'warningThreshold'))
              }
            />
          </div>
          <ThresholdValueInputWithValidationMessage
            max={maxValue}
            form={form}
            updateForm={updateForm}
            percentageMetric={percentageMetric}
            metricUnitPostfix={metricUnitPostfix}
            isSmall={hasSmallInputField && !isTearSheet}
            isTearSheet={isTearSheet}
            thresholdField={warningThresholdField.get('value')}
            getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
            isMultiThreshold
            id="warningThreshold"
          />
          {/* suggestion button for dialog view*/}
          {!isTearSheet && UseSuggestionButton}
        </Stack>
        {/* suggestion button for tearSheet view*/}
        {isTearSheet && (
          <Stack direction="horizontal" gap="normal" align="center">
            <div className={locals.leftSpace}>
              <Spacer horizontal="large" />
            </div>

            {UseSuggestionButton}
          </Stack>
        )}

        {/* critical threshold */}
        <Stack direction="horizontal" gap="normal" align="center">
          <div className={locals.checkboxWidth}>
            <Checkbox
              label={t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')}
              size="large"
              checked={criticalThresholdValuePresent}
              onChange={() =>
                updateForm(updatedThresholdCheckboxSelection(criticalThresholdValuePresent, 'criticalThreshold'))
              }
            />
          </div>
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
        </Stack>
        {/* Validation message if critical threshold is > warning threshold */}
        <TouchedMessages field={form.get('threshold')} />

        {/* Info message */}
        <span>{t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo')}</span>
        <Spacer size="normal" />
      </Stack>
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
