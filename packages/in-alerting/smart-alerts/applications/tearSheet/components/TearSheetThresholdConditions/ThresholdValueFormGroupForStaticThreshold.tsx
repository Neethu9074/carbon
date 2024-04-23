/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdConditionFormGroup';
import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep4.mless';

interface ThresholdValueFormGroupForStaticThresholdProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  maxValue: number;
  metricUnitPostfix: string;
  percentageMetric: boolean;
  hasSmallInputField: boolean;
  isGlobalSmartAlert: boolean;
  label: string;
}

export default function ThresholdValueFormGroupForStaticThreshold({
  form,
  updateForm,
  maxValue,
  metricUnitPostfix,
  percentageMetric = false,
  hasSmallInputField,
  isGlobalSmartAlert,
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdValue')
}: ThresholdValueFormGroupForStaticThresholdProps) {
  return (
    <ThresholdConditionFormGroup label={label}>
      <div className={locals.thresholdValue}>
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
      </div>
    </ThresholdConditionFormGroup>
  );
}
