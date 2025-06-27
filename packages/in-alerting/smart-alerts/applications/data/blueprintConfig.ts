/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  AdaptiveBaselineData,
  AdaptiveBaselinePredictionsData,
  AggregationType,
  ApplicationAlertRule,
  HistoricBaselineData,
  LogsApplicationAlertRule,
  StaticBaselineThresholdRule,
  StaticThresholdRule,
  StatusCodeApplicationAlertRule,
  ThresholdConfig,
  ThresholdOperator,
  isAdaptiveThresholdRule,
  isStaticThresholdRule
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
import { ApplicationSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { toTagFilterNumberOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { millis, number, NumberFormatter, percentage } from 'in-services/formatters/number';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { FixedTimeConfig } from 'in-stores/time/config';
import { isNotBlank } from 'in-services/util/string';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

const statusCodeMetricLabelsByName: Record<string, string> = Object.freeze({
  calls: t('in-alerting:smartAlerts.applications.form.ruleMetricNameOptionStatusCodeCount'),
  callRate: t('in-alerting:smartAlerts.applications.form.ruleMetricNameOptionStatusCodeRate')
});

const errorMetricLabelsByName: Record<string, string> = Object.freeze({
  errors: t('in-alerting:smartAlerts.applications.form.ruleMetricNameOptionErrorRate'),
  erroneousCalls: t('in-alerting:smartAlerts.applications.form.ruleMetricNameOptionErrorCount')
});

export type MetricName = 'latency' | 'errors' | 'erroneousCalls' | 'calls' | 'callRate';

interface BluePrintBase {
  readonly isCustomRateMetric: typeof isCustomRateMetric;
  readonly getMetricsRequest: () => typeof getApplicationMetrics;
  readonly getAlertsPreviewRequest: () => typeof getApplicationMetricsAlertPreview;
  readonly getThresholdSuggestionRequest: () => typeof getApplicationMetricsThresholdSuggestion;
  readonly thresholdDefaults: { readonly operator: ThresholdOperator };
  readonly enrichWithDefaultThresholdValues: (alertConfig: ApplicationSmartAlertConfig) => ApplicationSmartAlertConfig;

  readonly getEntityTagFilterFormModel: (
    alertConfig: ApplicationSmartAlertConfig,
    applicationId: string,
    applicationName?: string,
    serviceId?: string,
    endpointId?: string
  ) => FormModelElement[];

  readonly getRuleTagFilterFormModel: (alertRule: ApplicationAlertRule) => FormModelElement[];
  readonly getExtraAnalyzeLinkTagFilterFormModel: (
    alertConfig: ApplicationSmartAlertConfig,
    timeConfig: FixedTimeConfig,
    adaptiveBaselineInfo?: Record<string, AdaptiveBaselinePredictionsData>
  ) => FormModelElement[];
  readonly isBeta: boolean;
}

export type ApplicationAlertType = 'slowness' | 'errors' | 'logs' | 'statusCode' | 'throughput';

type ThresholdTypeOptions = readonly Option[];

export interface BluePrint extends BluePrintBase {
  readonly type: ApplicationAlertType;
  readonly name: string;
  readonly headline?: string;
  readonly text?: string;
  readonly tearSheetHeadline?: string;
  readonly tearSheetDescription?: string;
  readonly subType?: string;
  readonly isSelected?: (alertThreshold: ThresholdConfig) => boolean;

  readonly baselineEnabled: boolean;
  readonly defaultMetric: MetricName;
  readonly getMetricName: (alertRule: ApplicationAlertRule) => string; // TODO figure out if the backend type could be a enum which could map to MetricName?
  /**
   * Gets the human-readable metric label, optionally extended with the aggregation type only if relevant.
   */
  readonly getMetricLabel: (metricName: MetricName, aggregation?: AggregationType) => string;
  readonly getMetricFormat: (metricName: MetricName) => NumberFormatter;
  readonly getMaxMetricValue: (metricName: MetricName) => number;

  readonly getAggregation: (alertRule: ApplicationAlertRule) => AggregationType;
  readonly getThresholdTypeOptions: () => ThresholdTypeOptions; // applicationThresholdTypeOptions,
  readonly getRuleTagFilterFormModel: (alertRule: ApplicationAlertRule) => FormModelElement[];

  readonly isRuleComplete: (alertRule: ApplicationAlertRule) => boolean;
  readonly incompleteRuleMessage?: string;
  readonly impactTimeThresholdDisabled?: boolean;
}

const baseBlueprint: Readonly<BluePrintBase> = Object.freeze({
  isCustomRateMetric: isCustomRateMetric,
  getMetricsRequest: () => getApplicationMetrics,
  getAlertsPreviewRequest: () => getApplicationMetricsAlertPreview,
  getThresholdSuggestionRequest: () => getApplicationMetricsThresholdSuggestion,
  thresholdDefaults: {
    operator: '>='
  } as const,
  isBeta: false,
  enrichWithDefaultThresholdValues: enrichWithDefaultThresholdValuesForBaselines,
  getEntityTagFilterFormModel: (
    alertConfig: ApplicationSmartAlertConfig,
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
  tearSheetHeadline: t('in-alerting:smartAlerts.applications.blueprintConfig.slowness.tearSheetHeadline'),
  tearSheetDescription: t('in-alerting:smartAlerts.applications.blueprintConfig.slowness.tearSheetDescription'),
  baselineEnabled: true,
  defaultMetric: 'latency',
  getMetricName: () => 'latency',
  getMetricLabel: (_: MetricName, aggregation?: AggregationType) =>
    aggregation
      ? `${t('in-applications:analyze.quickFilter.labelLatency')} (${getAggregationText(aggregation)})`
      : t('in-applications:analyze.quickFilter.labelLatency'),
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: alertRule => alertRule.aggregation!, // for latency, there is always an aggregation set
  getThresholdTypeOptions: () => applicationThresholdTypeOptions,
  isRuleComplete: () => true,
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: getExtraSlownessAnalyzeLinkTagFilterFormModel
});

const errorsBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'errors',
  name: t('in-alerting:smartAlerts.applications.blueprintConfig.errors.name'),
  headline: t('in-alerting:smartAlerts.applications.blueprintConfig.errors.headline'),
  text: t('in-alerting:smartAlerts.applications.blueprintConfig.errors.text'),
  tearSheetHeadline: t('in-alerting:smartAlerts.applications.blueprintConfig.errors.tearSheetHeadline'),
  tearSheetDescription: t('in-alerting:smartAlerts.applications.blueprintConfig.errors.tearSheetDescription'),
  baselineEnabled: true,
  defaultMetric: 'errors',
  getMetricName: (alertRule: ApplicationAlertRule) => alertRule.metricName,
  getMetricLabel: (metricName: MetricName) => errorMetricLabelsByName[metricName],
  getMetricFormat: (metricName: MetricName) => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: (alertRule: ApplicationAlertRule) => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  getThresholdTypeOptions: () => applicationThresholdTypeOptions,
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
  tearSheetHeadline: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.tearSheetHeadline'),
  tearSheetDescription: t('in-alerting:smartAlerts.applications.blueprintConfig.logs.text'),
  isBeta: true,
  baselineEnabled: false,
  enrichWithDefaultThresholdValues: enrichWithDefaultStaticThresholdValues,
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
  tearSheetHeadline: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.tearSheetHeadline'),
  tearSheetDescription: t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.tearSheetDescription'),
  baselineEnabled: true,
  defaultMetric: 'calls',
  getMetricName: (alertRule: ApplicationAlertRule) => alertRule.metricName,
  getMetricLabel: (metricName: MetricName) => statusCodeMetricLabelsByName[metricName],
  getMetricFormat: (metricName: MetricName) => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: (alertRule: ApplicationAlertRule) => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  getThresholdTypeOptions: () => applicationThresholdTypeOptions,
  isRuleComplete: (alertRule: ApplicationAlertRule) => {
    // TODO replace by introducing a new type reflecting the client-side view model
    const rule = alertRule as unknown as {
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
  tearSheetHeadline: t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.tearSheetHeadline'),
  tearSheetDescription: t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.tearSheetDescription'),
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
  errorsBlueprintConfig,
  logsBlueprintConfig,
  statusCodeBlueprintConfig,
  throughputBlueprintConfig
]);

export const simpleModeBlueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
  slownessBlueprintConfig,
  errorsBlueprintConfig,
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

export function getBlueprintConfig(alertType: ApplicationAlertType): BluePrint {
  const config = blueprintConfigs.find(blueprint => blueprint.type === alertType);
  if (!config) {
    throw new Error('Unknown alert type: ' + alertType);
  }
  return config;
}

export function getSimpleModeBlueprintConfig(
  alertType: ApplicationAlertType,
  alertThreshold: ThresholdConfig
): BluePrint | undefined {
  return simpleModeBlueprintConfigs
    .filter(blueprint => blueprint.type === alertType)
    .find(blueprint => !blueprint.isSelected || blueprint.isSelected(alertThreshold));
}

function isCustomRateMetric(metricName: MetricName | string): boolean {
  return metricName === 'callRate' || metricName === 'errors';
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
  const rule = alertRule as unknown as {
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
  alertConfig: ApplicationSmartAlertConfig,
  timeConfig: FixedTimeConfig,
  adaptiveBaselineInfo = {}
): FormModelElement[] {
  let value: number;

  const { rules } = alertConfig;
  const threshold = rules[0].thresholds.WARNING ?? rules[0].thresholds.CRITICAL;

  if (isStaticThresholdRule(threshold!)) {
    value = threshold.value;
  } else if (isAdaptiveThresholdRule(threshold!)) {
    value = getApproximatedAdaptiveBaselineThresholdValue(rules[0], adaptiveBaselineInfo, true);
  } else {
    // HISTORIC_BASELINE
    value = getApproximatedHistoricBaselineThresholdValue(
      threshold as HistoricBaselineData,
      alertConfig.granularity,
      timeConfig
    );
  }

  return [tagFilter('call.latency', toTagFilterNumberOperator(rules[0].thresholdOperator), value)];
}

function enrichWithDefaultStaticThresholdValues(alertConfig: ApplicationSmartAlertConfig): ApplicationSmartAlertConfig {
  const { rules } = alertConfig;

  return {
    ...alertConfig,
    rules: [
      {
        ...rules[0],
        thresholds: {
          ...rules[0].thresholds,
          // as this should already be introducing the right threshold when invoked from the blueprint,
          // using casting to the different Threshold Types here should be fine, to make TS happy, and
          // to prepare the next step to refactor this away. Actually, the rendering should be resilient and
          // do not need these defaults...
          // @ts-expect-error-error needs to be refactored
          WARNING: {
            ...rules[0]?.thresholds?.WARNING,
            value: (rules[0]?.thresholds?.WARNING as StaticThresholdRule)?.value ?? null
          },
          // @ts-expect-error-error needs to be refactored
          CRITICAL: {
            ...rules[0]?.thresholds?.CRITICAL,
            value: (rules[0]?.thresholds?.CRITICAL as StaticThresholdRule)?.value ?? null
          }
        }
      },
      ...rules.slice(1)
    ]
  };
}

function enrichWithDefaultThresholdValuesForBaselines(
  alertConfig: ApplicationSmartAlertConfig
): ApplicationSmartAlertConfig {
  const { rules } = alertConfig;

  return {
    ...alertConfig,
    rules: [
      {
        ...rules[0],
        thresholds: {
          ...rules[0].thresholds,
          // as this should already be introducing the right threshold when invoked from the blueprint,
          // using casting to the different Threshold Types here should be fine, to make TS happy, and
          // to prepare the next step to refactor this away. Actually, the rendering should be resilient and
          // do not need these defaults, but needs another double-check with the different use cases.
          // @ts-expect-error-error needs to be refactored
          WARNING: {
            ...rules[0]?.thresholds?.WARNING,
            value: (rules[0]?.thresholds?.WARNING as StaticThresholdRule)?.value ?? null,
            baseline: (rules[0]?.thresholds?.WARNING as StaticBaselineThresholdRule | AdaptiveBaselineData)?.baseline,
            deviationFactor: (rules[0]?.thresholds?.WARNING as StaticBaselineThresholdRule)?.deviationFactor ?? null
          },
          // @ts-expect-error-error needs to be refactored
          CRITICAL: {
            ...rules[0]?.thresholds?.CRITICAL,
            value: (rules[0]?.thresholds?.CRITICAL as StaticThresholdRule)?.value ?? null,
            baseline:
              // during the initial creation of a local AP Smart Alert, the critical threshold doesn't yet have all the required fields. To ensure both thresholds are properly initialized, we use the warning threshold to initialize the critical one.
              // However, this isn't the case for Global AP SAs. They begin with a static threshold (here), and once the threshold type is changed to adaptive, both the warning and critical thresholds are populated with the necessary fields from the start.
              (rules[0]?.thresholds?.CRITICAL as StaticBaselineThresholdRule | AdaptiveBaselineData)?.baseline ??
              (rules[0]?.thresholds?.WARNING as StaticBaselineThresholdRule | AdaptiveBaselineData)?.baseline,
            deviationFactor: (rules[0]?.thresholds?.CRITICAL as StaticBaselineThresholdRule)?.deviationFactor ?? null
          }
        }
      },
      ...rules.slice(1)
    ]
  };
}
