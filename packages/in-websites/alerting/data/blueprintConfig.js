/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
  errors: t('in-websites:alerting.data.errorCount'),
  specificJsErrorRate: t('in-websites:alerting.data.specificJsErrorRate')
});

const statusCodeMetricLabelsByName = Object.freeze({
  httpxxx: t('in-websites:alerting.data.statusCodeCount'),
  specificStatusCodeRate: t('in-websites:alerting.data.specificStatusCodeRate')
});

const throughputMetricLabelsByName = Object.freeze({
  pageLoads: t('in-websites:alerting.data.pageLoads'),
  pageTransitions: t('in-websites:alerting.data.pageTransitions')
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
  name: t('in-websites:alerting.data.slownessBlueprintConfigName'),
  headline: t('in-websites:alerting.data.slownessBlueprintConfigHeadline'),
  text:
    `
      <p>
      ` +
    t('in-websites:alerting.data.slownessBlueprintConfigTextP') +
    `
      </p>
      <ul>
        <li>` +
    t('in-websites:alerting.data.slownessBlueprintConfigTextli1') +
    `</li>
        <li>` +
    t('in-websites:alerting.data.slownessBlueprintConfigTextli2') +
    `</li>
        <li>` +
    t('in-websites:alerting.data.slownessBlueprintConfigTextli3') +
    `</li>
        <li>` +
    t('in-websites:alerting.data.slownessBlueprintConfigTextli4') +
    `</li>
        <li>` +
    t('in-websites:alerting.data.slownessBlueprintConfigTextli5') +
    `</li>
      <ul>
    `,
  getAvailableTags: () => getIncludedTags(availableFilterTags.pageLoad),
  baselineEnabled: true,
  defaultMetric: 'onLoadTime',
  getMetricName: () => 'onLoadTime',
  getMetricLabel: () => t('in-websites:alerting.data.slownessBlueprintConfigMetricLabel'),
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: alertRule => alertRule.aggregation,
  isRuleComplete: () => true,
  getRuleTagFilters: () => []
});

const jsErrorsBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'specificJsError',
  name: t('in-websites:alerting.data.jsErrorsBlueprintConfigName'),
  headline: t('in-websites:alerting.data.jsErrorsBlueprintConfigHeadline'),
  text: t('in-websites:alerting.data.jsErrorsBlueprintConfigText'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.error),
  baselineEnabled: false,
  defaultMetric: 'errors',
  getMetricName: alertRule => alertRule.metricName,
  getMetricLabel: metricName => jsErrorMetricLabelsByName[metricName],
  getMetricFormat: metricName => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: metricName => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  getAggregation: alertRule => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  isRuleComplete: alertRule => isNotBlank(alertRule.value),
  incompleteRuleMessage: t('in-websites:alerting.data.jsErrorsBlueprintConfigIncompleteRuleMessage'),
  getRuleTagFilters: alertRule => [getJsErrorsTagFilter(alertRule)]
});

const statusCodeBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: t('in-websites:alerting.data.statusCodeBlueprintConfigName'),
  headline: t('in-websites:alerting.data.statusCodeBlueprintConfigHeadline'),
  text: t('in-websites:alerting.data.statusCodeBlueprintConfigText'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.httpRequest),
  baselineEnabled: false,
  defaultMetric: 'httpxxx',
  getMetricName: alertRule => alertRule.metricName,
  getMetricLabel: metricName => statusCodeMetricLabelsByName[metricName],
  getMetricFormat: metricName => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: metricName => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  getAggregation: alertRule => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  isRuleComplete: alertRule => isNotBlank(alertRule.value),
  incompleteRuleMessage: t('in-websites:alerting.data.statusCodeBlueprintConfigIncompleteRuleMessage'),
  getRuleTagFilters: alertRule => [getStatusCodeTagFilter(alertRule)]
});

const throughputBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  name: t('in-websites:alerting.data.throughputBlueprintConfigName'),
  headline: t('in-websites:alerting.data.throughputBlueprintConfigHeadline'),
  text: t('in-websites:alerting.data.throughputBlueprintConfigText'),
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
    name: t('in-websites:alerting.data.simpleModeBlueprintConfigsUnexpectedDropName'),
    headline: t('in-websites:alerting.data.simpleModeBlueprintConfigsUnexpectedDropHeadline'),
    text: t('in-websites:alerting.data.simpleModeBlueprintConfigsUnexpectedDropText'),
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: alertThreshold => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: t('in-websites:alerting.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberName'),
    headline: t('in-websites:alerting.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberHeadline'),
    text: t('in-websites:alerting.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberText'),
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
