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
import { toTagFilterNumberOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
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
  // QB1
  getEntityTagFilters: alertConfig => [getWebsiteIdTagFilter(alertConfig)],
  thresholdDefaults: {
    operator: '>='
  },
  // QB2
  getEntityTagFilterFormModel: alertConfig => getWebsiteIdTagFilter(alertConfig),
  getBeaconType: () => 'pageLoad',
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: () => []
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
  getRuleTagFilters: () => [], // QB1
  getRuleTagFilterFormModel: () => [], // QB2
  getBeaconType: () => 'pageLoad',
  getExtraAnalyzeLinkTagFilterFormModel: getExtraSlownessAnalyzeLinkTagFilterFormModel
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
  getRuleTagFilters: alertRule => [getJsErrorsTagFilter(alertRule)], // QB1
  getRuleTagFilterFormModel: alertRule => [tagFilter('beacon.error.message', alertRule.operator, alertRule.value)], // QB2
  getBeaconType: () => 'error',
  getExtraAnalyzeLinkTagFilterFormModel: () => [] // TODO in AP error blueprint, we add a call.erroneous filter, to only show erroneous calls, in WebsiteSmartAlerts we never did that. Ask PM whether we want to add such filter for Websites as well.
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
  getRuleTagFilters: alertRule => [getStatusCodeTagFilter(alertRule)], // QB1
  getRuleTagFilterFormModel: alertRule => [tagFilter('beacon.http.status', alertRule.operator, alertRule.value)], // QB2
  getBeaconType: () => 'httpRequest'
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
  getRuleTagFilters: () => [], // QB1
  getRuleTagFilterFormModel: () => [], // QB2
  getBeaconType: metricName => (metricName === 'pageLoads' ? 'pageLoad' : 'pageChange'),
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
    ...tagFilter('beacon.website.id', 'EQUALS', alertConfig.websiteId),
    stringValue: alertConfig.websiteId // TODO only kept for QB1 backward compatibility. Can actually be removed.
  };
}

function getJsErrorsTagFilter(alertRule) {
  return {
    ...tagFilter('beacon.error.message', alertRule.operator, alertRule.value),
    stringValue: alertRule.value // TODO only kept for QB1 backward compatibility. Can actually be removed.
  };
}

function getStatusCodeTagFilter(alertRule) {
  return {
    ...tagFilter('beacon.http.status', alertRule.operator, alertRule.value),
    stringValue: alertRule.value // TODO only kept for QB1 backward compatibility. Can actually be removed.
  };
}

function getExtraSlownessAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig) {
  let value;
  if (alertConfig.threshold.type === 'staticThreshold') {
    value = alertConfig.threshold.value;
  } else {
    value = getBaselineThresholdValue(alertConfig, timeConfig);
  }

  return [tagFilter('beacon.duration', toTagFilterNumberOperator(alertConfig.threshold.operator), value)];
}

export function getBaselineThresholdValue(alertConfig, timeConfig) {
  const { operator, baseline, deviationFactor } = alertConfig.threshold;
  const baselineGranularity = alertConfig.granularity;
  const isGreaterOp = operator === '>=' || operator === '>';

  const baselineValues = [];
  for (let time = timeConfig.to - timeConfig.windowSize; time <= timeConfig.to; time += baselineGranularity) {
    baselineValues.push(getBaselineValue(time, baseline, deviationFactor, baselineGranularity, isGreaterOp));
  }
  return isGreaterOp ? Math.min(...baselineValues) : Math.max(...baselineValues);
}
