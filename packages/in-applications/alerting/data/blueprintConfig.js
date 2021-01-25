/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getApplicationMetricsThresholdSuggestion from 'in-applications/alerting/subscriptions/getApplicationMetricsThresholdSuggestion';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { AND_CONJUNCTION } from 'in-new-components/Alerting/utils/queryUtils';
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

  // Note: had to keep the disabled tagFilters separate from this, because of test-dependencies within
  // in-applications/tags_test.js related to the only once-registered set of tags via getAnalyzeFilterTagKeys()
  getAvailableTags: getIncludedTags,

  // QB1
  getEntityTagFilters: (alertConfig, serviceId, endpointId) => {
    const tagFilters = [getApplicationIdTagFilter(alertConfig)];
    if (serviceId) {
      tagFilters.push(tagFilter('service.name', 'EQUALS', serviceId));
    }
    if (endpointId) {
      tagFilters.push(tagFilter('endpoint.name', 'EQUALS', endpointId));
    }
    return tagFilters;
  },
  getRuleTagFilters: () => [],

  // QB2
  getEntityTagFilterFormModel: (alertConfig, serviceId, endpointId) => {
    const formModel = [getApplicationIdTagFilter(alertConfig)];
    if (!serviceId && !endpointId) {
      return formModel;
    }

    if (serviceId) {
      formModel.push(AND_CONJUNCTION);
      formModel.push(tagFilter('service.name', 'EQUALS', serviceId));
    }
    if (endpointId) {
      formModel.push(AND_CONJUNCTION);
      formModel.push(tagFilter('endpoint.name', 'EQUALS', endpointId));
    }
    return formModel;
  },
  getRuleTagFilterFormModel: () => []
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
  getRuleTagFilters: () => [], // QB1
  getRuleTagFilterFormModel: () => [] // QB2
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
  getRuleTagFilters: () => [], //QB1
  getRuleTagFilterFormModel: () => [] //QB2
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
  getRuleTagFilters: getLogLevelTagFilters, //QB1
  getRuleTagFilterFormModel: getLogLevelFormModel //QB2
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
  getRuleTagFilters: getStatusCodeTagFilters, //QB1
  getRuleFormModel: getStatusCodeFormModel //QB2
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
  getRuleTagFilters: () => [], //QB1
  getRuleTagFilterFormModel: () => [], //QB2
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

const excludedApplicationTags = Object.freeze(['application.id', 'application.name']);

function getIncludedTags() {
  return getAnalyzeFilterTagKeys().filter(tag => !excludedApplicationTags.includes(tag));
}

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
  return tagFilter(
    alertConfig.boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
    'EQUALS',
    alertConfig.applicationId
  );
}

function getLogLevelTagFilters(alertRule) {
  const tagFilters = [tagFilter('log.message', alertRule.operator, alertRule.message)];
  if (alertRule.level !== 'ANY') {
    tagFilters.push(tagFilter('log.level', 'EQUALS', alertRule.level));
  }
  return tagFilters;
}

function getLogLevelFormModel(alertRule) {
  const formModel = [tagFilter('log.message', alertRule.operator, alertRule.message)];
  if (alertRule.level !== 'ANY') {
    formModel.push(AND_CONJUNCTION);
    formModel.push(tagFilter('log.level', 'EQUALS', alertRule.level));
  }

  return formModel;
}

function getStatusCodeTagFilters(alertRule) {
  const tagFilters = [];
  if (alertRule.statusCodeStart === alertRule.statusCodeEnd) {
    tagFilters.push(tagFilter('call.http.status', 'EQUALS', alertRule.statusCodeStart));
  } else {
    tagFilters.push(tagFilter('call.http.status', 'GREATER_OR_EQUAL_THAN', alertRule.statusCodeStart));
    tagFilters.push(tagFilter('call.http.status', 'LESS_OR_EQUAL_THAN', alertRule.statusCodeEnd));
  }
  return tagFilters;
}

function getStatusCodeFormModel(alertRule) {
  const formModel = [];

  if (alertRule.statusCodeStart === alertRule.statusCodeEnd) {
    formModel.push(tagFilter('call.http.status', 'EQUALS', alertRule.statusCodeStart));
  } else {
    formModel.push(tagFilter('call.http.status', 'GREATER_OR_EQUAL_THAN', alertRule.statusCodeStart));
    formModel.push(AND_CONJUNCTION);
    formModel.push(tagFilter('call.http.status', 'LESS_OR_EQUAL_THAN', alertRule.statusCodeEnd));
  }

  return formModel;
}

function tagFilter(name, operator, value) {
  return { type: 'TAG_FILTER', name, operator, value };
}
