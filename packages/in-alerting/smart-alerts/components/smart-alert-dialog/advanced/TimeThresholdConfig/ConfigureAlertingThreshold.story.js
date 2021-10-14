/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import ConfigureAlertingThreshold from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';

export default {
  component: ConfigureAlertingThreshold
};

export const Default = props => {
  const timeThresholdConfig = {
    type: 'userImpactOfViolationsInSequence'
  };

  const [form, updateForm] = useState(
    createSmartAlertForm({}, false).put('timeThreshold', createTimeThresholdForm(timeThresholdConfig))
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
