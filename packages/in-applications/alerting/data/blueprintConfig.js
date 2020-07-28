import PropTypes from 'prop-types';

import getApplicationMetricsThresholdSuggestion from 'in-applications/alerting/subscriptions/getApplicationMetricsThresholdSuggestion';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { percentage, millis, number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';

export const blueprintConfig = Object.freeze([
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
    getMetricName: () => 'calls',
    getMetricLabel: () => 'Status Code',
    getMetricFormat: () => number.forcedCompact,
    getMaxMetricValue: () => undefined,
    getAggregation: () => 'SUM',
    isRuleComplete: alertRule => !!(alertRule.statusCodeStart && alertRule.statusCodeEnd),
    incompleteRuleMessage: 'Please select a Status Code to see when this alert triggers',
    getRuleTagFilters: getStatusCodeTagFilters,
    getEntityTagFilter: getApplicationIdTagFilter
  }
]);

export function getBlueprintConfig(alertType) {
  return blueprintConfig.find(blueprint => blueprint.type === alertType);
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

export const blueprintConfigPropType = {
  blacklistedTagFilters: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  name: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  baselineEnabled: PropTypes.bool.isRequired,
  isCustomRateMetric: PropTypes.func.isRequired,
  getMetricsRequest: PropTypes.func.isRequired,
  getAlertsPreviewRequest: PropTypes.func.isRequired,
  getThresholdSuggestionRequest: PropTypes.func.isRequired,
  getMetricName: PropTypes.func.isRequired,
  getMetricLabel: PropTypes.func.isRequired,
  getMetricFormat: PropTypes.func.isRequired,
  getMaxMetricValue: PropTypes.func.isRequired,
  getAggregation: PropTypes.func.isRequired,
  isRuleComplete: PropTypes.func.isRequired,
  getRuleTagFilters: PropTypes.func.isRequired,
  getEntityTagFilter: PropTypes.func.isRequired
};
