/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import SlownessInteractiveChart from 'in-applications/alerting/advanced/SlownessInteractiveChart';
import { createSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
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
