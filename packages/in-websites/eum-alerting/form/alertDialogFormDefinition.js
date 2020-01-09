import { createMapForm, createField, notBlankValidator } from 'formalistic';

import {
  withSlownessFormStaticThreshold,
  withSlownessFormHistoricBaseline
} from 'in-websites/eum-alerting/form/slownessForm';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { operators } from 'in-analyze/applicationFilter';

const severityWarning = 5;
const severityCritical = 10;

export const fieldNames = Object.freeze({
  ruleAggregation: 'ruleAggregation',
  ruleAlertType: 'ruleAlertType',
  ruleOperator: 'ruleOperator',
  ruleValue: 'ruleValue',
  ruleMetricName: 'ruleMetricName',
  tagFilters: 'tagFilters',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  triggering: 'triggering',
  severity: 'severity',
  description: 'description',
  name: 'name',
  websiteId: 'websiteId',
  id: 'id',
  thresholdValue: 'thresholdValue',
  thresholdType: 'thresholdType',
  thresholdTo: 'thresholdTo',
  thresholdOperator: 'thresholdOperator',
  thresholdSeasonality: 'thresholdSeasonality',
  thresholdBaseline: 'thresholdBaseline',
  thresholdDeviationFactor: 'thresholdDeviationFactor',
  calculateThresholdOnBackend: 'calculateThresholdOnBackend'
});

export const selectOptions = {
  [fieldNames.ruleOperator]: Object.freeze([
    { value: operators.EQUALS, label: 'Equals' },
    { value: operators.CONTAINS, label: 'Contains' },
    { value: operators.STARTS_WITH, label: 'Starts with' },
    { value: operators.ENDS_WITH, label: 'Ends with' }
  ]),
  [fieldNames.ruleMetricName]: Object.freeze([
    { value: 'errors', label: 'Errors count' },
    { value: 'specificJsErrorRate', label: 'Errors rate' }
  ]),
  [fieldNames.ruleAggregation]: Object.freeze([
    { value: 'MEAN', label: 'mean' },
    { value: 'MIN', label: 'min' },
    { value: 'P25', label: '25th' },
    { value: 'P50', label: '50th' },
    { value: 'P75', label: '75th' },
    { value: 'P90', label: '90th (recommended)' },
    { value: 'P95', label: '95th' },
    { value: 'P98', label: '98th' },
    { value: 'P99', label: '99th' },
    { value: 'MAX', label: 'max' }
  ]),
  [fieldNames.thresholdOperator]: Object.freeze([
    { value: '>=', label: '≥ (recommended)' },
    { value: '>', label: '>' },
    { value: '<=', label: '≤' },
    { value: '<', label: '<' }
  ]),
  [fieldNames.severity]: Object.freeze([
    { value: severityWarning, label: 'Warning' },
    { value: severityCritical, label: 'Critical' }
  ]),
  [fieldNames.thresholdType]: Object.freeze([
    { value: 'staticThreshold', label: 'Static Threshold' },
    { value: 'historicBaseline.DAILY', label: 'Baseline (Daily Seasonality)' },
    { value: 'historicBaseline.WEEKLY', label: 'Baseline (Weekly Seasonality)' }
  ])
};

export default function alertFormDefinition(alertFormValues = {}) {
  const {
    rule = '',
    tagFilters = [],
    alertChannelIds = [],
    enabled = true,
    triggering = false,
    severity = severityWarning,
    description = '',
    name = '',
    websiteId = '',
    id = '',
    threshold = '',
    calculateThresholdOnBackend = false
  } = alertFormValues;

  let form = createMapForm()
    .put(
      fieldNames.ruleAlertType,
      createField({
        value: rule && rule.alertType,
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.ruleMetricName,
      createField({
        value: (rule && rule.metricName) || 'errors',
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.tagFilters,
      createField({
        value: tagFilters
      })
    )
    .put(
      fieldNames.alertChannelIds,
      createField({
        value: alertChannelIds,
        validator: alertChannelsNotEmptyValiadator
      })
    )
    .put(
      fieldNames.enabled,
      createField({
        value: enabled
      })
    )
    .put(
      fieldNames.triggering,
      createField({
        value: triggering
      })
    )
    .put(
      fieldNames.severity,
      createField({
        value: severity
      })
    )
    .put(
      fieldNames.description,
      createField({
        value: description
      })
    )
    .put(
      fieldNames.name,
      createField({
        value: name
      })
    )
    .put(
      fieldNames.websiteId,
      createField({
        value: websiteId
      })
    )
    .put(
      fieldNames.id,
      createField({
        value: id
      })
    )
    .put(
      fieldNames.thresholdType,
      createField({
        value:
          threshold && threshold.type && threshold.type === 'historicBaseline'
            ? `${threshold.type}.${threshold.seasonality}`
            : 'staticThreshold',
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.thresholdOperator,
      createField({
        value: (threshold && threshold.operator) || '>=',
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.thresholdValue,
      createField({
        value: (threshold && threshold.value) || 0,
        validator: positiveNumberValidator
      })
    )
    .put(
      fieldNames.calculateThresholdOnBackend,
      createField({
        value: calculateThresholdOnBackend
      })
    );

  const alertType = form.get(fieldNames.ruleAlertType).value;

  if (alertType === alertTypes.slowness) {
    const thresholdType = form.get(fieldNames.thresholdType).value;

    if (thresholdType === 'staticThreshold') {
      form = withSlownessFormStaticThreshold(form, threshold, rule);
    }

    if (thresholdType.includes('historicBaseline.')) {
      form = withSlownessFormHistoricBaseline(form, threshold, rule);
    }
  }

  if (alertType === alertTypes.specificJsError) {
    form = withJsErrorsFormSpecificError(form, rule);
  }

  return form;
}

function alertChannelsNotEmptyValiadator(array) {
  if (!array || array.length === 0) {
    return [
      {
        severity: 'error',
        message: 'Please select at least one Alert Channel'
      }
    ];
  }
}

function positiveNumberValidator(num) {
  if (num === '' || num < 0) {
    return [
      {
        severity: 'error',
        message: 'Please provide a number >= 0'
      }
    ];
  }
}
