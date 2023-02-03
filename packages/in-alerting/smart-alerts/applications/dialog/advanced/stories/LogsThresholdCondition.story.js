/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import LogsThresholdCondition from 'in-alerting/smart-alerts/applications/dialog/advanced/LogsThresholdCondition';
import { someLogsFormData } from 'in-alerting/smart-alerts/applications/dialog/advanced/stories/formSampleData';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';

export default {
  component: LogsThresholdCondition
};

const blueprintConfig = getBlueprintConfig('logs');

export const Default = () => {
  const [form, setForm] = useState(createSmartAlertForm(someLogsFormData()));

  return <LogsThresholdCondition form={form} updateForm={setForm} blueprintConfig={blueprintConfig} />;
};

export function WithEmptyMessage() {
  const formData = someLogsFormData();
  formData.rule.message = '';
  const [form, updateForm] = useState(createSmartAlertForm(formData));

  const props = {
    form,
    updateForm,
    blueprintConfig
  };
  return <LogsThresholdCondition {...props} />;
}

export function WithEditMode() {
  const [form, updateForm] = useState(createSmartAlertForm(someLogsFormData()));

  const props = {
    editMode: true,
    form,
    updateForm,
    blueprintConfig
  };
  return <LogsThresholdCondition {...props} />;
}
