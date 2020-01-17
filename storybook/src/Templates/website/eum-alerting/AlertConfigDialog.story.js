import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import AlertConfigDialogPresenter from 'in-websites/eum-alerting/AlertConfigDialogPresenter';
import alertFormDefinition from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { twentyFourHrs, tenMins } from 'in-websites/eum-alerting/constants';

export default {
  title: 'Templates|website/eum-alerting/AlertConfigDialog',
  component: AlertConfigDialogPresenter
};

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: twentyFourHrs,
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
      granularity={tenMins}
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
