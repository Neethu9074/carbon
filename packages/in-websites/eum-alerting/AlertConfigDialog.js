import { createLogger } from 'instalog';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import getWebsiteRateMetricHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteRateMetricHistoricThreshold';
import getWebsiteMetricsHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricsHistoricThreshold';
import alertFormDefinition, { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import getWebsiteMetricsBaseline from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricsBaseline';
import AlertConfigDialogPresenter from 'in-websites/eum-alerting/AlertConfigDialogPresenter';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { operators } from 'in-analyze/applicationFilter';
import connectTo from 'in-hoc/connectTo';

const logger = createLogger('in-websites/eum-alerting/AlertDialog');

const tenMins = 10 * 1000 * 60;
const twentyFourHrs = 1000 * 60 * 60 * 24;

const errorRate = 'specificJsErrorRate';
const errorCount = 'errors';
const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: twentyFourHrs,
  autoRefresh: false
};

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

const AlertConfigDialogWithThreshold = connectTo(
  props => {
    const { form, timeConfig, granularity, onChange } = props;
    const websiteId = form.get(fieldNames.websiteId).value;
    const stringValue = getFormValueOrDefault(form, fieldNames.ruleValue);
    const operator = getFormValueOrDefault(form, fieldNames.ruleOperator);
    const tagFilters = form.get(fieldNames.tagFilters).value;
    const metricName = form.get(fieldNames.ruleMetricName).value;
    const aggregation = getFormValueOrDefault(form, fieldNames.ruleAggregation);
    const seasonality = getFormValueOrDefault(form, fieldNames.thresholdSeasonality);

    return {
      errorCountThreshold: getWebsiteMetricsHistoricThreshold(
        getMetricConfigurationForErrors(
          websiteId,
          'SUM',
          errorCount,
          stringValue,
          operator,
          tagFilters,
          timeConfig,
          granularity
        )
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => {
          if (metricName === errorCount) {
            addThresholdToForm(form, onChange, threshold);
          }
        }),

      errorRateThreshold: getWebsiteRateMetricHistoricThreshold(
        getMetricConfigurationForErrors(
          websiteId,
          'MEAN',
          errorRate,
          stringValue,
          operator,
          tagFilters,
          timeConfig,
          granularity
        )
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => metricName === errorRate && addThresholdToForm(form, onChange, threshold)),

      slownessThreshold: getWebsiteMetricsHistoricThreshold(
        getMetricConfiguration(websiteId, aggregation, 'onLoadTime', tagFilters, timeConfig, granularity)
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => {
          if (metricName === 'onLoadTime' && form.get(fieldNames.thresholdType).value === 'staticThreshold') {
            addThresholdToForm(form, onChange, threshold);
          }
        }),

      baseline: getWebsiteMetricsBaseline(
        getMetricsBaselineConfiguration(websiteId, aggregation, tagFilters, granularity, seasonality)
      )
        .filter(resp => resp && !resp.progress.loading)
        .map(resp => (resp && resp.data && resp.data.baseline) || [])
        .tap(baseline => {
          if (metricName === 'onLoadTime' && form.get(fieldNames.thresholdType).value !== 'staticThreshold') {
            addBaselineToForm(form, onChange, baseline);
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

    const thresholdType = form.get(fieldNames.thresholdType).value;

    if (thresholdType === 'staticThreshold') {
      updatedForm = updatedForm.remove(fieldNames.thresholdTo);
      updatedForm = updatedForm.remove(fieldNames.thresholdSeasonality);
      updatedForm = updatedForm.remove(fieldNames.thresholdBaseline);
      updatedForm = updatedForm.remove(fieldNames.thresholdDeviationFactor);
    } else {
      updatedForm = updatedForm.remove(fieldNames.thresholdValue);
    }
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
    }
    if (alertType === alertTypes.slowness) {
      return {
        aggregation: form.get(fieldNames.ruleAggregation).value
      };
    }
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

function addThresholdToForm(form, onChange, threshold) {
  if (form.get(fieldNames.calculateThresholdOnBackend).value) {
    onChange(form, fieldNames.thresholdValue, threshold, {
      name: fieldNames.calculateThresholdOnBackend,
      value: false
    });
  }
}

function addBaselineToForm(form, onChange, baseline) {
  if (form.get(fieldNames.calculateThresholdOnBackend).value) {
    onChange(form, fieldNames.thresholdBaseline, baseline, {
      name: fieldNames.calculateThresholdOnBackend,
      value: false
    });
  }
}

function getMetricConfigurationForErrors(
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

function getMetricConfiguration(websiteId, aggregation, metric, tagFilters, timeConfig, granularity) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  return {
    timeConfig,
    tagFilters: tagFiltersWithWebsiteId,
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation
      }
    }
  };
}

function getMetricsBaselineConfiguration(websiteId, aggregation, tagFilters, granularity, seasonality) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  return {
    to: Date.now(),
    metrics: {
      baseline: {
        metric: 'onLoadTime',
        granularity,
        aggregation
      }
    },
    tagFilters: tagFiltersWithWebsiteId,
    seasonality
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
  const alertType = form.get(fieldNames.ruleAlertType).value;
  if (alertType === alertTypes.specificJsError) {
    return `JS Error(s): ${form.get(fieldNames.ruleValue).value}`;
  }
  if (alertType === alertTypes.slowness) {
    // return `onLoad Time is above ${form.get(fieldNames.thresholdValue).value}ms`;
    return `onLoad Time to high`;
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
    return `Load times above specified threshold detected.`;
  }
}

export function getFormValueOrDefault(form, key, defaultValue = null) {
  return form.containsKey(key) ? form.get(key).value : defaultValue;
}
