/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import ThresholdValueInput from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueInput';
import TouchedMessages from 'in-components/form/TouchedMessages';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/ThresholdCondition.mless';

export interface ThresholdValueInputWithValidationMessageProps {
  max: number;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric: boolean;
  metricUnitPostfix: string;
  isSmall?: boolean;
}

export default function ThresholdValueInputWithValidationMessage(props: ThresholdValueInputWithValidationMessageProps) {
  const thresholdField = props.form?.get('threshold')?.get('value');
  return (
    <div className={locals.thresholdValueWithValidationMessage}>
      <ThresholdValueInput {...props} />
      <TouchedMessages field={thresholdField} />
    </div>
  );
}
