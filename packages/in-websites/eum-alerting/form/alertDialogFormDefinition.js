import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { operators } from 'in-analyze/applicationFilter';

const severityWarning = 5;
const severityCritical = 10;

export const fieldNames = Object.freeze({
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
  thresholdOperator: 'thresholdOperator',
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
  [fieldNames.thresholdOperator]: Object.freeze([{ value: '>=', label: '≥' }]),
  [fieldNames.severity]: Object.freeze([
    { value: severityWarning, label: 'Warning' },
    { value: severityCritical, label: 'Critical' }
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
      fieldNames.ruleOperator,
      createField({
        value: rule && rule.operator,
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.ruleValue,
      createField({
        value: rule && rule.value,
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.ruleMetricName,
      createField({
        value: (rule && rule.metricName) || selectOptions[fieldNames.ruleMetricName][1].value,
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
      fieldNames.thresholdValue,
      createField({
        value: (threshold && threshold.value) || 0,
        validator: positiveNumberValidator
      })
    )
    .put(
      fieldNames.thresholdType,
      createField({
        value: (threshold && threshold.type) || 'staticThreshold',
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.thresholdOperator,
      createField({
        value: (threshold && threshold.operator) || selectOptions[fieldNames.thresholdOperator][0].value,
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.calculateThresholdOnBackend,
      createField({
        value: calculateThresholdOnBackend
      })
    );

  return form;
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
