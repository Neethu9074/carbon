/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import ConfigureAlertingThreshold from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { createSmartAlertForm, defaultGranularity } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';

export default {
  component: ConfigureAlertingThreshold
};

export const Default = props => {
  const timeThresholdConfig = {
    type: 'userImpactOfViolationsInSequence'
  };

  const alertConfig = {};
  const [form, updateForm] = useState(
    createSmartAlertForm(alertConfig, false).put(
      'timeThreshold',
      createTimeThresholdForm(timeThresholdConfig, alertConfig.granularity ?? defaultGranularity)
    )
  );

  return (
    <ConfigureAlertingThreshold
      {...props}
      form={form}
      updateForm={updateForm}
      onChange={(path, fn) => {
        updateForm(form.updateIn(path, fn));
      }}
    />
  );
};

Default.args = {};
