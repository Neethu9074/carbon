import getWebsiteRateMetricThresholdSuggestion from 'in-websites/alerting/subscriptions/getWebsiteRateMetricThresholdSuggestion';
import getWebsiteMetricsThresholdSuggestion from 'in-websites/alerting/subscriptions/getWebsiteMetricsThresholdSuggestion';
import getWebsiteRateMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteMetricAlertsPreview';
import getWebsiteRateMetric from 'in-websites/alerting/subscriptions/getWebsiteRateMetric';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { percentage, millis, number } from 'in-services/formatters/number';
import { availableFilterTags, commonFilterTags } from 'in-websites/tags';
import { isNotBlank } from 'in-services/util/string';

const slowness = 'slowness';
const specificStatusCode = 'statusCode';
const specificJsError = 'specificJsError';

export const alertTypes = Object.freeze({ specificJsError, slowness, specificStatusCode });

const jsErrorMetricLabelsByName = Object.freeze({
  errors: 'Error Count',
  specificJsErrorRate: 'Error Rate'
});

const statusCodeMetricLabelsByName = Object.freeze({
  httpxxx: 'Status Code Count',
  specificStatusCodeRate: 'Status Code Rate'
});

export const blueprintConfigs = Object.freeze([
  {
    type: slowness,
    name: 'Slowness',
    blacklistedTagFilters: ['beacon.duration'],
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
    baselineEnabled: true,
    isCustomRateMetric: () => false,
    getMetricsRequest: () => getWebsiteMetrics,
    getAlertsPreviewRequest: () => getWebsiteMetricAlertsPreview,
    getThresholdSuggestionRequest: () => getWebsiteMetricsThresholdSuggestion,
    defaultMetric: 'onLoadTime',
    getMetricName: () => 'onLoadTime',
    getMetricLabel: () => 'onLoad Time',
    getMetricFormat: () => millis.forcedFixedCompact,
    getMaxMetricValue: () => undefined,
    getAggregation: alertRule => alertRule.aggregation,
    isRuleComplete: () => true,
    getRuleTagFilters: () => [],
    getEntityTagFilter: getWebsiteIdTagFilter
  },
  {
    type: specificJsError,
    name: 'JS Errors',
    blacklistedTagFilters: ['beacon.error.message'],
    headline: 'Automatic Alerts for JS Errors',
    text: 'Receive an alert every time when matching JS Error messages occur more often than usual.',
    baselineEnabled: false,
    isCustomRateMetric: isCustomRateMetric,
    getMetricsRequest: metricName => (isCustomRateMetric(metricName) ? getWebsiteRateMetric : getWebsiteMetrics),
    getAlertsPreviewRequest: metricName =>
      isCustomRateMetric(metricName) ? getWebsiteRateMetricAlertsPreview : getWebsiteMetricAlertsPreview,
    getThresholdSuggestionRequest: metricName =>
      isCustomRateMetric(metricName) ? getWebsiteRateMetricThresholdSuggestion : getWebsiteMetricsThresholdSuggestion,
    defaultMetric: 'errors',
    getMetricName: alertRule => alertRule.metricName,
    getMetricLabel: metricName => jsErrorMetricLabelsByName[metricName],
    getMetricFormat: metricName => (isCustomRateMetric(metricName) ? percentage.detailed : number.forcedCompact),
    getMaxMetricValue: metricName => (isCustomRateMetric(metricName) ? 100 : undefined),
    getAggregation: alertRule => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
    isRuleComplete: alertRule => isNotBlank(alertRule.value),
    incompleteRuleMessage: 'Please select a JS Error to see when this alert triggers',
    getRuleTagFilters: alertRule => [getJsErrorsTagFilter(alertRule)],
    getEntityTagFilter: getWebsiteIdTagFilter
  },
  {
    type: specificStatusCode,
    name: 'HTTP Status Codes',
    blacklistedTagFilters: ['beacon.http.status'],
    headline: 'Automatic Alerts for HTTP Status Codes',
    text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.',
    baselineEnabled: false,
    isCustomRateMetric: isCustomRateMetric,
    getMetricsRequest: metricName => (isCustomRateMetric(metricName) ? getWebsiteRateMetric : getWebsiteMetrics),
    getAlertsPreviewRequest: metricName =>
      isCustomRateMetric(metricName) ? getWebsiteRateMetricAlertsPreview : getWebsiteMetricAlertsPreview,
    getThresholdSuggestionRequest: metricName =>
      isCustomRateMetric(metricName) ? getWebsiteRateMetricThresholdSuggestion : getWebsiteMetricsThresholdSuggestion,
    defaultMetric: 'httpxxx',
    getMetricName: alertRule => alertRule.metricName,
    getMetricLabel: metricName => statusCodeMetricLabelsByName[metricName],
    getMetricFormat: metricName => (isCustomRateMetric(metricName) ? percentage.detailed : number.forcedCompact),
    getMaxMetricValue: metricName => (isCustomRateMetric(metricName) ? 100 : undefined),
    getAggregation: alertRule => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
    isRuleComplete: alertRule => isNotBlank(alertRule.value),
    incompleteRuleMessage: 'Please select a Status Code to see when this alert triggers',
    getRuleTagFilters: alertRule => [getStatusCodeTagFilter(alertRule)],
    getEntityTagFilter: getWebsiteIdTagFilter
  }
]);

export function getBlueprintConfig(alertType) {
  return blueprintConfigs.find(blueprint => blueprint.type === alertType);
}

export const availableTagFiltersPerAlertType = {
  [specificJsError]: commonFilterTags,
  [slowness]: availableFilterTags.pageLoad,
  [specificStatusCode]: availableFilterTags.httpRequest
};

export function blacklistedTagFiltersOfAlertType(alertType) {
  const config = getBlueprintConfig(alertType);
  if (config) {
    return [...config.blacklistedTagFilters];
  }
  return [];
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
