/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import SlownessInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/SlownessInteractiveChart';
import { someSlownessFormData } from 'in-alerting/smart-alerts/applications/advanced/stories/formSampleData';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default {
  component: SlownessInteractiveChart
};

export function WithStaticThreshold() {
  const [form, setForm] = useState(
    createSmartAlertForm({
      ...someSlownessFormData,
      threshold: {
        type: STATIC_THRESHOLD
      }
    })
  );

  const props = {
    form,
    onChange: (path, fn) => setForm(form.updateIn(path, fn)),
    blueprintConfig: getBlueprintConfig('slowness'),
    updateForm: setForm
  };
  return <SlownessInteractiveChart {...props} />;
}

export function WithHistoricBaseline() {
  const [form, setForm] = useState(createSmartAlertForm(someSlownessFormData));

  const props = {
    form,
    onChange: (path, fn) => setForm(form.updateIn(path, fn)),
    blueprintConfig: getBlueprintConfig('slowness'),
    updateForm: setForm
  };
  return <SlownessInteractiveChart {...props} />;
}
