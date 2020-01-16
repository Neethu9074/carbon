import { createLogger } from 'instalog';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { AlertConfigDialogWithThreshold } from 'in-websites/eum-alerting/alertConfigDialogWithThreshold/AlertConfigDialogWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-websites/eum-alerting/formHelpers';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { twentyFourHrs, tenMins } from 'in-websites/eum-alerting/constants';

const logger = createLogger('in-websites/eum-alerting/AlertDialog');

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: twentyFourHrs,
  autoRefresh: false
};

export default function AlertConfigDialog({ onClose, formData, websiteLabel, editMode }) {
  const [form, setForm] = useState(() => alertFormDefinition(formData));
  const [calculateThresholdOnBackend, setCalculateThresholdOnBackend] = useState(false);

  return (
    <AlertConfigDialogWithThreshold
      form={form}
      onChange={onChange(setForm)}
      onClose={onClose}
      onCreate={() => createAlert(form, setForm, onClose, editMode)}
      timeConfig={timeConfig}
      websiteLabel={websiteLabel}
      editMode={editMode}
      granularity={tenMins}
      calculateThresholdOnBackend={calculateThresholdOnBackend}
      doCalculateThresholdOnBackend={load => setCalculateThresholdOnBackend(load)}
    />
  );
}

AlertConfigDialog.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  websiteLabel: PropTypes.string.isRequired,
  editMode: PropTypes.bool
};

function onChange(setForm) {
  return (form, fieldName, fieldValue, ...atomicAddFields) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (atomicAddFields.length > 0) {
      atomicAddFields.forEach(
        ({ name, value }) => (updatedForm = updatedForm.updateIn([name], field => field.setValue(value)))
      );
    }

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
        logger.error(`failed to update alertConfig: ${websiteAlertConfig} ${error.message}`, error);
      }
    );
  } else {
    createAlertConfig(websiteAlertConfig).once(
      () => onClose(),
      error => {
        logger.error(`failed to save alertConfig: ${websiteAlertConfig} ${error.message}`, error);
      }
    );
  }
}

function toAlertConfigObject(form) {
  function enhanceRuleValuesByAlertType(form) {
    const alertType = form.get(fieldNames.ruleAlertType).value;
    if (alertType === alertTypes.specificJsError) {
      return {
        operator: form.get(fieldNames.ruleOperator).value,
        value: form.get(fieldNames.ruleValue).value
      };
    } else if (alertType === alertTypes.specificStatusCode) {
      return {
        operator: form.get(fieldNames.ruleOperator).value,
        value: form.get(fieldNames.ruleValue).value
      };
    } else if (alertType === alertTypes.slowness) {
      return {
        aggregation: form.get(fieldNames.ruleAggregation).value
      };
    }
    return null;
  }

  function enhanceThresholdValuesByThresholdType(form) {
    const thresholdType = form.get(fieldNames.thresholdType).value;

    if (thresholdType === 'staticThreshold') {
      return {
        type: 'staticThreshold',
        value: form.get(fieldNames.thresholdValue).value
      };
    } else {
      return {
        type: 'historicBaseline',
        to: form.get(fieldNames.thresholdTo).value,
        seasonality: form.get(fieldNames.thresholdSeasonality).value,
        baseline: form.get(fieldNames.thresholdBaseline).value,
        deviationFactor: form.get(fieldNames.thresholdDeviationFactor).value
      };
    }
  }

  return Object.freeze({
    rule: {
      alertType: form.get(fieldNames.ruleAlertType).value,
      metricName: form.get(fieldNames.ruleMetricName).value,
      ...enhanceRuleValuesByAlertType(form)
    },
    tagFilters: form.get(fieldNames.tagFilters).value,
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(form),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(form),
    websiteId: form.get(fieldNames.websiteId).value,
    threshold: {
      operator: form.get(fieldNames.thresholdOperator).value,
      ...enhanceThresholdValuesByThresholdType(form)
    }
  });
}
