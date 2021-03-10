/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getApplicationMetricsThresholdSuggestion from 'in-alerting/smart-alerts/applications/subscriptions/getApplicationMetricsThresholdSuggestion';
import getApplicationMetricsAlertPreview from 'in-alerting/smart-alerts/applications/subscriptions/getApplicationMetricsAlertsPreview';
import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { toTagFilterNumberOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { getBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { percentage, millis, number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const baseBlueprint = Object.freeze({
  isCustomRateMetric: () => false,
  getMetricsRequest: () => getApplicationMetrics,
  getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
  getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
  thresholdDefaults: {
    operator: '>='
  },
  getEntityTagFilterFormModel: (alertConfig, applicationId, applicationName, serviceId) =>
    getEntitySelectionAsTagFilterFormModel(
      alertConfig.applications,
      alertConfig.boundaryScope,
      applicationId,
      applicationName,
      serviceId
    ),
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: () => []
});

const slownessBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'slowness',
  name: t('in-alerting:smartAlerts.applications.blueprintConfig.slowness.name'),
  headline: t('in-alerting:smartAlerts.applications.blueprintConfig.slowness.headline'),
  text: t('in-alerting:smartAlerts.applications.blueprintConfig.slowness.text'),
  baselineEnabled: true,
  defaultMetric: 'latency',
  getMetricName: () => 'latency',
  getMetricLabel: () => t('in-applications:analyze.quickFilter.labelLatency'),
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: alertRule => alertRule.aggregation,
  isRuleComplete: () => true,
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: getExtraSlownessAnalyzeLinkTagFilterFormModel
});

const errorRateBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'errorRate',
  name: t('in-alerting:smartAlerts.applications.blueprintConfig.errorRate.name'),
  headline: t('in-alerting:smartAlerts.applications.blueprintConfig.errorRate.headline'),
  text: t('in-alerting:smartAlerts.applications.blueprintConfig.errorRate.text'),
  baselineEnabled: false,
  defaultMetric: 'errors',
  getMetricName: () => 'errors',
  getMetricLabel: () => t('in-alerting:smartAlerts.applications.blueprintConfig.errorRate.metricLabel'),
  getMetricFormat: () => percentage,
  getMaxMetricValue: () => 100,
  getAggregation: () => 'MEAN',
  isRuleComplete: () => true,
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: () => [tagFilter('call.erroneous', 'EQUALS', true)]
});

const logsBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'logs',
  name: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.name'),
  headline: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.headline'),
  text: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.text'),
  baselineEnabled: false,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => t('in-alerting:smartAlerts.applications.blueprintConfig.logs.metricLabel'),
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  isRuleComplete: alertRule => isNotBlank(alertRule.message),
  incompleteRuleMessage: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.incompleteRuleMessage'),
  getRuleTagFilterFormModel: getLogLevelFormModel
});

const statusCodeBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.name'),
  headline: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.headline'),
  text: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.text'),
  baselineEnabled: false,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.metricLabel'),
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  isRuleComplete: alertRule => !!(alertRule.statusCodeStart && alertRule.statusCodeEnd),
  incompleteRuleMessage: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.incompleteRuleMessage'),
  getRuleTagFilterFormModel: getStatusCodeFormModel
});

const throughputBlueprintConfig = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  name: t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.name'),
  headline: t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.headline'),
  text: t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.text'),
  baselineEnabled: true,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.metricLabel'),
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  isRuleComplete: () => true,
  getRuleTagFilterFormModel: () => [],
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
    name: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedDrop.name'),
    headline: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedDrop.headline'),
    text: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedDrop.text'),
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: alertThreshold => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedlyHighNumber.name'),
    headline: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedlyHighNumber.headline'),
    text: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedlyHighNumber.text'),
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

function getLogLevelFormModel(alertRule) {
  if (alertRule.level === 'ANY') {
    return [tagFilter('log.message', alertRule.operator, alertRule.message)];
  }

  return joinExpressions({
    logicalOperator: and,
    expressions: [
      tagFilter('log.message', alertRule.operator, alertRule.message),
      tagFilter('log.level', 'EQUALS', alertRule.level)
    ]
  });
}

function getStatusCodeFormModel(alertRule) {
  if (alertRule.statusCodeStart === alertRule.statusCodeEnd) {
    return [tagFilter('call.http.status', 'EQUALS', alertRule.statusCodeStart)];
  }

  return joinExpressions({
    logicalOperator: and,
    expressions: [
      tagFilter('call.http.status', 'GREATER_OR_EQUAL_THAN', alertRule.statusCodeStart),
      tagFilter('call.http.status', 'LESS_OR_EQUAL_THAN', alertRule.statusCodeEnd)
    ]
  });
}

function getExtraSlownessAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig) {
  let value;
  if (alertConfig.threshold.type === 'staticThreshold') {
    value = alertConfig.threshold.value;
  } else {
    value = getBaselineThresholdValue(alertConfig, timeConfig);
  }

  return [tagFilter('call.latency', toTagFilterNumberOperator(alertConfig.threshold.operator), value)];
}

function getBaselineThresholdValue(alertConfig, timeConfig) {
  const { operator, baseline, deviationFactor } = alertConfig.threshold;
  const baselineGranularity = alertConfig.granularity;
  const isGreaterOp = operator === '>=' || operator === '>';

  const baselineValues = [];
  for (let time = timeConfig.to - timeConfig.windowSize; time <= timeConfig.to; time += baselineGranularity) {
    baselineValues.push(getBaselineValue(time, baseline, deviationFactor, baselineGranularity, isGreaterOp));
  }
  return isGreaterOp ? Math.min(...baselineValues) : Math.max(...baselineValues);
}
