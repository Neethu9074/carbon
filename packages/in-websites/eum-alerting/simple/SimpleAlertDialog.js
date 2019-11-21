import { createLogger } from 'instalog';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import alertFormDefinition, { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import SimpleAlertDialogPresenter from 'in-websites/eum-alerting/simple/SimpleAlertDialogPresenter';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';
import { operators } from 'in-analyze/applicationFilter';

const logger = createLogger('in-websites/eum-alerting/simple/SimpleAlertDialog');
const twelveHours = 1000 * 60 * 60 * 12;
const operatorDescriptionValues = {
  [operators.EQUALS]: 'equal',
  [operators.CONTAINS]: 'contain',
  [operators.STARTS_WITH]: 'start with',
  [operators.ENDS_WITH]: 'end with'
};

export default function SimpleAlertDialog({ onClose, formData, websiteLabel, editMode }) {
  const [form, setForm] = useState(() => alertFormDefinition(formData));

  return (
    <SimpleAlertDialogPresenter
      form={form}
      onChange={onChange(setForm)}
      onClose={onClose}
      onCreate={() => createAlert(form, setForm, onClose, editMode)}
      timeConfig={{
        windowSize: twelveHours
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
      alertType: form.get(fieldNames.ruleAlertType).value,
      operator: form.get(fieldNames.ruleOperator).value,
      value: form.get(fieldNames.ruleValue).value,
      metricName: form.get(fieldNames.ruleMetricName).value
    },
    tagFilters: form.get(fieldNames.tagFilters).value,
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    severity: form.get(fieldNames.severity).value,
    description: `JS Errors which ${operatorDescriptionValues[form.get(fieldNames.ruleOperator).value]} "${
      form.get(fieldNames.ruleValue).value
    }" have been detected.`,
    name: `JS Error(s): ${form.get(fieldNames.ruleValue).value}`,
    websiteId: form.get(fieldNames.websiteId).value,
    threshold: {
      type: form.get(fieldNames.thresholdType).value,
      value: form.get(fieldNames.thresholdValue).value,
      operator: form.get(fieldNames.thresholdOperator).value
    }
  });
}
