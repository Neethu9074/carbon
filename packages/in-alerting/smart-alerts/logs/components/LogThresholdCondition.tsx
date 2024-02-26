/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

export default function LogThresholdCondition({
  form,
  updateForm,
  percentageMetric,
  metricUnitPostfix
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric: boolean;
  metricUnitPostfix: string;
}) {
  const maxValue = Number.MAX_SAFE_INTEGER;
  const thresholdType = {
    value: STATIC_THRESHOLD,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')
  };
  return (
    <>
      <ThresholdConditionFormGroup>
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
        <span>{thresholdType.label}</span>
      </ThresholdConditionFormGroup>

      <ThresholdConditionFormGroup
        iconType="lib_threshold"
        label={t('in-alerting:smartAlerts.logs.advancedModeContainer.thresholdValue')}
      >
        <ThresholdValueInputWithValidationMessage
          max={maxValue}
          form={form}
          updateForm={updateForm}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
        />
      </ThresholdConditionFormGroup>
    </>
  );
}
