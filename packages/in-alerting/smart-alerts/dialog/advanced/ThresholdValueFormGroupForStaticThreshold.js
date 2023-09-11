/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import { t } from 'in-i18n';

export default function ThresholdValueFormGroupForStaticThreshold({
  form,
  updateForm,
  maxValue,
  metricUnitPostfix,
  percentageMetric = false,
  hasSmallInputField,
  isGlobalSmartAlert,
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdValue')
}) {
  return (
    <ThresholdConditionFormGroup iconType="lib_threshold" label={label}>
      <ThresholdValueInputWithValidationMessage
        max={maxValue}
        form={form}
        updateForm={updateForm}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
        isSmall={hasSmallInputField}
      />
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
