/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import ConfigureAlertingThreshold from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import { createSmartAlertForm, defaultGranularity } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';

export default {
  component: ConfigureAlertingThreshold
};

export const Default = props => {
  const timeThresholdConfig = {
    userPercentage: 1,
    type: 'userImpactOfViolationsInSequence'
  };

  const alertConfig = {};
  const [form, updateForm] = useState(
    createSmartAlertForm(alertConfig).put(
      'timeThreshold',
      createTimeThresholdForm(timeThresholdConfig, defaultGranularity)
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

export const Requests = () => {
  const timeThresholdConfig = {
    type: 'requestImpact'
  };

  const alertConfig = {};
  const [form, updateForm] = useState(
    createSmartAlertForm(alertConfig).put(
      'timeThreshold',
      createTimeThresholdForm(timeThresholdConfig, defaultGranularity)
    )
  );

  return (
    <ConfigureAlertingThreshold
      form={form}
      updateForm={updateForm}
      onChange={(path, fn) => {
        updateForm(form.updateIn(path, fn));
      }}
    />
  );
};

export const ViolationsInSequence = () => {
  const timeThresholdConfig = {
    type: 'violationsInSequence'
  };

  const alertConfig = {};
  const [form, updateForm] = useState(
    createSmartAlertForm(alertConfig).put(
      'timeThreshold',
      createTimeThresholdForm(timeThresholdConfig, defaultGranularity)
    )
  );

  return (
    <ConfigureAlertingThreshold
      form={form}
      updateForm={updateForm}
      onChange={(path, fn) => {
        updateForm(form.updateIn(path, fn));
      }}
    />
  );
};
