/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import { ThresholdCondition } from 'in-applications/alerting/advanced/ErrorRateInteractiveChart';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { createSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';
import { someErrorRateFormData } from './formSampleData';

export default {
  title: 'Molecules|alerting/interactiveCharts/ErrorRateInteractiveChart',
  parameters: {
    // Error: Evaluation failed: TypeError: (void 0) is not a function
    chromatic: { disable: true }
  },
  component: ThresholdCondition
};

export const thresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someErrorRateFormData()));

  return (
    <ThresholdCondition
      form={form}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      blueprintConfig={getBlueprintConfig('errorRate')}
    />
  );
};
