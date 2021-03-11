/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import getWebsiteRateMetricThresholdSuggestion from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetricThresholdSuggestion';
import getWebsiteMetricsThresholdSuggestion from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteMetricsThresholdSuggestion';
import getWebsiteRateMetricAlertsPreview from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteMetricAlertsPreview';
import getWebsiteRateMetric from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetric';
/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { toTagFilterNumberOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { getBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { percentage, millis, number } from 'in-services/formatters/number';
import { availableFilterTags } from 'in-websites/tags';
import { isNotBlank } from 'in-services/util/string';

const jsErrorMetricLabelsByName = Object.freeze({
  errors: t('in-alerting:smartAlerts.websites.data.errorCount'),
  specificJsErrorRate: t('in-alerting:smartAlerts.websites.data.specificJsErrorRate')
});

const statusCodeMetricLabelsByName = Object.freeze({
  httpxxx: t('in-alerting:smartAlerts.websites.data.statusCodeCount'),
  specificStatusCodeRate: t('in-alerting:smartAlerts.websites.data.specificStatusCodeRate')
});

const throughputMetricLabelsByName = Object.freeze({
  pageLoads: t('in-alerting:smartAlerts.websites.data.pageLoads'),
  pageTransitions: t('in-alerting:smartAlerts.websites.data.pageTransitions')
});

const baseBlueprint = Object.freeze({
  isCustomRateMetric: isCustomRateMetric,
  getMetricsRequest: metricName => (isCustomRateMetric(metricName) ? getWebsiteRateMetric : getWebsiteMetrics),
  getAlertsPreviewRequest: metricName =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetricAlertsPreview : getWebsiteMetricAlertsPreview,
  getThresholdSuggestionRequest: metricName =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetricThresholdSuggestion : getWebsiteMetricsThresholdSuggestion,
  thresholdDefaults: {
    operator: '>='
  },
  getEntityTagFilterFormModel: alertConfig => tagFilter('beacon.website.id', 'EQUALS', alertConfig.websiteId),
  getBeaconType: () => 'pageLoad',
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: () => []
});

const slownessBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'slowness',
  name: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigHeadline'),
  text:
    `
      <p>
      ` +
    t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextP') +
    `
      </p>
      <ul>
        <li>` +
    t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli1') +
    `</li>
        <li>` +
    t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli2') +
    `</li>
        <li>` +
    t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli3') +
    `</li>
        <li>` +
    t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli4') +
    `</li>
        <li>` +
    t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli5') +
    `</li>
      <ul>
    `,
  getAvailableTags: () => getIncludedTags(availableFilterTags.pageLoad),
  baselineEnabled: true,
  defaultMetric: 'onLoadTime',
  getMetricName: () => 'onLoadTime',
  getMetricLabel: () => t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigMetricLabel'),
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: alertRule => alertRule.aggregation,
  isRuleComplete: () => true,
  getRuleTagFilterFormModel: () => [],
  getBeaconType: () => 'pageLoad',
  getExtraAnalyzeLinkTagFilterFormModel: getExtraSlownessAnalyzeLinkTagFilterFormModel
});

const jsErrorsBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'specificJsError',
  name: t('in-alerting:smartAlerts.websites.data.jsErrorsBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.jsErrorsBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.websites.data.jsErrorsBlueprintConfigText'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.error),
  baselineEnabled: false,
  defaultMetric: 'errors',
  getMetricName: alertRule => alertRule.metricName,
  getMetricLabel: metricName => jsErrorMetricLabelsByName[metricName],
  getMetricFormat: metricName => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: metricName => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  getAggregation: alertRule => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  isRuleComplete: alertRule => isNotBlank(alertRule.value),
  incompleteRuleMessage: t('in-alerting:smartAlerts.websites.data.jsErrorsBlueprintConfigIncompleteRuleMessage'),
  getRuleTagFilterFormModel: alertRule => [tagFilter('beacon.error.message', alertRule.operator, alertRule.value)],
  getBeaconType: () => 'error',
  getExtraAnalyzeLinkTagFilterFormModel: () => [] // TODO in AP error blueprint, we add a call.erroneous filter, to only show erroneous calls, in WebsiteSmartAlerts we never did that. Ask PM whether we want to add such filter for Websites as well.
});

const statusCodeBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigText'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.httpRequest),
  baselineEnabled: false,
  defaultMetric: 'httpxxx',
  getMetricName: alertRule => alertRule.metricName,
  getMetricLabel: metricName => statusCodeMetricLabelsByName[metricName],
  getMetricFormat: metricName => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: metricName => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  getAggregation: alertRule => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  isRuleComplete: alertRule => isNotBlank(alertRule.value),
  incompleteRuleMessage: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigIncompleteRuleMessage'),
  getRuleTagFilterFormModel: alertRule => [tagFilter('beacon.http.status', alertRule.operator, alertRule.value)],
  getBeaconType: () => 'httpRequest'
});

const throughputBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  name: t('in-alerting:smartAlerts.websites.data.throughputBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.throughputBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.websites.data.throughputBlueprintConfigText'),
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
  getRuleTagFilterFormModel: () => [],
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
    name: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedDropName'),
    headline: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedDropHeadline'),
    text: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedDropText'),
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: alertThreshold => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberName'),
    headline: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberHeadline'),
    text: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberText'),
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
