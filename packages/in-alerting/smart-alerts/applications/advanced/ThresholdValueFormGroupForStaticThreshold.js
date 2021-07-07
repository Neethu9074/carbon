/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import { applicationsAlertingThresholdValueChanged } from 'in-alerting/smart-alerts/applications/tracker';
import { t } from 'in-i18n';

export default function ThresholdValueFormGroupForStaticThreshold({
  form,
  updateForm,
  maxValue,
  metricUnitPostfix,
  onChange,
  percentageMetric = false,
  thresholdValueInputClassName,
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdValue')
}) {
  return (
    <ThresholdConditionFormGroup iconType="lib_threshold" label={label}>
      <ThresholdValueInput
        max={maxValue}
        form={form}
        updateForm={updateForm}
        trackChange={applicationsAlertingThresholdValueChanged}
        metricUnitPostfix={metricUnitPostfix}
        className={thresholdValueInputClassName}
        percentageMetric={percentageMetric}
      />
      <UseSuggestedValueButton
        form={form}
        onChange={onChange}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
      />
    </ThresholdConditionFormGroup>
  );
}
