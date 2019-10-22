import { createLogger } from 'instalog';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import alertFormDefinition, { fieldNames } from 'in-websites/AlertConfigDialog/form/alertDialogFormDefinition';
import SimpleAlertDialogPresenter from 'in-websites/AlertConfigDialog/simple/SimpleAlertDialogPresenter';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';

const logger = createLogger('in-websites/AlertConfigDialog/simple/SimpleAlertDialog');
const twelfHours = 1000 * 60 * 60 * 12;

export default function SimpleAlertDialog({ onClose, formData, websiteLabel, editMode }) {
  const [form, setForm] = useState(() => alertFormDefinition(formData));

  return (
    <SimpleAlertDialogPresenter
      form={form}
      onChange={onChange(setForm)}
      onClose={onClose}
      onCreate={() => createAlert(form, setForm, onClose, editMode)}
      timeConfig={{
        windowSize: twelfHours
      }}
      websiteLabel={websiteLabel}
      editMode={editMode}
    />
  );
}

SimpleAlertDialog.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  websiteLabel: PropTypes.string.isRequired,
  editMode: PropTypes.bool
};

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    setForm(updatedForm);
  };
}

function createAlert(form, setForm, onClose, editMode) {
  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    return;
  }

  const websiteAlertConfig = toAlertConfigObject(form);

  if (editMode) {
    updateAlertConfig(websiteAlertConfig, form.get('id').value).once(
      () => onClose(),
      error => {
        logger.error(`failed to update alertConfing: ${websiteAlertConfig} ${error.message}`, error);
      }
    );
  } else {
    createAlertConfig(websiteAlertConfig).once(
      () => onClose(),
      error => {
        logger.error(`failed to save alertConfing: ${websiteAlertConfig} ${error.message}`, error);
      }
    );
  }
}

function toAlertConfigObject(form) {
  return Object.freeze({
    rule: {
      alertType: form.get(fieldNames.alertType).value,
      operator: form.get(fieldNames.operator).value,
      value: form.get(fieldNames.value).value
    },
    tagFilters: [...form.get(fieldNames.tagFilters).value],
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value,
    name: `JS Error(s): ${form.get(fieldNames.value).value}`,
    threshold: form.get(fieldNames.threshold).value,
    websiteId: form.get(fieldNames.websiteId).value
  });
}
