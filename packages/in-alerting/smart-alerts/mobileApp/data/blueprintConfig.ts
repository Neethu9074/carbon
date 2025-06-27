/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  AggregationType,
  CustomEventMobileAppAlertRule,
  MobileAppAlertRule,
  MobileAppMonitoringBeaconType,
  TagFilterOperator,
  ThresholdConfig,
  StatusCodeMobileAppAlertRule,
  ThresholdOperator,
  StaticThresholdRule,
  StaticBaselineThresholdRule,
  AdaptiveBaselineData,
  SlownessMobileAppAlertRule
} from '@instana/types';

import getMobileAppMetricThresholdSuggestion from 'in-alerting/smart-alerts/mobileApp/subscriptions/getMobileAppMetricsThresholdSuggestion';
import getMobileAppMetricAlertsPreview from 'in-alerting/smart-alerts/mobileApp/subscriptions/getMobileAppMetricAlertsPreview';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { MobileAppSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { mobileAppSmartAlertSlownessBlueprintEnabled } from 'in-services/featureFlags';
import { number, NumberFormatter, percentage } from 'in-services/formatters/number';
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
//@ts-expect-error
import { availableFilterTags } from 'in-mobile-apps/tags';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { FixedTimeConfig } from 'in-stores/time/config';
import { deepFreeze } from 'in-services/util/object';
import { isNotBlank } from 'in-services/util/string';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

export type ThresholdTypeOptions = readonly Option[];

export type MetricName =
  | 'httpxxx'
  | 'httpLatency'
  | 'beaconRate'
  | 'sessions'
  | 'views'
  | 'beaconCount'
  | 'crashAffectedUserCount'
  | 'crashAffectedSessionRate'
  | 'crashFreeSessionCount'
  | 'crashFreeUserRate'
  | 'crashFreeUserCount'
  | 'crashFreeSessionRate'
  | 'crashAffectedSessionCount'
  | 'crashAffectedUserRate';
const statusCodeMetricLabelsByName: Record<string, string> = Object.freeze({
  httpxxx: t('in-alerting:smartAlerts.mobileApp.data.statusCodeCount'),
  beaconRate: t('in-alerting:smartAlerts.mobileApp.data.beaconRate')
});

const throughputMetricLabelsByName: Record<string, string> = Object.freeze({
  sessions: t('in-alerting:smartAlerts.mobileApp.data.sessions'),
  views: t('in-alerting:smartAlerts.mobileApp.data.views')
});

const customEventMetricLabelsByName: Record<string, string> = Object.freeze({
  beaconCount: t('in-alerting:smartAlerts.eum.data.customOccurrences'),
  customDuration: t('in-alerting:smartAlerts.eum.data.customDuration'),
  customMetric: t('in-alerting:smartAlerts.eum.data.customMetric')
});

const crashMetricLabelsByName: Record<string, string> = Object.freeze({
  crashAffectedSessionRate: t('in-alerting:smartAlerts.mobileApp.data.crashAffectedSessionRate'),
  crashFreeSessionRate: t('in-alerting:smartAlerts.mobileApp.data.crashFreeSessionRate'),
  crashAffectedSessionCount: t('in-alerting:smartAlerts.mobileApp.data.crashAffectedSessionCount'),
  crashFreeSessionCount: t('in-alerting:smartAlerts.mobileApp.data.crashFreeSessionCount'),
  crashFreeUserRate: t('in-alerting:smartAlerts.mobileApp.data.crashFreeUserRate'),
  crashAffectedUserRate: t('in-alerting:smartAlerts.mobileApp.data.crashAffectedUserRate'),
  crashAffectedUserCount: t('in-alerting:smartAlerts.mobileApp.data.crashAffectedUserCount'),
  crashFreeUserCount: t('in-alerting:smartAlerts.mobileApp.data.crashFreeUserCount')
});

interface BluePrintBase {
  readonly isCustomRateMetric: typeof isCustomRateMetric;
  readonly getMetricsRequest: () => typeof getMobileAppMetrics;
  readonly getRuleTagFilterFormModel: (alertRule: MobileAppAlertRule) => FormModelElement[];
  readonly getEntityTagFilterFormModel: (alertConfig: MobileAppSmartAlertConfig) => {
    name: string;
    operator: TagFilterOperator;
    value?: any;
  };
  readonly getExtraAnalyzeLinkTagFilterFormModel: (
    alertConfig: MobileAppSmartAlertConfig,
    timeConfig: FixedTimeConfig
  ) => FormModelElement[];
  readonly getAlertsPreviewRequest: (metricName: MetricName) => typeof getMobileAppMetricAlertsPreview;
  readonly getThresholdSuggestionRequest: (metricName: MetricName) => typeof getMobileAppMetricThresholdSuggestion;
  readonly thresholdDefaults: { readonly operator: ThresholdOperator };
  readonly getThresholdTypeOptions: () => ThresholdTypeOptions;
  readonly enrichWithDefaultThresholdValues: (alertConfig: MobileAppSmartAlertConfig) => MobileAppSmartAlertConfig;
}

export type MobileAlertType = MobileAppAlertRule['alertType'];

const mobileAppThresholdTypeOptions: ThresholdTypeOptions = deepFreeze([
  ...thresholdTypeOptions,
  {
    value: ADAPTIVE_BASELINE,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionAdaptiveBaseline')
  }
]);

export interface BluePrint extends BluePrintBase {
  readonly type: MobileAlertType;
  readonly defaultMetric: MetricName;
  readonly headline?: string;
  readonly text: string;
  readonly isSelected?: (alertThreshold: ThresholdConfig) => boolean;
  readonly baselineEnabled: boolean;
  readonly getMetricName: (alertRule: MobileAppAlertRule) => string;
  readonly getMetricFormat: (metricName: MetricName) => NumberFormatter;
  readonly getBeaconType: (metricName: MetricName) => MobileAppMonitoringBeaconType;
  readonly getAggregation: (alertRule: MobileAppAlertRule) => AggregationType;
  readonly getMetricLabel: (metricName: MetricName, aggregation?: AggregationType) => string;
  readonly name: string;
  readonly getAvailableTags: (metricName: MetricName) => string[];
  readonly impactTimeThresholdDisabled?: boolean;
  readonly isRuleComplete: (alertRule: MobileAppAlertRule) => boolean;
  readonly incompleteRuleMessage?: string;
  readonly getMaxMetricValue: (metricName: MetricName) => number;
  readonly tearSheet: {
    readonly headline: string;
    readonly text: string;
  };
}

const baseBlueprint: Readonly<BluePrintBase> = Object.freeze({
  isCustomRateMetric: isCustomRateMetric,
  getMetricsRequest: () => getMobileAppMetrics,
  getRuleTagFilterFormModel: () => [],
  getEntityTagFilterFormModel: (alertConfig: MobileAppSmartAlertConfig) =>
    tagFilter('mobileBeacon.mobileApp.id', EQUALS, alertConfig.mobileAppId),
  getExtraAnalyzeLinkTagFilterFormModel: () => [],
  getThresholdTypeOptions: () => mobileAppThresholdTypeOptions,
  thresholdDefaults: {
    operator: '>=' as ThresholdOperator
  },
  getAlertsPreviewRequest: () => getMobileAppMetricAlertsPreview,
  getThresholdSuggestionRequest: () => getMobileAppMetricThresholdSuggestion,
  enrichWithDefaultThresholdValues: enrichWithDefaultThresholdValuesForBaselines
});

const slownessBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'slowness',
  name: t('in-alerting:smartAlerts.eum.slowness.blueprintConfigName'),
  defaultMetric: 'httpLatency',
  headline: t('in-alerting:smartAlerts.mobileApp.data.slownessBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.mobileApp.data.slownessBlueprintConfigTextP'),
  getBeaconType: () => 'httpRequest',
  getMetricFormat: () => number.forcedCompact,
  getAggregation: (alertRule: MobileAppAlertRule) => {
    return (alertRule as SlownessMobileAppAlertRule).aggregation;
  },
  getMetricName: (alertRule: MobileAppAlertRule) => alertRule.metricName,
  getMetricLabel: () => t('in-alerting:smartAlerts.eum.slowness.httpLatencyMetricLabel'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.httpRequest),
  isRuleComplete: () => true,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  baselineEnabled: true,
  tearSheet: {
    headline: t('in-alerting:smartAlerts.mobileApp.tearSheet.slowness.headline'),
    text: t('in-alerting:smartAlerts.mobileApp.tearSheet.slowness.text')
  }
});

const statusCodeBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: t('in-alerting:smartAlerts.mobileApp.data.statusCodeBlueprintConfigName'),
  defaultMetric: 'httpxxx',
  headline: t('in-alerting:smartAlerts.mobileApp.data.statusCodeBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.mobileApp.data.statusCodeBlueprintConfigText'),
  getBeaconType: () => 'httpRequest',
  getMetricFormat: (metricName: MetricName) => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getRuleTagFilterFormModel: (alertRule: MobileAppAlertRule) => [
    tagFilter(
      'mobileBeacon.http.status',
      (alertRule as StatusCodeMobileAppAlertRule).operator,
      (alertRule as StatusCodeMobileAppAlertRule).value
    )
  ],
  getAggregation: (alertRule: MobileAppAlertRule) =>
    isCustomRateMetric((alertRule as StatusCodeMobileAppAlertRule).metricName) ? 'MEAN' : 'SUM',
  getMetricName: (alertRule: MobileAppAlertRule) => alertRule.metricName,
  getMetricLabel: (metricName: MetricName) => statusCodeMetricLabelsByName[metricName],
  getAvailableTags: () => getIncludedTags(availableFilterTags.httpRequest),
  isRuleComplete: (alertRule: MobileAppAlertRule) => isNotBlank((alertRule as StatusCodeMobileAppAlertRule).value),
  incompleteRuleMessage: t('in-alerting:smartAlerts.mobileApp.data.statusCodeBlueprintConfigIncompleteRuleMessage'),
  getMaxMetricValue: (metricName: MetricName) => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  baselineEnabled: true,
  tearSheet: {
    headline: t('in-alerting:smartAlerts.mobileApp.tearSheet.statusCode.headline'),
    text: t('in-alerting:smartAlerts.mobileApp.tearSheet.statusCode.text')
  }
});

const throughputBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  name: t('in-alerting:smartAlerts.mobileApp.data.throughputBlueprintConfigName'),
  defaultMetric: 'views',
  headline: t('in-alerting:smartAlerts.mobileApp.data.throughputBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.mobileApp.data.throughputBlueprintConfigText'),
  getMetricName: (alertRule: MobileAppAlertRule) => alertRule.metricName,
  getMetricFormat: () => number.forcedCompact,
  getBeaconType: (metricName: MetricName) => (metricName === 'views' ? 'viewChange' : 'sessionStart'),
  getAggregation: () => 'SUM',
  impactTimeThresholdDisabled: true,
  getMetricLabel: (metricName: MetricName) => throughputMetricLabelsByName[metricName],
  getAvailableTags: (metricName: MetricName) =>
    getIncludedTags(metricName === 'views' ? availableFilterTags.viewChange : availableFilterTags.sessionStart),
  isRuleComplete: () => true,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  baselineEnabled: true,
  tearSheet: {
    headline: t('in-alerting:smartAlerts.mobileApp.tearSheet.throughput.headline'),
    text: t('in-alerting:smartAlerts.mobileApp.tearSheet.throughput.text')
  }
});

const customEventBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'customEvent',
  name: t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigText'),
  defaultMetric: 'beaconCount',
  getMetricName: (alertRule: MobileAppAlertRule) => alertRule.metricName,
  getMetricLabel: getCustomMetricLabel,
  getMetricFormat: () => number.forcedCompact,
  getRuleTagFilterFormModel: (alertRule: MobileAppAlertRule) =>
    joinExpressions({
      expressions: [
        tagFilter('mobileBeacon.type', EQUALS, 'custom'),
        tagFilter('mobileBeacon.customEvent.name', EQUALS, (alertRule as CustomEventMobileAppAlertRule).customEventName)
      ]
    }),
  getAggregation: () => 'SUM',
  getBeaconType: () => 'custom',
  getAvailableTags: () => getIncludedTags(availableFilterTags.custom),
  isRuleComplete: (alertRule: MobileAppAlertRule) =>
    isNotBlank((alertRule as CustomEventMobileAppAlertRule).customEventName),
  incompleteRuleMessage: t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigIncompleteRuleMessage'),
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  baselineEnabled: true,
  tearSheet: {
    headline: t('in-alerting:smartAlerts.mobileApp.tearSheet.customEvent.headline'),
    text: t('in-alerting:smartAlerts.mobileApp.tearSheet.customEvent.text')
  }
});

function getCustomMetricLabel(metricName: MetricName, aggregation?: AggregationType) {
  const metricLabel = customEventMetricLabelsByName[metricName];
  return aggregation ? `${metricLabel} (${getAggregationText(aggregation)})` : metricLabel;
}

const crashBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'crash',
  name: t('in-alerting:smartAlerts.mobileApp.data.crashBlueprintConfigName'),
  defaultMetric: 'crashAffectedSessionRate',
  headline: t('in-alerting:smartAlerts.mobileApp.data.crashBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.mobileApp.data.crashBlueprintConfigText'),
  getBeaconType: () => 'crash',
  getMetricFormat: (metricName: MetricName) =>
    rateMetricsForCrashBlueprint.has(metricName) ? percentage : number.forcedCompact,
  getAggregation: (alertRule: MobileAppAlertRule) =>
    rateMetricsForCrashBlueprint.has((alertRule as StatusCodeMobileAppAlertRule).metricName)
      ? 'MEAN'
      : 'DISTINCT_COUNT',
  getMetricName: (alertRule: MobileAppAlertRule) => alertRule.metricName,
  getMetricLabel: (metricName: MetricName) => crashMetricLabelsByName[metricName],
  getAvailableTags: () => getIncludedTags(availableFilterTags.crash),
  isRuleComplete: () => true,
  getMaxMetricValue: (metricName: MetricName) =>
    rateMetricsForCrashBlueprint.has(metricName) ? 100 : Number.MAX_SAFE_INTEGER,
  baselineEnabled: true,
  tearSheet: {
    headline: t('in-alerting:smartAlerts.mobileApp.tearSheet.crash.headline'),
    text: t('in-alerting:smartAlerts.mobileApp.tearSheet.crash.text')
  }
});

export const blueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
  statusCodeBlueprintConfig,
  ...(mobileAppSmartAlertSlownessBlueprintEnabled ? [slownessBlueprintConfig] : []),
  throughputBlueprintConfig,
  customEventBlueprintConfig,
  crashBlueprintConfig
]);

export const simpleModeBlueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
  statusCodeBlueprintConfig,
  ...(mobileAppSmartAlertSlownessBlueprintEnabled ? [slownessBlueprintConfig] : []),
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedDropViews',
    name: t('in-alerting:smartAlerts.mobileApp.data.simpleModeBlueprintConfigsViewsUnexpectedDropName'),
    headline: t('in-alerting:smartAlerts.mobileApp.data.simpleModeBlueprintConfigsViewsUnexpectedDropHeadline'),
    text: t('in-alerting:smartAlerts.mobileApp.data.simpleModeBlueprintConfigsViewsUnexpectedDropText'),
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: (alertThreshold: ThresholdConfig) => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    defaultMetric: 'sessions',
    subType: 'unexpectedDropSessions',
    name: t('in-alerting:smartAlerts.mobileApp.data.simpleModeBlueprintConfigsSessionsUnexpectedlyLowNumberName'),
    headline: t(
      'in-alerting:smartAlerts.mobileApp.data.simpleModeBlueprintConfigsSessionsUnexpectedlyHighNumberHeadline'
    ),
    text: t('in-alerting:smartAlerts.mobileApp.data.simpleModeBlueprintConfigsSessionsUnexpectedlyHighNumberText'),
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: (alertThreshold: ThresholdConfig) => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  customEventBlueprintConfig,
  crashBlueprintConfig
]);

export const rateMetricsForCrashBlueprint = new Set([
  'crashAffectedSessionRate',
  'crashFreeUserRate',
  'crashFreeSessionRate',
  'crashAffectedUserRate'
]);
export const crashBlueprintMetrics = new Set([
  'crashAffectedUserCount',
  'crashAffectedSessionRate',
  'crashFreeSessionCount',
  'crashFreeUserRate',
  'crashFreeUserCount',
  'crashFreeSessionRate',
  'crashAffectedSessionCount',
  'crashAffectedUserRate'
]);

export function getBlueprintConfig(alertType: MobileAlertType): BluePrint {
  const config = blueprintConfigs.find(blueprint => blueprint.type === alertType);
  if (!config) {
    throw new Error('Unknown alert type: ' + alertType);
  }
  return config;
}

export function getSimpleModeBlueprintConfig(
  alertType: MobileAlertType,
  alertThreshold: ThresholdConfig,
  metricName: MetricName
): BluePrint | undefined {
  return (
    simpleModeBlueprintConfigs
      .filter(blueprint => blueprint.type === alertType)
      // we allow all metrics from crash blueprint in simple mode.
      .filter(
        blueprint =>
          blueprint.defaultMetric === metricName ||
          (blueprint.type === 'crash' && crashBlueprintMetrics.has(metricName))
      )
      .find(blueprint => !blueprint.isSelected || blueprint.isSelected(alertThreshold))
  );
}

function isCustomRateMetric(metricName: MetricName | string): boolean {
  return metricName === 'beaconRate';
}

const excludedMobileAppTags: readonly string[] = Object.freeze([
  'mobileBeacon.mobileApp.id',
  'mobileBeacon.mobileApp.name'
]);

function getIncludedTags(tagCatalog: string[]): string[] {
  return tagCatalog.filter((tag: string) => !excludedMobileAppTags.includes(tag));
}

function enrichWithDefaultThresholdValuesForBaselines(
  alertConfig: MobileAppSmartAlertConfig
): MobileAppSmartAlertConfig {
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
