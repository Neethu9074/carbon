/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Checkbox, Spacer, Stack } from '@instana/components';

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
  percentageMetric: boolean;
  metricUnitPostfix: string;
  groupBy?: any;
}

export default function InfraMultiThresholdCondition({
  form,
  updateForm,
  percentageMetric,
  metricUnitPostfix,
  groupBy
}: MultiThresholdConditionProps) {
  const maxValue = getMaxMetricValue(percentageMetric);
  const warningThresholdField = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const warningThresholdValue = warningThresholdField.get('value').value;
  const criticalThresholdValue = criticalThresholdField.get('value').value;
  const warningThresholdValuePresent = !isEmpty(warningThresholdValue);
  const criticalThresholdValuePresent = !isEmpty(criticalThresholdValue);

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
            thresholdField={warningThresholdField.get('value')}
            getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
            isMultiThreshold
            id="warningThreshold"
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
                thresholdField={warningThresholdField.get('value')}
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
            thresholdField={criticalThresholdField.get('value')}
            getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'criticalThreshold')}
            isMultiThreshold
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
    return form.updateIn(['threshold', thresholdType], thresholdMapForm =>
      (thresholdMapForm as MapForm<any>).updateIn(['value'], item =>
        (item as Field<any>).setValue(targetValue).setTouched(true)
      )
    );
  }

  function updatedThresholdCheckboxSelection(isChecked: boolean, thresholdType: string) {
    return updatedThresholdValue(isChecked ? null : 0, thresholdType);
  }
}
