/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import ErrorRateThresholdCondition from 'in-alerting/smart-alerts/applications/dialog/advanced/ErrorRateThresholdCondition';
import { someErrorRateFormData } from 'in-alerting/smart-alerts/applications/dialog/advanced/stories/formSampleData';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';

export default {
  component: ErrorRateThresholdCondition
};

export const ThresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someErrorRateFormData()));

  return (
    <ErrorRateThresholdCondition form={form} updateForm={setForm} blueprintConfig={getBlueprintConfig('errorRate')} />
  );
};
