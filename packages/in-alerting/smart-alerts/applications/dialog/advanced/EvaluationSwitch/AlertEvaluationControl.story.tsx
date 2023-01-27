/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { AlertEvaluationControlPresenter } from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControlPresenter';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControl';
import { someErrorRateFormData } from 'in-alerting/smart-alerts/applications/dialog/advanced/stories/formSampleData';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { noop } from 'in-services/fixedObjects';

export default {
  subComponents: [AlertEvaluationControlPresenter],
  component: AlertEvaluationControl
};

export const Default = (args: any) => {
  return <AlertEvaluationControlPresenter {...args} setEvaluationType={noop} />;
};

Default.args = {
  isBuiltIn: false,
  evaluationType: PER_AP,
  isGlobalSmartAlert: false,
  isAdaptiveThreshold: false
};

Default.argTypes = {
  evaluationType: {
    control: 'select',
    options: [PER_AP, PER_AP_SERVICE, PER_AP_ENDPOINT]
  }
};

export const Interactive = () => {
  // @ts-expect-error demo data are not fully matching expected type, but here it is okay
  const [form, setForm] = useState(createSmartAlertForm(someErrorRateFormData()));

  return <AlertEvaluationControl form={form} updateForm={setForm} />;
};
