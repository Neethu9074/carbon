/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import SlownessThresholdCondition from 'in-alerting/smart-alerts/applications/dialog/advanced/SlownessThresholdCondition';
import { someSlownessFormData } from 'in-alerting/smart-alerts/applications/dialog/advanced/stories/formSampleData';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default {
  component: SlownessThresholdCondition
};

const blueprintConfig = getBlueprintConfig('slowness');

export function WithStaticThreshold() {
  const [form, updateForm] = useState(
    createSmartAlertForm({
      ...someSlownessFormData,
      threshold: {
        type: STATIC_THRESHOLD
      }
    })
  );

  const props = {
    form,
    blueprintConfig,
    updateForm
  };
  return <SlownessThresholdCondition {...props} />;
}

export function WithHistoricBaseline() {
  const [form, updateForm] = useState(createSmartAlertForm(someSlownessFormData));

  const props = {
    form,
    updateForm,
    blueprintConfig
  };
  return <SlownessThresholdCondition {...props} />;
}
