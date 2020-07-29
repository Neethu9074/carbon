import getApplicationMetricsThresholdSuggestion from 'in-applications/alerting/subscriptions/getApplicationMetricsThresholdSuggestion';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { percentage, millis, number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';

export const blueprintConfigs = Object.freeze([
  {
    type: 'slowness',
    blacklistedTagFilters: ['call.latency'],
    name: 'Slow Calls',
    headline: 'Automatic Alerts for Slow Calls',
    text:
      'Receive an alert when calls to selected services and endpoints of this Application Perspective are slower than usual.',
    baselineEnabled: true,
    isCustomRateMetric: () => false,
    getMetricsRequest: () => getApplicationMetrics,
    getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
    getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
    defaultMetric: 'latency',
    getMetricName: () => 'latency',
    getMetricLabel: () => 'Latency',
    getMetricFormat: () => millis.forcedFixedCompact,
    getMaxMetricValue: () => undefined,
    getAggregation: alertRule => alertRule.aggregation,
    isRuleComplete: () => true,
    getRuleTagFilters: () => [],
    getEntityTagFilter: getApplicationIdTagFilter
  },
  {
    type: 'errorRate',
    blacklistedTagFilters: ['call.erroneous', 'call.error.count', 'call.error.message'],
    name: 'Erroneous Calls',
    headline: 'Automatic Alerts for Erroneous Calls',
    text:
      'Receive an alert when the rate of erroneous calls for selected services and endpoints of this Application Perspective is higher than normal.',
    baselineEnabled: false,
    isCustomRateMetric: () => false,
    getMetricsRequest: () => getApplicationMetrics,
    getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
    getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
    defaultMetric: 'errors',
    getMetricName: () => 'errors',
    getMetricLabel: () => 'Error Rate',
    getMetricFormat: () => percentage.detailed,
    getMaxMetricValue: () => 100,
    getAggregation: () => 'MEAN',
    isRuleComplete: () => true,
    getRuleTagFilters: () => [],
    getEntityTagFilter: getApplicationIdTagFilter
  },
  {
    type: 'logs',
    blacklistedTagFilters: ['log.message', 'log.level'],
    name: 'Error and Warning Logs',
    headline: 'Automatic Alerts for Error and Warning Logs',
    text:
      'Receive an alert when the number of calls logging matching error and warning messages is higher than expected.',
    baselineEnabled: false,
    isCustomRateMetric: () => false,
    getMetricsRequest: () => getApplicationMetrics,
    getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
    getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
    defaultMetric: 'calls',
    getMetricName: () => 'calls',
    getMetricLabel: () => 'Logs Count',
    getMetricFormat: () => number.forcedCompact,
    getMaxMetricValue: () => undefined,
    getAggregation: () => 'SUM',
    isRuleComplete: alertRule => isNotBlank(alertRule.message),
    incompleteRuleMessage: 'Please select a Log Message to see when this alert triggers',
    getRuleTagFilters: getLogLevelTagFilters,
    getEntityTagFilter: getApplicationIdTagFilter
  },
  {
    type: 'statusCode',
    blacklistedTagFilters: ['call.http.status'],
    name: 'HTTP Status Codes',
    headline: 'Automatic Alerts for HTTP Status Codes',
    text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.',
    baselineEnabled: false,
    isCustomRateMetric: () => false,
    getMetricsRequest: () => getApplicationMetrics,
    getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
    getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
    defaultMetric: 'calls',
    getMetricName: () => 'calls',
    getMetricLabel: () => 'Status Code',
    getMetricFormat: () => number.forcedCompact,
    getMaxMetricValue: () => undefined,
    getAggregation: () => 'SUM',
    isRuleComplete: alertRule => !!(alertRule.statusCodeStart && alertRule.statusCodeEnd),
    incompleteRuleMessage: 'Please select a Status Code to see when this alert triggers',
    getRuleTagFilters: getStatusCodeTagFilters,
    getEntityTagFilter: getApplicationIdTagFilter
  },
  {
    type: 'throughput',
    blacklistedTagFilters: [],
    name: 'Throughput',
    headline: 'Automatic Alerts on Call Throughput Violations',
    text: 'Receive an alert every time the number of calls significantly differs from the usual call throughput.',
    baselineEnabled: true,
    isCustomRateMetric: () => false,
    getMetricsRequest: () => getApplicationMetrics,
    getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
    getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
    defaultMetric: 'calls',
    getMetricName: () => 'calls',
    getMetricLabel: () => 'Calls',
    getMetricFormat: () => number.forcedCompact,
    getMaxMetricValue: () => undefined,
    getAggregation: () => 'SUM',
    isRuleComplete: () => true,
    getRuleTagFilters: () => [],
    getEntityTagFilter: getApplicationIdTagFilter,
    impactTimeThresholdDisabled: true
  }
]);

export function getBlueprintConfig(alertType) {
  return blueprintConfigs.find(blueprint => blueprint.type === alertType);
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
