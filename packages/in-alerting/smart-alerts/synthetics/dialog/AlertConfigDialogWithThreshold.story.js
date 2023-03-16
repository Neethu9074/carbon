/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';

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

const failureAlertConfig = Object.freeze(generateAlertConfig());

export const AdvancedAlertConfigDialog = args => {
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

export const SimpleDialogEditModeWithError = args => {
  const { editMode } = args;
  const [form, setForm] = useState(alertFormDefinition(failureAlertConfig, editMode));

  return <AlertConfigDialogWithThreshold {...args} form={form} updateForm={setForm} />;
};

SimpleDialogEditModeWithError.args = {
  startWithSimpleMode: true,
  messages: [
    enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError({
      message:
        'The maximum number of alert configurations (9990000) has been reached. Please contact Instana support to request an increase for this limit.'
    })
  ]
};

export const SimpleDialogEditModeWithoutError = args => {
  const { editMode } = args;
  const [form, setForm] = useState(alertFormDefinition(failureAlertConfig, editMode));

  return <AlertConfigDialogWithThreshold {...args} form={form} updateForm={setForm} />;
};

SimpleDialogEditModeWithoutError.args = {
  startWithSimpleMode: true
};
