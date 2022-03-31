/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import { applicationsAlertingThresholdValueChanged } from 'in-alerting/smart-alerts/applications/tracker';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/ThresholdCondition.mless';

export default function ThresholdValueFormGroupForStaticThreshold({
  form,
  updateForm,
  maxValue,
  metricUnitPostfix,
  percentageMetric = false,
  thresholdValueInputClassName,
  isGlobalSmartAlert,
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdValue')
}) {
  const thresholdField = form.get('threshold').get('value');

  return (
    <ThresholdConditionFormGroup iconType="lib_threshold" label={label}>
      <div className={locals.thresholdValueWithValidationMessage}>
        <ThresholdValueInput
          max={maxValue}
          form={form}
          updateForm={updateForm}
          trackChange={applicationsAlertingThresholdValueChanged}
          metricUnitPostfix={metricUnitPostfix}
          className={thresholdValueInputClassName}
          percentageMetric={percentageMetric}
        />
        <TouchedMessages field={thresholdField} />
      </div>
      <UseSuggestedValueButton
        form={form}
        updateForm={updateForm}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
        isGlobalSmartAlert={isGlobalSmartAlert}
      />
    </ThresholdConditionFormGroup>
  );
}
