import { createLogger } from 'instalog';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import alertFormDefinition, {
  fieldNames,
  selectOptions
} from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import getWebsiteSpecificJsErrorRateMetricHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteSpecificJsErrorRateMetricHistoricThreshold';
import getWebsiteMetricsHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricsHistoricThreshold';
import AlertConfigDialogPresenter from 'in-websites/eum-alerting/AlertConfigDialogPresenter';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
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

const AlertConfigDialogWithThreshold = connectTo(
  props => {
    const { form, timeConfig, granularity, onChange } = props;
    const stringValue = form.get(fieldNames.ruleValue).value;
    const operator = form.get(fieldNames.ruleOperator).value;
    const tagFilters = form.get(fieldNames.tagFilters).value;
    const metricName = form.get(fieldNames.ruleMetricName).value;

    return {
      errorCountThreshold: getWebsiteMetricsHistoricThreshold(
        getMetricConfiguration('SUM', errorCount, stringValue, operator, tagFilters, timeConfig, granularity)
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => {
          if (metricName === errorCount) {
            addThresholdToForm(form, onChange, threshold);
          }
        }),

      errorRateThreshold: getWebsiteSpecificJsErrorRateMetricHistoricThreshold(
        getMetricConfiguration('MEAN', errorRate, stringValue, operator, tagFilters, timeConfig, granularity)
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => metricName === errorRate && addThresholdToForm(form, onChange, threshold)),

      slownessThreshold: getWebsiteMetricsHistoricThreshold(
        getMetricConfiguration(
          form.get(fieldNames.ruleAggregation).value,
          'onLoadTime',
          stringValue,
          operator,
          tagFilters,
          timeConfig,
          granularity
        )
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => {
          if (metricName === 'onLoadTime') {
            addThresholdToForm(form, onChange, threshold);
          }
        })
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
  const alertType = form.get(fieldNames.ruleAlertType).value;

  let updatedForm = form;
  if (alertType === alertTypes.specificJsError) {
    updatedForm = updatedForm.remove(fieldNames.ruleAggregation);
  }

  if (alertType === alertTypes.slowness) {
    updatedForm = updatedForm.remove(fieldNames.ruleOperator);
    updatedForm = updatedForm.remove(fieldNames.ruleValue);
  }

  if (!updatedForm.hierarchyValid) {
    setForm(updatedForm.setTouched(true, { recurse: true }));
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
  function enhanceRuleValuesByAlertType(form) {
    const alertType = form.get(fieldNames.ruleAlertType).value;
    if (alertType === alertTypes.specificJsError) {
      return {
        operator: form.get(fieldNames.ruleOperator).value,
        value: form.get(fieldNames.ruleValue).value
      };
    }
    if (alertType === alertTypes.slowness) {
      return {
        aggregation: form.get(fieldNames.ruleAggregation).value
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
      type: form.get(fieldNames.thresholdType).value,
      value: form.get(fieldNames.thresholdValue).value,
      operator: form.get(fieldNames.thresholdOperator).value
    }
  });
}

function addThresholdToForm(form, onChange, threshold) {
  if (form.get(fieldNames.calculateThresholdOnBackend).value) {
    onChange(form, fieldNames.thresholdValue, threshold, {
      name: fieldNames.calculateThresholdOnBackend,
      value: false
    });
  }
}

function getMetricConfiguration(aggregation, metric, stringValue, operator, tagFilters, timeConfig, granularity) {
  const errorFilter = { name: 'beacon.error.message', operator, stringValue };
  return {
    timeConfig,
    tagFilters: metric === errorCount ? [...tagFilters, errorFilter] : tagFilters,
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

export function getTitlePlaceholder(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;
  if (alertType === alertTypes.specificJsError) {
    return `JS Error(s): ${form.get(fieldNames.ruleValue).value}`;
  }
  if (alertType === alertTypes.slowness) {
    return `onLoad Time is above ${form.get(fieldNames.thresholdValue).value}ms`;
  }
}

export function getDescriptionPlaceholder(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;
  if (alertType === alertTypes.specificJsError) {
    return `JS Errors which ${operatorDescriptionValues[form.get(fieldNames.ruleOperator).value]} "${
      form.get(fieldNames.ruleValue).value
    }" have been detected.`;
  }
  if (alertType === alertTypes.slowness) {
    return `Load times above threshold ${form.get(fieldNames.thresholdValue).value}ms detected.`;
  }
}
