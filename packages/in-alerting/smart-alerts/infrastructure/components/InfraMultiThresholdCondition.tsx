/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Checkbox, Stack, SvgIcon } from '@instana/components';

import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import {
  getMaxMetricValue,
  getThresholdTypeOptions
} from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/components/InfraMultiThresholdCondition.mless';

interface InfraMultiThresholdConditionProps {
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
}: InfraMultiThresholdConditionProps) {
  const maxValue = getMaxMetricValue(percentageMetric);
  const thresholdType = getThresholdTypeOptions();
  const warningThresholdField = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const warningThresholdValue = warningThresholdField.get('value').value;
  const criticalThresholdValue = criticalThresholdField.get('value').value;
  const warningThresholdValuePresent = !isEmpty(warningThresholdValue);
  const criticalThresholdValuePresent = !isEmpty(criticalThresholdValue);

  return (
    <div className={locals.gridWrapper}>
      <SvgIcon className={locals.icon} type="lib_alerting_threshold_icon" />
      <span className={locals.label}>{t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')}</span>
      <div>
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
        <span>{thresholdType[0].label}</span>
      </div>

      <span />
      <Checkbox
        className={locals.thresholdCheckbox}
        label={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
        size="large"
        checked={warningThresholdValuePresent}
        disabled={!warningThresholdValuePresent}
        onChange={() => updateForm(updatedThresholdCheckboxSelection(warningThresholdValuePresent, 'warningThreshold'))}
      />
      <div className={locals.content}>
        <ThresholdValueInputWithValidationMessage
          max={maxValue}
          form={form}
          updateForm={updateForm}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
          thresholdField={warningThresholdField.get('value')}
          getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
          isMultiThreshold
        />

        {!groupBy?.length && (
          <UseSuggestedValueButton
            form={form}
            updateForm={updateForm}
            metricUnitPostfix={metricUnitPostfix}
            percentageMetric={percentageMetric}
            thresholdField={warningThresholdField.get('value')}
            isMultiThreshold
            getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
          />
        )}
      </div>

      <span />
      <Checkbox
        className={locals.thresholdCheckbox}
        label={t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')}
        size="large"
        checked={criticalThresholdValuePresent}
        disabled={!criticalThresholdValuePresent}
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
      />

      <span />
      <span />
      <Stack direction="vertical" gap="small">
        <TouchedMessages field={form.get('threshold')} />

        <span>{t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo')}</span>
      </Stack>
    </div>
  );

  function updatedThresholdValue(targetValue: number | null, thresholdType: string) {
    return form.updateIn(['threshold', thresholdType], thresholdMapForm =>
      (thresholdMapForm as MapForm<any>).updateIn(['value'], item =>
        (item as Field<any>).setValue(targetValue).setTouched(true)
      )
    );
  }

  function updatedThresholdCheckboxSelection(isChecked: boolean, thresholdType: string) {
    if (isChecked) {
      return updatedThresholdValue(null, thresholdType);
    }
    return form;
  }
}
