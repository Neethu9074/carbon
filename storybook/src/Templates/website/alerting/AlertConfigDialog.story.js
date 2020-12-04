import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import AdvancedModeContainer from 'in-websites/alerting/advanced/AdvancedModeContainer';
import alertFormDefinition from 'in-websites/alerting/form/alertDialogFormDefinition';
import SimpleModeContainer from 'in-websites/alerting/simple/SimpleModeContainer';

export default {
  title: 'Templates|website/alerting/AlertConfigDialog',
  component: AlertConfigDialogPresenter,
  parameters: {
    // TODO remove after fixing broken story
    chromatic: { disable: true }
  }
};

const timeConfig = {
  to: null,
  focusedMoment: null,
  autoRefresh: false
};
function createOnChange(setForm, externalForm) {
  return (form, fieldName, fieldValue, ...atomicAddFields) => {
    // Alternative (new and desired) method signature
    if (form instanceof Array) {
      const path = form;
      const fn = fieldName;
      setForm(externalForm.updateIn(path, fn));
      return;
    }

    // old signature, we want to get rid of this
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (atomicAddFields.length > 0) {
      atomicAddFields.forEach(
        ({ name, value }) => (updatedForm = updatedForm.updateIn([name], field => field.setValue(value)))
      );
    }
    setForm(updatedForm);
  };
}

export const AlertConfigDialog = () => {
  const [form, setForm] = useState(alertFormDefinition(getFormData()));

  return (
    <AlertConfigDialogPresenter
      form={form}
      updateForm={setForm}
      onChange={createOnChange(setForm, form)}
      onClose={action('close')}
      onCreate={action('create')}
      timeConfig={timeConfig}
      websiteLabel={'shop'}
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
    />
  );
};

export const SimpleDialogEditMode = () => {
  const [form, setForm] = useState(alertFormDefinition(getFormData()));

  return (
    <AlertConfigDialogPresenter
      form={form}
      updateForm={setForm}
      onChange={createOnChange(setForm, form)}
      onClose={action('close')}
      onCreate={action('create')}
      timeConfig={timeConfig}
      websiteLabel={'shop'}
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
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
