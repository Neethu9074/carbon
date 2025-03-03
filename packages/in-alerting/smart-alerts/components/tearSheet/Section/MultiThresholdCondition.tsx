/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Checkbox, Spacer, Stack } from '@instana/components';

import {
  updateAlertChannelSelectionOnWarningThresholdFieldChange,
  updateAlertChannelSelectionOnCriticalThresholdFieldChange
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import { getMaxMetricValue } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from './MultiThresholdCondition.mless';

interface MultiThresholdConditionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric?: boolean;
  metricUnitPostfix: string;
  groupBy?: any;
  alertChannelPerSeverityEnabled?: boolean;
  max?: number;
}

export default function MultiThresholdCondition({
  form,
  updateForm,
  percentageMetric = false,
  metricUnitPostfix,
  groupBy = [],
  alertChannelPerSeverityEnabled,
  max
}: MultiThresholdConditionProps) {
  const maxValue = max ?? getMaxMetricValue(percentageMetric);
  const warningThresholdValueField = form.get('threshold')?.get('warningThreshold')?.get('value');
  const criticalThresholdValueField = form.get('threshold')?.get('criticalThreshold')?.get('value');
  const warningThresholdValue = warningThresholdValueField?.value;
  const criticalThresholdValue = criticalThresholdValueField?.value;
  const warningThresholdValuePresent = !isEmpty(warningThresholdValue);
  const criticalThresholdValuePresent = !isEmpty(criticalThresholdValue);

  const alertChannelSelection = form.get('alertChannels').value;
  useEffect(() => {
    if (alertChannelPerSeverityEnabled) {
      updateAlertChannelSelectionOnWarningThresholdFieldChange(
        alertChannelSelection,
        warningThresholdValuePresent,
        criticalThresholdValuePresent,
        form,
        updateForm
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningThresholdValueField]);

  useEffect(() => {
    if (alertChannelPerSeverityEnabled) {
      updateAlertChannelSelectionOnCriticalThresholdFieldChange(
        alertChannelSelection,
        warningThresholdValuePresent,
        criticalThresholdValuePresent,
        form,
        updateForm
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criticalThresholdValueField]);

  return (
    <>
      <Stack direction="vertical" gap="small">
        {/* threshold dropdown */}
        <div className={locals.smallDropDown}>
          <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
        </div>
        {/* warning threshold */}
        <div className={locals.wrapper}>
          <Checkbox
            label={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
            size="large"
            checked={warningThresholdValuePresent}
            onChange={() => {
              updateForm(updatedThresholdCheckboxSelection(warningThresholdValuePresent, 'warningThreshold'));
            }}
          />
          <ThresholdValueInputWithValidationMessage
            max={maxValue}
            form={form}
            updateForm={updateForm}
            percentageMetric={percentageMetric}
            metricUnitPostfix={metricUnitPostfix}
            thresholdField={warningThresholdValueField}
            getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
            isMultiThreshold
            id="warningThreshold"
            isTearSheet
          />
        </div>
        {/* threshold suggestion for warning threshold */}
        {!groupBy?.length && (
          <div className={locals.wrapper}>
            <Spacer />
            <Stack direction="horizontal">
              <UseSuggestedValueButton
                form={form}
                updateForm={updateForm}
                metricUnitPostfix={metricUnitPostfix}
                percentageMetric={percentageMetric}
                thresholdField={warningThresholdValueField}
                getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
                isMultiThreshold
                isTearSheet
              />
            </Stack>
          </div>
        )}
        {/* critical threshold */}
        <div className={locals.wrapper}>
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
            thresholdField={criticalThresholdValueField}
            getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'criticalThreshold')}
            isMultiThreshold
            isTearSheet
            id="criticalThreshold"
          />
        </div>
        {/* validation and threshold notification message */}
        <Stack direction="vertical" gap="small">
          <TouchedMessages field={form.get('threshold')} />
          <span>{t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo')}</span>
        </Stack>
      </Stack>
    </>
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
