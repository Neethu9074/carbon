/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import { t } from 'in-i18n';

interface ThresholdValueFormGroupForStaticThresholdProps {
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

export default function ThresholdValueFormGroupForStaticThreshold({
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
}: ThresholdValueFormGroupForStaticThresholdProps) {
  return (
    <ThresholdConditionFormGroup iconType="lib_threshold" label={label} isTearSheet={isTearSheet} showLabel={showLabel}>
      <ThresholdValueInputWithValidationMessage
        max={maxValue}
        form={form}
        updateForm={updateForm}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
        isSmall={hasSmallInputField}
        isTearSheet={isTearSheet}
      />
      {isTearSheet && <Spacer horizontal="normal" />}
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
