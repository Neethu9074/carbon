/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';

interface ThresholdValueFormGroupForStaticThresholdProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  maxValue: number;
  metricUnitPostfix: string;
  percentageMetric: boolean;
  hasSmallInputField?: boolean;
  isGlobalSmartAlert?: boolean;
}

export default function ThresholdValueFormGroupForStaticThreshold({
  form,
  updateForm,
  maxValue,
  metricUnitPostfix,
  percentageMetric = false,
  hasSmallInputField,
  isGlobalSmartAlert
}: ThresholdValueFormGroupForStaticThresholdProps) {
  return (
    <Stack direction="horizontal" gap="small">
      <ThresholdValueInputWithValidationMessage
        max={maxValue}
        form={form}
        updateForm={updateForm}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
        isSmall={hasSmallInputField}
        isTearSheet
      />

      <UseSuggestedValueButton
        form={form}
        updateForm={updateForm}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
        isGlobalSmartAlert={isGlobalSmartAlert}
      />
    </Stack>
  );
}
