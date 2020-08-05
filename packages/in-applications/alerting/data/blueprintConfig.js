import getApplicationMetricsThresholdSuggestion from 'in-applications/alerting/subscriptions/getApplicationMetricsThresholdSuggestion';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { percentage, millis, number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';

const baseBlueprint = Object.freeze({
  isCustomRateMetric: () => false,
  getMetricsRequest: () => getApplicationMetrics,
  getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
  getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
  thresholdDefaults: {
    operator: '>='
  },
  getEntityTagFilter: getApplicationIdTagFilter
});

const slownessBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'slowness',
  blacklistedTagFilters: ['call.latency'],
  name: 'Slow Calls',
  headline: 'Automatic Alerts for Slow Calls',
  text:
    'Receive an alert when calls to selected services and endpoints of this Application Perspective are slower than usual.',
  baselineEnabled: true,
  defaultMetric: 'latency',
  getMetricName: () => 'latency',
  getMetricLabel: () => 'Latency',
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => undefined,
  getAggregation: alertRule => alertRule.aggregation,
  isRuleComplete: () => true,
  getRuleTagFilters: () => []
});

const errorRateBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'errorRate',
  blacklistedTagFilters: ['call.erroneous', 'call.error.count', 'call.error.message'],
  name: 'Erroneous Calls',
  headline: 'Automatic Alerts for Erroneous Calls',
  text:
    'Receive an alert when the rate of erroneous calls for selected services and endpoints of this Application Perspective is higher than normal.',
  baselineEnabled: false,
  defaultMetric: 'errors',
  getMetricName: () => 'errors',
  getMetricLabel: () => 'Error Rate',
  getMetricFormat: () => percentage.detailed,
  getMaxMetricValue: () => 100,
  getAggregation: () => 'MEAN',
  isRuleComplete: () => true,
  getRuleTagFilters: () => []
});

const logsBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'logs',
  blacklistedTagFilters: ['log.message', 'log.level'],
  name: 'Error and Warning Logs',
  headline: 'Automatic Alerts for Error and Warning Logs',
  text:
    'Receive an alert when the number of calls logging matching error and warning messages is higher than expected.',
  baselineEnabled: false,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => 'Logs Count',
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => undefined,
  getAggregation: () => 'SUM',
  isRuleComplete: alertRule => isNotBlank(alertRule.message),
  incompleteRuleMessage: 'Please select a Log Message to see when this alert triggers',
  getRuleTagFilters: getLogLevelTagFilters
});

const statusCodeBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  blacklistedTagFilters: ['call.http.status'],
  name: 'HTTP Status Codes',
  headline: 'Automatic Alerts for HTTP Status Codes',
  text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.',
  baselineEnabled: false,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => 'Status Code',
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => undefined,
  getAggregation: () => 'SUM',
  isRuleComplete: alertRule => !!(alertRule.statusCodeStart && alertRule.statusCodeEnd),
  incompleteRuleMessage: 'Please select a Status Code to see when this alert triggers',
  getRuleTagFilters: getStatusCodeTagFilters
});

const throughputBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  blacklistedTagFilters: [],
  name: 'Throughput',
  headline: 'Automatic Alerts on Call Throughput Violations',
  text: 'Receive an alert every time the number of calls significantly differs from the usual call throughput.',
  baselineEnabled: true,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => 'Calls',
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => undefined,
  getAggregation: () => 'SUM',
  isRuleComplete: () => true,
  getRuleTagFilters: () => [],
  impactTimeThresholdDisabled: true
});

export const blueprintConfigs = Object.freeze([
  slownessBlueprintConfig,
  errorRateBlueprintConfig,
  logsBlueprintConfig,
  statusCodeBlueprintConfig,
  throughputBlueprintConfig
]);

export const simpleModeBlueprintConfigs = Object.freeze([
  slownessBlueprintConfig,
  errorRateBlueprintConfig,
  logsBlueprintConfig,
  statusCodeBlueprintConfig,
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedDrop',
    name: 'Unexpected drop in calls',
    headline: 'Automatic Alerts for Unexpected Drop in Calls',
    text:
      'You will be alerted every time the number of calls significantly dropped below the expected number of calls in a time window of 10 minutes.',
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: alertThreshold => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: 'Unexpectedly high number of calls',
    headline: 'Automatic Alerts for Unexpectedly High Number of Calls',
    text:
      'You will be alerted every time the number of calls significantly higher than the expected number of calls in a time window of 10 minutes.',
    isSelected: alertThreshold => alertThreshold.operator === '>=' || alertThreshold.operator === '>'
  }
]);

export function getBlueprintConfig(alertType) {
  return blueprintConfigs.find(blueprint => blueprint.type === alertType);
}

export function getSimpleModeBlueprintConfig(alertType, alertThreshold) {
  return simpleModeBlueprintConfigs
    .filter(blueprint => blueprint.type === alertType)
    .find(blueprint => !blueprint.isSelected || blueprint.isSelected(alertThreshold));
}

export function blacklistedTagFiltersOfAlertType(alertType) {
  const config = getBlueprintConfig(alertType);
  if (config) {
    return [...config.blacklistedTagFilters];
  }
  return [];
}

function getApplicationIdTagFilter(alertConfig) {
  return {
    name: alertConfig.boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
    operator: 'EQUALS',
    stringValue: alertConfig.applicationId
  };
}

function getLogLevelTagFilters(alertRule) {
  const tagFilters = [];
  tagFilters.push({
    name: 'log.message',
    operator: alertRule.operator,
    stringValue: alertRule.message
  });
  if (alertRule.level !== 'ANY') {
    tagFilters.push({
      name: 'log.level',
      operator: 'EQUALS',
      stringValue: alertRule.level
    });
  }
  return tagFilters;
}

function getStatusCodeTagFilters(alertRule) {
  const tagFilters = [];
  if (alertRule.statusCodeStart === alertRule.statusCodeEnd) {
    tagFilters.push({
      name: 'call.http.status',
      operator: 'EQUALS',
      numberValue: alertRule.statusCodeStart
    });
  } else {
    tagFilters.push({
      name: 'call.http.status',
      operator: 'GREATER_OR_EQUAL_THAN',
      numberValue: alertRule.statusCodeStart
    });
    tagFilters.push({
      name: 'call.http.status',
      operator: 'LESS_OR_EQUAL_THAN',
      numberValue: alertRule.statusCodeEnd
    });
  }
  return tagFilters;
}
