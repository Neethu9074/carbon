import getApplicationMetricsThresholdSuggestion from 'in-applications/alerting/subscriptions/getApplicationMetricsThresholdSuggestion';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { percentage, millis, number } from 'in-services/formatters/number';
import { getAnalyzeFilterTagKeys } from 'in-applications/tags';
import { isNotBlank } from 'in-services/util/string';

const baseBlueprint = Object.freeze({
  isCustomRateMetric: () => false,
  getMetricsRequest: () => getApplicationMetrics,
  getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
  getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
  thresholdDefaults: {
    operator: '>='
  },
  getEntityTagFilter: getApplicationIdTagFilter,
  // Note: had to keep the disabled tagFilters separate from this, because of test-dependencies within
  // in-applications/tags_test.js related to the only once-registered set of tags via getAnalyzeFilterTagKeys()
  getAllTagFilters: () => getAnalyzeFilterTagKeys()
});

const slownessBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'slowness',
  name: 'Slow Calls',
  headline: 'Automatic Alerts for Slow Calls',
  text:
    'Receive an alert when calls to selected services and endpoints of this Application Perspective are slower than usual.',
  disabledTagFilters: createDisableList(['call.latency']),
  baselineEnabled: true,
  defaultMetric: 'latency',
  getMetricName: () => 'latency',
  getMetricLabel: () => 'Latency',
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: alertRule => alertRule.aggregation,
  isRuleComplete: () => true,
  getRuleTagFilters: () => []
});

const errorRateBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'errorRate',
  name: 'Erroneous Calls',
  headline: 'Automatic Alerts for Erroneous Calls',
  text:
    'Receive an alert when the rate of erroneous calls for selected services and endpoints of this Application Perspective is higher than normal.',
  disabledTagFilters: createDisableList(['call.erroneous', 'call.error.count', 'call.error.message']),
  baselineEnabled: false,
  defaultMetric: 'errors',
  getMetricName: () => 'errors',
  getMetricLabel: () => 'Error Rate',
  getMetricFormat: () => percentage,
  getMaxMetricValue: () => 100,
  getAggregation: () => 'MEAN',
  isRuleComplete: () => true,
  getRuleTagFilters: () => []
});

const logsBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'logs',
  name: 'Error and Warning Logs',
  headline: 'Automatic Alerts for Error and Warning Logs',
  text:
    'Receive an alert when the number of calls logging matching error and warning messages is higher than expected.',
  disabledTagFilters: createDisableList(['log.message', 'log.level']),
  baselineEnabled: false,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => 'Logs Count',
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  isRuleComplete: alertRule => isNotBlank(alertRule.message),
  incompleteRuleMessage: 'Please select a Log Message to see when this alert triggers',
  getRuleTagFilters: getLogLevelTagFilters
});

const statusCodeBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: 'HTTP Status Codes',
  headline: 'Automatic Alerts for HTTP Status Codes',
  text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.',
  disabledTagFilters: createDisableList(['call.http.status']),
  baselineEnabled: false,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => 'Status Code',
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  isRuleComplete: alertRule => !!(alertRule.statusCodeStart && alertRule.statusCodeEnd),
  incompleteRuleMessage: 'Please select a Status Code to see when this alert triggers',
  getRuleTagFilters: getStatusCodeTagFilters
});

const throughputBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  name: 'Throughput',
  headline: 'Automatic Alerts for Calls Count',
  text:
    'Automatic alerts on anomalously low or high number of calls for selected services and endpoints of this Application Perspective.',
  disabledTagFilters: createDisableList(),
  baselineEnabled: true,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => 'Calls',
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
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
    name: 'Unexpectedly Low Number of Calls',
    headline: 'Automatic Alerts on Anomalously Low Number of Calls',
    text:
      'Receive an alert when the number of calls is significantly lower than expected compared to the available past data. This might be an indication of a problem upstream of this application or a drop in the user traffic to the application.',
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: alertThreshold => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: 'Unexpectedly High Number of Calls',
    headline: 'Automatic Alerts on Anomalously High Number of Calls',
    text:
      'Receive an alert when the number of calls is significantly higher than expected compared to the available past data. This might be an indication of an attack or a bot generating too many requests to the application.',
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

function createDisableList(disabledTagFilters = []) {
  return ['application.id', 'application.name', 'service.id', 'endpoint.id', ...disabledTagFilters];
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
