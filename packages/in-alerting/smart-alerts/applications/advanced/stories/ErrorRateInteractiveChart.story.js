/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import ErrorRateThresholdCondition from 'in-alerting/smart-alerts/applications/advanced/ErrorRateThresholdCondition';
import { someErrorRateFormData } from 'in-alerting/smart-alerts/applications/advanced/stories/formSampleData';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';

export default {
  parameters: {
    // Error: Evaluation failed: TypeError: (void 0) is not a function
    chromatic: { disable: true }
  },
  component: ErrorRateThresholdCondition
};

export const ThresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someErrorRateFormData()));

  return (
    <ErrorRateThresholdCondition form={form} updateForm={setForm} blueprintConfig={getBlueprintConfig('errorRate')} />
  );
};
