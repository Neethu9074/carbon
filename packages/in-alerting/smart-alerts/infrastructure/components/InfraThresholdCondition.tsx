/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import {
  getMaxMetricValue,
  getThresholdTypeOptions
} from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import { t } from 'in-i18n';

interface InfraThresholdConditionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric: boolean;
  metricUnitPostfix: string;
  groupBy?: any;
}

export default function InfraThresholdCondition({
  form,
  updateForm,
  percentageMetric,
  metricUnitPostfix,
  groupBy
}: InfraThresholdConditionProps) {
  const maxValue = getMaxMetricValue(percentageMetric);
  const thresholdType = getThresholdTypeOptions();
  return (
    <>
      <ThresholdConditionFormGroup>
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
        <span>{thresholdType[0].label}</span>
      </ThresholdConditionFormGroup>

      <ThresholdConditionFormGroup
        iconType="lib_threshold"
        label={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.thresholdValue')}
      >
        <ThresholdValueInputWithValidationMessage
          max={maxValue}
          form={form}
          updateForm={updateForm}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
        />
        {!groupBy?.length && (
          <UseSuggestedValueButton
            form={form}
            updateForm={updateForm}
            metricUnitPostfix={metricUnitPostfix}
            percentageMetric={percentageMetric}
          />
        )}
      </ThresholdConditionFormGroup>
    </>
  );
}
