/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import LogsInteractiveChart, {
  ThresholdCondition
} from 'in-alerting/smart-alerts/applications/advanced/LogsInteractiveChart';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { someLogsFormData } from './formSampleData';

export default {
  title: 'Molecules|alerting/LogsInteractiveChart',
  component: ThresholdCondition
};

export const thresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someLogsFormData()));

  return (
    <ThresholdCondition
      form={form}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      blueprintConfig={getBlueprintConfig('logs')}
    />
  );
};

export function LogsInteractiveChart_with_empty_message() {
  const formData = someLogsFormData();
  formData.rule.message = '';
  const [form, setForm] = useState(createSmartAlertForm(formData));

  let props = {
    form,
    onChange: (path, fn) => setForm(form.updateIn(path, fn)),
    blueprintConfig: getBlueprintConfig('logs')
  };
  return <LogsInteractiveChart {...props} />;
}
export function LogsInteractiveChart_simple() {
  const [form, setForm] = useState(createSmartAlertForm(someLogsFormData()));

  let props = {
    form,
    onChange: (path, fn) => setForm(form.updateIn(path, fn)),
    blueprintConfig: getBlueprintConfig('logs')
  };
  return <LogsInteractiveChart {...props} />;
}
