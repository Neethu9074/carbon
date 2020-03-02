import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import { alertingDialogChartTimeframe, alertingMetricsGranularity } from 'in-websites/eum-alerting/constants';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import alertFormDefinition from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

export default {
  title: 'Templates|website/eum-alerting/AlertConfigDialog',
  component: AlertConfigDialogPresenter
};

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: alertingDialogChartTimeframe,
  autoRefresh: false
};

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    setForm(form.updateIn([fieldName], field => field.setValue(fieldValue).setTouched(true, { recurse: true })));
  };
}

export const AlertConfigDialog = () => {
  const [form, setForm] = useState(alertFormDefinition(getFormData()));

  return (
    <AlertConfigDialogPresenter
      form={form}
      onChange={onChange(setForm)}
      onClose={action('close')}
      onCreate={action('create')}
      timeConfig={timeConfig}
      websiteLabel={'shop'}
      granularity={alertingMetricsGranularity}
    />
  );
};

export const SimpleDialogEditMode = () => {
  const [form, setForm] = useState(alertFormDefinition(getFormData()));

  return (
    <AlertConfigDialogPresenter
      form={form}
      onChange={onChange(setForm)}
      onClose={action('close')}
      onCreate={action('create')}
      timeConfig={timeConfig}
      websiteLabel={'shop'}
      editMode
    />
  );
};

function getFormData() {
  return {
    id: '<generated server side',
    name: 'JS Specific errors example',
    description: 'Foobar',
    severity: 5,
    triggering: false,
    tagFilters: [
      {
        name: 'beacon.website.name',
        operator: 'EQUALS',
        stringValue: 'Shop'
      },
      {
        name: 'beacon.page.name',
        operator: 'EQUALS',
        stringValue: 'Homepage'
      }
    ],
    rule: {
      alertType: 'specificJsError',
      matchingOperator: 'CONTAINS',
      value: 'unknown error'
    },
    baseline: {
      to: 0,
      windowSize: 0,
      seasonality: 'DAILY',
      granularity: 0,
      segments: [],
      sdFactor: 1.0
    },
    alertChannelIds: [],
    enabled: true
  };
}
