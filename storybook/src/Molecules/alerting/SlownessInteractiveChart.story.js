/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import SlownessInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/SlownessInteractiveChart';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { someSlownessFormData } from './formSampleData';

export default {
  title: 'Molecules|alerting/interactiveCharts/SlownessInteractiveChart',
  component: SlownessInteractiveChart
};

export function SlownessInteractiveChart_simple() {
  const [form, setForm] = useState(createSmartAlertForm(someSlownessFormData));

  let props = {
    form,
    onChange: (path, fn) => setForm(form.updateIn(path, fn)),
    blueprintConfig: getBlueprintConfig('slowness'),
    updateForm: setForm
  };
  return <SlownessInteractiveChart {...props} />;
}
