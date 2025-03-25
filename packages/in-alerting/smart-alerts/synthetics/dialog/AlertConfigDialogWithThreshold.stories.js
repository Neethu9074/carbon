/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { Default } from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration.stories';

export default {
  component: AlertConfigDialogWithThreshold,
  argTypes: {
    withTrackClose: { action: 'withTrackClose' },
    withTrackCreate: { action: 'withTrackCreate' },
    onChartViewConfigChange: { action: 'onChartViewConfigChange' },
    selectedChartViewConfigIndex: { action: 'selectedChartViewConfigIndex' }
  },
  args: {
    selectedChartViewConfigIndex: 0,
    startWithSimpleMode: false,
    editMode: false,
    messages: [],
    isSaving: false
  }
};

const alertConfig = Default.args.alertConfig;

const failureAlertConfig = Object.freeze(alertConfig);

export const AdvancedDialog = args => {
  const { editMode } = args;
  const [form, updateForm] = useState(alertFormDefinition(failureAlertConfig, editMode));

  return (
    <AlertConfigDialogWithThreshold
      {...args}
      startWithSimpleMode={false}
      form={form}
      updateForm={updateForm}
      // only needed for time threshold section
      onChange={(path, updater) => {
        updateForm(form.updateIn(path, updater));
      }}
    />
  );
};

export const SimpleEditDialogWithError = args => {
  const { editMode } = args;
  const [form, setForm] = useState(alertFormDefinition(failureAlertConfig, editMode));

  return <AlertConfigDialogWithThreshold {...args} form={form} updateForm={setForm} />;
};

SimpleEditDialogWithError.args = {
  startWithSimpleMode: true,
  messages: [
    enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError({
      message:
        'The maximum number of alert configurations (9990000) has been reached. Please contact Instana support to request an increase for this limit.'
    })
  ]
};

export const SimpleEditDialogWithoutError = args => {
  const { editMode } = args;
  const [form, setForm] = useState(alertFormDefinition(failureAlertConfig, editMode));

  return <AlertConfigDialogWithThreshold {...args} form={form} updateForm={setForm} />;
};

SimpleEditDialogWithoutError.args = {
  startWithSimpleMode: true
};
