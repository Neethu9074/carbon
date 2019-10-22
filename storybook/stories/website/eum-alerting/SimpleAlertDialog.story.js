import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import SimpleAlertDialogPresenter from 'in-websites/eum-alerting/simple/SimpleAlertDialogPresenter';
import alertFormDefinition from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

storiesOf('websites/eum-alerting/simple-dialog', module)
  .add('Simple Dialog', () => <SimpleDialog />)
  .add('Simple Dialog: Edit Mode', () => <SimpleDialogEditMode />);

const twelfHours = 1000 * 60 * 60 * 12;

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    setForm(form.updateIn([fieldName], field => field.setValue(fieldValue).setTouched(true, { recurse: true })));
  };
}

function SimpleDialog() {
  const [form, setForm] = useState(alertFormDefinition(getFormData()));

  return (
    <SimpleAlertDialogPresenter
      form={form}
      onChange={onChange(setForm)}
      onClose={action('close')}
      onCreate={action('create')}
      timeConfig={{
        windowSize: twelfHours
      }}
      websiteLabel={'shop'}
    />
  );
}

function SimpleDialogEditMode() {
  const [form, setForm] = useState(alertFormDefinition(getFormData()));

  return (
    <SimpleAlertDialogPresenter
      form={form}
      onChange={onChange(setForm)}
      onClose={action('close')}
      onCreate={action('create')}
      timeConfig={{
        windowSize: twelfHours
      }}
      websiteLabel={'shop'}
      editMode
    />
  );
}

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
