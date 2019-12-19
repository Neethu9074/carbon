import { createLogger } from 'instalog';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import alertFormDefinition, {
  fieldNames,
  selectOptions
} from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import getWebsiteSpecificJsErrorRateMetricHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteSpecificJsErrorRateMetricHistoricThreshold';
import getWebsiteMetricsHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricsHistoricThreshold';
import AlertConfigDialogPresenter from 'in-websites/eum-alerting/AlertConfigDialogPresenter';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';
import { operators } from 'in-analyze/applicationFilter';
import connectTo from 'in-hoc/connectTo';

const tenMins = 10 * 1000 * 60;
const twentyFourHrs = 1000 * 60 * 60 * 24;
const logger = createLogger('in-websites/eum-alerting/AlertDialog');
const errorCount = selectOptions[fieldNames.ruleMetricName][0].value;
const errorRate = selectOptions[fieldNames.ruleMetricName][1].value;

const operatorDescriptionValues = {
  [operators.EQUALS]: 'equal',
  [operators.CONTAINS]: 'contain',
  [operators.STARTS_WITH]: 'start with',
  [operators.ENDS_WITH]: 'end with'
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
      timeConfig={{
        windowSize: twentyFourHrs
      }}
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
  return (form, fieldName, fieldValue, atomicAddField) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (atomicAddField) {
      updatedForm = updatedForm.updateIn([atomicAddField.name], field => field.setValue(atomicAddField.value));
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
  return Object.freeze({
    rule: {
      alertType: form.get(fieldNames.ruleAlertType).value,
      operator: form.get(fieldNames.ruleOperator).value, // only error rate
      value: form.get(fieldNames.ruleValue).value, // only error rate
      metricName: form.get(fieldNames.ruleMetricName).value
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
      type: form.get(fieldNames.thresholdType).value,
      value: form.get(fieldNames.thresholdValue).value,
      operator: form.get(fieldNames.thresholdOperator).value
    }
  });
}

const AlertConfigDialogWithThreshold = connectTo(
  props => {
    const { form, timeConfig, granularity, onChange } = props;
    const websiteId = form.get(fieldNames.websiteId).value;
    const stringValue = form.get(fieldNames.ruleValue).value;
    const operator = form.get(fieldNames.ruleOperator).value;
    const tagFilters = form.get(fieldNames.tagFilters).value;

    return {
      errorCountThreshold: getWebsiteMetricsHistoricThreshold(
        getMetricConfiguration(websiteId, 'SUM', errorCount, stringValue, operator, tagFilters, timeConfig, granularity)
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(
          threshold =>
            form.get(fieldNames.ruleMetricName).value === errorCount && addThresholdToForm(form, onChange, threshold)
        ),

      errorRateThreshold: getWebsiteSpecificJsErrorRateMetricHistoricThreshold(
        getMetricConfiguration(websiteId, 'MEAN', errorRate, stringValue, operator, tagFilters, timeConfig, granularity)
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(
          threshold =>
            form.get(fieldNames.ruleMetricName).value === errorRate && addThresholdToForm(form, onChange, threshold)
        )
    };
  },
  function connectedAlertDialog({
    form,
    onChange,
    onClose,
    onCreate,
    timeConfig,
    websiteLabel,
    editMode,
    granularity
  }) {
    return (
      <AlertConfigDialogPresenter
        form={form}
        onChange={onChange}
        onClose={onClose}
        onCreate={onCreate}
        timeConfig={timeConfig}
        websiteLabel={websiteLabel}
        editMode={editMode}
        granularity={granularity}
      />
    );
  }
);

function addThresholdToForm(form, onChange, threshold) {
  if (form.get(fieldNames.calculateThresholdOnBackend).value) {
    onChange(form, fieldNames.thresholdValue, threshold, {
      name: fieldNames.calculateThresholdOnBackend,
      value: false
    });
  }
}

function getMetricConfiguration(
  websiteId,
  aggregation,
  metric,
  stringValue,
  operator,
  tagFilters,
  timeConfig,
  granularity
) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  const errorFilter = { name: 'beacon.error.message', operator, stringValue };
  return {
    timeConfig,
    tagFilters: metric === errorCount ? [...tagFiltersWithWebsiteId, errorFilter] : tagFiltersWithWebsiteId,
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation,
        numeratorFilter: errorFilter
      }
    }
  };
}

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}

export function getTitlePlaceholder(form) {
  return `JS Error(s): ${form.get(fieldNames.ruleValue).value}`;
}

export function getDescriptionPlaceholder(form) {
  return `JS Errors which ${operatorDescriptionValues[form.get(fieldNames.ruleOperator).value]} "${
    form.get(fieldNames.ruleValue).value
  }" have been detected.`;
}
