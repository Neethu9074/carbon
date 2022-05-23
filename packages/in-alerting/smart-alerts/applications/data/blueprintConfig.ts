/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  AdaptiveBaselineConfig,
  AggregationType,
  ApplicationAlertConfig,
  ApplicationAlertRule,
  HistoricBaselineData,
  LogsApplicationAlertRule,
  StaticThresholdConfig,
  StatusCodeApplicationAlertRule,
  ThresholdConfig,
  ThresholdOperator
} from 'in-types';
import {
  applicationThresholdTypeOptions,
  withoutAdaptiveBaselineOptions,
  withoutHistoricBaselineOptions
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import {
  getApproximatedAdaptiveBaselineThresholdValue,
  getApproximatedHistoricBaselineThresholdValue
} from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import getApplicationMetricsThresholdSuggestion from 'in-alerting/smart-alerts/applications/subscriptions/getApplicationMetricsThresholdSuggestion';
import {
  firstApplicationId,
  getEntitySelectionAsTagFilterFormModel
} from 'in-alerting/smart-alerts/applications/data/entitySelection';
import getApplicationMetricsAlertPreview from 'in-alerting/smart-alerts/applications/subscriptions/getApplicationMetricsAlertsPreview';
// @ts-expect-error file needs to be migrated
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { toTagFilterNumberOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { millis, number, NumberFormatter, percentage } from 'in-services/formatters/number';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { FixedTimeConfig } from 'in-stores/time/config';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export type MetricName = 'latency' | 'errors' | 'calls';

interface BluePrintBase {
  readonly isCustomRateMetric: () => boolean;
  readonly getMetricsRequest: () => typeof getApplicationMetrics;
  readonly getAlertsPreviewRequest: (metricName: MetricName) => typeof getApplicationMetricsAlertPreview;
  readonly getThresholdSuggestionRequest: (metricName: MetricName) => typeof getApplicationMetricsThresholdSuggestion;
  readonly thresholdDefaults: { readonly operator: ThresholdOperator };
  readonly getEntityTagFilterFormModel: (
    alertConfig: ApplicationAlertConfig,
    applicationId: string,
    applicationName?: string,
    serviceId?: string,
    endpointId?: string
  ) => FormModelElement[];
  readonly getRuleTagFilterFormModel: (alertRule: ApplicationAlertRule) => FormModelElement[];
  readonly getExtraAnalyzeLinkTagFilterFormModel: (
    alertConfig: ApplicationAlertConfig,
    timeConfig: FixedTimeConfig
  ) => FormModelElement[];
  readonly isBeta: boolean;
}

export type ApplicationAlertType = 'slowness' | 'errorRate' | 'logs' | 'statusCode' | 'throughput';

interface Option<VALUE_TYPE> {
  value: VALUE_TYPE;
  label: string;
}

type ThresholdTypeOptions = readonly Option<string>[]; // LATER replace with Option<ThresholdTypeOptions>[];

export interface BluePrint extends BluePrintBase {
  readonly type: ApplicationAlertType;
  readonly name: string;
  readonly headline: string;
  readonly text: string;
  readonly subType?: string;
  readonly isSelected?: (alertThreshold: ThresholdConfig) => boolean;
  readonly baselineEnabled: boolean;
  readonly defaultMetric: MetricName;
  readonly getMetricName: (alertRule: ApplicationAlertRule) => string; // TODO figure out if the backend type could be a enum which could map to MetricName?
  readonly getMetricLabel: (metricName: MetricName) => string;
  readonly getMetricFormat: (metricName: MetricName) => NumberFormatter;
  readonly getMaxMetricValue: (metricName: MetricName) => number;
  readonly getAggregation: (alertRule: ApplicationAlertRule) => AggregationType;
  readonly getThresholdTypeOptions: () => ThresholdTypeOptions; // applicationThresholdTypeOptions,
  readonly isRuleComplete: (alertRule: ApplicationAlertRule) => boolean;
  readonly incompleteRuleMessage?: string;
  readonly impactTimeThresholdDisabled?: boolean;
  readonly getRuleTagFilterFormModel: (alertRule: ApplicationAlertRule) => FormModelElement[];
}

const baseBlueprint: Readonly<BluePrintBase> = Object.freeze({
  isCustomRateMetric: () => false,
  getMetricsRequest: () => getApplicationMetrics,
  getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
  getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
  thresholdDefaults: {
    operator: '>='
  },
  isBeta: false,
  getEntityTagFilterFormModel: (
    alertConfig: ApplicationAlertConfig,
    applicationId: string,
    applicationName?: string,
    serviceId?: string,
    endpointId?: string
  ) =>
    getEntitySelectionAsTagFilterFormModel(
      alertConfig.applications,
      alertConfig.boundaryScope,
      applicationId ?? firstApplicationId(alertConfig.applications),
      applicationName,
      serviceId,
      endpointId
    ),
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: () => []
});

const slownessBlueprintConfig: Readonly<BluePrint> = Object.freeze<BluePrint>({
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
  getAggregation: alertRule => alertRule.aggregation!, // for latency, there is always an aggregation set
  getThresholdTypeOptions: () => applicationThresholdTypeOptions,
  isRuleComplete: () => true,
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: getExtraSlownessAnalyzeLinkTagFilterFormModel
});

const errorRateBlueprintConfig: Readonly<BluePrint> = Object.freeze({
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
  getThresholdTypeOptions: () =>
    withoutHistoricBaselineOptions(withoutAdaptiveBaselineOptions(applicationThresholdTypeOptions)),
  isRuleComplete: () => true,
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: () => [tagFilter('call.erroneous', 'EQUALS', true)]
});

const logsBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'logs',
  name: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.name'),
  headline: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.headline'),
  text: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.text'),
  isBeta: true,
  baselineEnabled: false,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => t('in-alerting:smartAlerts.applications.blueprintConfig.logs.metricLabel'),
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  getThresholdTypeOptions: () =>
    withoutHistoricBaselineOptions(withoutAdaptiveBaselineOptions(applicationThresholdTypeOptions)),
  isRuleComplete: (alertRule: ApplicationAlertRule) => isNotBlank((alertRule as LogsApplicationAlertRule).message),
  incompleteRuleMessage: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.incompleteRuleMessage'),
  getRuleTagFilterFormModel: (alertRule: ApplicationAlertRule) =>
    getLogLevelFormModel(alertRule as LogsApplicationAlertRule)
});

const statusCodeBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.name'),
  headline: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.headline'),
  text: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.text'),
  baselineEnabled: true,
  defaultMetric: 'calls',
  getMetricName: () => 'calls',
  getMetricLabel: () => t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.metricLabel'),
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  getThresholdTypeOptions: () => applicationThresholdTypeOptions,
  isRuleComplete: (alertRule: ApplicationAlertRule) => {
    // TODO replace by introducing a new type reflecting the client-side view model
    const rule = (alertRule as unknown) as {
      statusCode: {
        statusCodeStart: string;
        statusCodeEnd: string;
      };
    };
    const { statusCodeStart, statusCodeEnd } = rule.statusCode ?? {}; // safe against missing statusCode
    return !!(statusCodeStart && statusCodeEnd);
  },
  incompleteRuleMessage: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.incompleteRuleMessage'),
  getRuleTagFilterFormModel: (alertRule: ApplicationAlertRule) =>
    getStatusCodeFormModel(alertRule as StatusCodeApplicationAlertRule)
});

const throughputBlueprintConfig: Readonly<BluePrint> = Object.freeze({
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
  getThresholdTypeOptions: () => applicationThresholdTypeOptions,
  isRuleComplete: () => true,
  getRuleTagFilterFormModel: () => [],
  impactTimeThresholdDisabled: true
});

export const blueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
  slownessBlueprintConfig,
  errorRateBlueprintConfig,
  logsBlueprintConfig,
  statusCodeBlueprintConfig,
  throughputBlueprintConfig
]);

export const simpleModeBlueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
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
    isSelected: (alertThreshold: ThresholdConfig) => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedlyHighNumber.name'),
    headline: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedlyHighNumber.headline'),
    text: t('in-alerting:smartAlerts.applications.blueprintConfig.simpleMode.unexpectedlyHighNumber.text'),
    isSelected: (alertThreshold: ThresholdConfig) => alertThreshold.operator === '>=' || alertThreshold.operator === '>'
  }
]);

export function getBlueprintConfig(alertType: ApplicationAlertType): BluePrint | undefined {
  return blueprintConfigs.find(blueprint => blueprint.type === alertType);
}

export function getSimpleModeBlueprintConfig(
  alertType: ApplicationAlertType,
  alertThreshold: ThresholdConfig
): BluePrint | undefined {
  return simpleModeBlueprintConfigs
    .filter(blueprint => blueprint.type === alertType)
    .find(blueprint => !blueprint.isSelected || blueprint.isSelected(alertThreshold));
}

function getLogLevelFormModel(alertRule: LogsApplicationAlertRule): FormModelElement[] {
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

function getStatusCodeFormModel(alertRule: StatusCodeApplicationAlertRule): FormModelElement[] {
  // This fix is a workaround because we do not exactly distinguish between form model and backend model
  // for alert configurations. To fix this, we need a bigger refactoring which will be tackled separately

  // TODO replace by introducing a new type reflecting the client-side view model
  const rule = (alertRule as unknown) as {
    statusCode: {
      statusCodeStart: string;
      statusCodeEnd: string;
    };
  };

  const start = rule.statusCode?.statusCodeStart ?? alertRule.statusCodeStart;
  const end = rule.statusCode?.statusCodeEnd ?? alertRule?.statusCodeEnd;

  if (start === end) {
    return [tagFilter('call.http.status', 'EQUALS', start)];
  }

  return joinExpressions({
    logicalOperator: and,
    expressions: [
      tagFilter('call.http.status', 'GREATER_OR_EQUAL_THAN', start),
      tagFilter('call.http.status', 'LESS_OR_EQUAL_THAN', end)
    ]
  });
}

function getExtraSlownessAnalyzeLinkTagFilterFormModel(
  alertConfig: ApplicationAlertConfig,
  timeConfig: FixedTimeConfig,
  adaptiveBaselineInfo = {}
): FormModelElement[] {
  let value;

  if (alertConfig.threshold.type === STATIC_THRESHOLD) {
    value = (alertConfig.threshold as StaticThresholdConfig).value;
  } else if (alertConfig.threshold.type === ADAPTIVE_BASELINE) {
    const threshold = alertConfig.threshold as AdaptiveBaselineConfig;
    value = getApproximatedAdaptiveBaselineThresholdValue(threshold, adaptiveBaselineInfo);
  } else {
    // HISTORIC_BASELINE
    value = getApproximatedHistoricBaselineThresholdValue(
      alertConfig.threshold as HistoricBaselineData,
      alertConfig.granularity,
      timeConfig
    );
  }

  return [tagFilter('call.latency', toTagFilterNumberOperator(alertConfig.threshold.operator), value)];
}
