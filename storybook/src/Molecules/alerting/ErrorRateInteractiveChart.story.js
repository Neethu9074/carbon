/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import ErrorRateThresholdCondition from 'in-alerting/smart-alerts/applications/advanced/ErrorRateThresholdCondition';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { someErrorRateFormData } from './formSampleData';

export default {
  title: 'Molecules|alerting/interactiveCharts/ErrorRateInteractiveChart',
  parameters: {
    // Error: Evaluation failed: TypeError: (void 0) is not a function
    chromatic: { disable: true }
  },
  component: ErrorRateThresholdCondition
};

export const thresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someErrorRateFormData()));

  return (
    <ErrorRateThresholdCondition
      form={form}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      blueprintConfig={getBlueprintConfig('errorRate')}
    />
  );
};
