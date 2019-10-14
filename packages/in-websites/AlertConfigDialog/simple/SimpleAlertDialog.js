import { createLogger } from 'instalog';
import React, { useState } from 'react';

import alertFormDefinition, { fieldNames } from 'in-websites/AlertConfigDialog/form/alertDialogFormDefinition';
import SimpleAlertDialogPresenter from 'in-websites/AlertConfigDialog/simple/SimpleAlertDialogPresenter';
import { createAlertConfig } from 'in-websites/api/alertConfig';

const logger = createLogger('in-websites/AlertConfigDialog/simple/SimpleAlertDialog');
const implicitTagFilters = ['beacon.website.id'];

export default function SimpleAlertDialog({ onClose, filterConfig }) {
  const [form, setForm] = useState(alertFormDefinition(buildFormDataObject(filterConfig)));

  return (
    <SimpleAlertDialogPresenter
      form={form}
      onChange={onChange(setForm)}
      onClose={onClose}
      onCreate={() => createAlert(form, setForm, onClose)}
      timeConfig={filterConfig.timeConfig}
    />
  );
}

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));

    if (fieldName === fieldNames.matchingOperator || fieldName === fieldNames.value) {
      const currentTagFilters = form.get(fieldNames.tagFilters).value;
      const filteredTagFilters = currentTagFilters.filter(tf => tf.name !== 'beacon.error.message');

      if (fieldName === fieldNames.matchingOperator) {
        filteredTagFilters.push({
          name: 'beacon.error.message',
          operator: fieldValue,
          stringValue: form.get(fieldNames.value).value
        });
      } else {
        filteredTagFilters.push({
          name: 'beacon.error.message',
          operator: form.get(fieldNames.matchingOperator).value,
          stringValue: fieldValue
        });
      }

      updatedForm = updatedForm.updateIn([fieldNames.tagFilters], field => field.setValue(filteredTagFilters));
    }

    setForm(updatedForm);
  };
}

function createAlert(form, setForm, onClose) {
  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    return;
  }

  const alertConfig = toAlertConfigObject(form);

  createAlertConfig(alertConfig).once(
    () => onClose(),
    error => {
      logger.error(`failed to save alertConfing: ${alertConfig} ${error.message}`, error);
    }
  );
}

function toAlertConfigObject(form) {
  return Object.freeze({
    rule: {
      alertType: form.get(fieldNames.alertType).value,
      matchingOperator: form.get(fieldNames.matchingOperator).value,
      value: form.get(fieldNames.value).value
    },
    tagFilters: form.get(fieldNames.tagFilters).value,
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value,
    name: form.get(fieldNames.name).value,
    threshold: form.get(fieldNames.threshold).value
  });
}

function buildFormDataObject(filterConfig) {
  return {
    tagFilters: [
      { name: 'beacon.website.name', operator: 'EQUALS', stringValue: filterConfig.websiteLabel },
      { name: 'beacon.error.message', operator: 'CONTAINS', stringValue: filterConfig.error.message },
      ...filterConfig.tagFilters.filter(({ name }) => !implicitTagFilters.includes(name))
    ],
    rule: {
      alertType: 'specificJsError',
      matchingOperator: 'CONTAINS',
      value: filterConfig.error.message
    },
    threshold: {
      type: 'staticThreshold',
      value: 0.0
    },
    name: `JS Error(s): ${filterConfig.error.message}`
  };
}
