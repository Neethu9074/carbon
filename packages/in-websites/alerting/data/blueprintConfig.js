/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getWebsiteRateMetricThresholdSuggestion from 'in-websites/alerting/subscriptions/getWebsiteRateMetricThresholdSuggestion';
import getWebsiteMetricsThresholdSuggestion from 'in-websites/alerting/subscriptions/getWebsiteMetricsThresholdSuggestion';
import getWebsiteRateMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteMetricAlertsPreview';
import getWebsiteRateMetric from 'in-websites/alerting/subscriptions/getWebsiteRateMetric';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { percentage, millis, number } from 'in-services/formatters/number';
import { availableFilterTags } from 'in-websites/tags';
import { isNotBlank } from 'in-services/util/string';

const jsErrorMetricLabelsByName = Object.freeze({
  errors: 'Error Count',
  specificJsErrorRate: 'Error Rate'
});

const statusCodeMetricLabelsByName = Object.freeze({
  httpxxx: 'Status Code Count',
  specificStatusCodeRate: 'Status Code Rate'
});

const throughputMetricLabelsByName = Object.freeze({
  pageLoads: 'Page Loads',
  pageTransitions: 'Page Transitions'
});

const baseBlueprint = Object.freeze({
  isCustomRateMetric: isCustomRateMetric,
  getMetricsRequest: metricName => (isCustomRateMetric(metricName) ? getWebsiteRateMetric : getWebsiteMetrics),
  getAlertsPreviewRequest: metricName =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetricAlertsPreview : getWebsiteMetricAlertsPreview,
  getThresholdSuggestionRequest: metricName =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetricThresholdSuggestion : getWebsiteMetricsThresholdSuggestion,
  getEntityTagFilter: getWebsiteIdTagFilter,
  thresholdDefaults: {
    operator: '>='
  }
});

const slownessBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'slowness',
  name: 'Slowness',
  headline: 'Automatic Alerts for onLoad Time',
  text: `
      <p>
      OnLoad Time measures the time passed in between the user navigating to a website and being able to interact with the website.
      </p>
      <ul>
        <li>Getting all markup, replaced element content and embeds from server</li>
        <li>Parsing the markup</li>
        <li>Applying CSS cascade</li>
        <li>Rendering the page</li>
        <li>Running all scripts that need to run on page load</li>
      <ul>
    `,
  getAvailableTags: () => getIncludedTags(availableFilterTags.pageLoad),
  baselineEnabled: true,
  defaultMetric: 'onLoadTime',
  getMetricName: () => 'onLoadTime',
  getMetricLabel: () => 'onLoad Time',
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: alertRule => alertRule.aggregation,
  isRuleComplete: () => true,
  getRuleTagFilters: () => []
});

const jsErrorsBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'specificJsError',
  name: 'JS Errors',
  headline: 'Automatic Alerts for JS Errors',
  text: 'Receive an alert every time when matching JS Error messages occur more often than usual.',
  getAvailableTags: () => getIncludedTags(availableFilterTags.error),
  baselineEnabled: false,
  defaultMetric: 'errors',
  getMetricName: alertRule => alertRule.metricName,
  getMetricLabel: metricName => jsErrorMetricLabelsByName[metricName],
  getMetricFormat: metricName => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: metricName => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  getAggregation: alertRule => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  isRuleComplete: alertRule => isNotBlank(alertRule.value),
  incompleteRuleMessage: 'Please select a JS Error to see when this alert triggers',
  getRuleTagFilters: alertRule => [getJsErrorsTagFilter(alertRule)]
});

const statusCodeBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: 'HTTP Status Codes',
  headline: 'Automatic Alerts for HTTP Status Codes',
  text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.',
  getAvailableTags: () => getIncludedTags(availableFilterTags.httpRequest),
  baselineEnabled: false,
  defaultMetric: 'httpxxx',
  getMetricName: alertRule => alertRule.metricName,
  getMetricLabel: metricName => statusCodeMetricLabelsByName[metricName],
  getMetricFormat: metricName => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: metricName => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  getAggregation: alertRule => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  isRuleComplete: alertRule => isNotBlank(alertRule.value),
  incompleteRuleMessage: 'Please select a Status Code to see when this alert triggers',
  getRuleTagFilters: alertRule => [getStatusCodeTagFilter(alertRule)]
});

const throughputBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  name: 'Throughput',
  headline: 'Automatic Alerts for Page Views',
  text:
    'Automatic alerts on anomalously low or high number of Page Loads or Page Transitions for selected pages of this Website.',
  getAvailableTags: metricName =>
    getIncludedTags(metricName === 'pageLoads' ? availableFilterTags.pageLoad : availableFilterTags.pageChange),
  baselineEnabled: true,
  defaultMetric: 'pageLoads',
  getMetricName: alertRule => alertRule.metricName,
  getMetricLabel: metricName => throughputMetricLabelsByName[metricName],
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  isRuleComplete: () => true,
  getRuleTagFilters: () => [],
  impactTimeThresholdDisabled: true
});

export const blueprintConfigs = Object.freeze([
  slownessBlueprintConfig,
  jsErrorsBlueprintConfig,
  statusCodeBlueprintConfig,
  throughputBlueprintConfig
]);

export const simpleModeBlueprintConfigs = Object.freeze([
  slownessBlueprintConfig,
  jsErrorsBlueprintConfig,
  statusCodeBlueprintConfig,
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedDrop',
    name: 'Unexpectedly Low Number of Page Loads',
    headline: 'Automatic Alerts on Anomalously Low Number of Page Loads',
    text:
      'Receive an alert when the number of Page Loads is significantly lower than expected compared to the available past data.',
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: alertThreshold => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: 'Unexpectedly High Number of Page Loads',
    headline: 'Automatic Alerts on Anomalously High Number of Page Loads',
    text:
      'Receive an alert when the number of Page Loads is significantly higher than expected compared to the available past data. This might be an indication of an attack or a bot generating too many requests to the website.',
    isSelected: alertThreshold => alertThreshold.operator === '>=' || alertThreshold.operator === '>'
  }
]);

const excludedWebsiteTags = Object.freeze(['beacon.website.id', 'beacon.website.name']);

function getIncludedTags(tagCatalog) {
  return tagCatalog.filter(tag => !excludedWebsiteTags.includes(tag));
}

export function getBlueprintConfig(alertType) {
  return blueprintConfigs.find(blueprint => blueprint.type === alertType);
}

export function getSimpleModeBlueprintConfig(alertType, alertThreshold) {
  return simpleModeBlueprintConfigs
    .filter(blueprint => blueprint.type === alertType)
    .find(blueprint => !blueprint.isSelected || blueprint.isSelected(alertThreshold));
}

function isCustomRateMetric(metricName) {
  return metricName === 'specificJsErrorRate' || metricName === 'specificStatusCodeRate';
}

function getWebsiteIdTagFilter(alertConfig) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: alertConfig.websiteId
  };
}

function getJsErrorsTagFilter(alertRule) {
  return {
    name: 'beacon.error.message',
    operator: alertRule.operator,
    stringValue: alertRule.value
  };
}

function getStatusCodeTagFilter(alertRule) {
  return {
    name: 'beacon.http.status',
    operator: alertRule.operator,
    stringValue: alertRule.value
  };
}
