/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  AggregationType,
  CustomEventMobileAppAlertRule,
  MobileAppAlertConfig,
  MobileAppAlertRule,
  MobileAppMonitoringBeaconType,
  TagFilterOperator,
  ThresholdConfig,
  StatusCodeMobileAppAlertRule,
  ThresholdOperator
} from '@instana/types';

//@ts-expect-error needs TS migration
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { number, NumberFormatter, percentage } from 'in-services/formatters/number';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
//@ts-expect-error
import { availableFilterTags } from 'in-mobile-apps/tags';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { FixedTimeConfig } from 'in-stores/time/config';
import { deepFreeze } from 'in-services/util/object';
import { isNotBlank } from 'in-services/util/string';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

// replace this by importing thresholdTypeOptions from the in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData
export const thresholdTypeOptions = Object.freeze([
  {
    value: STATIC_THRESHOLD,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')
  }
]);
type ThresholdTypeOptions = readonly Option[];

export type MetricName = 'httpxxx' | 'beaconRate' | 'sessions' | 'views' | 'beaconCount';

const statusCodeMetricLabelsByName: Record<string, string> = Object.freeze({
  httpxxx: t('in-alerting:smartAlerts.mobileApp.data.statusCodeCount'),
  beaconRate: t('in-alerting:smartAlerts.mobileApp.data.beaconRate')
});

const throughputMetricLabelsByName: Record<string, string> = Object.freeze({
  sessions: t('in-alerting:smartAlerts.mobileApp.data.sessions'),
  views: t('in-alerting:smartAlerts.mobileApp.data.views')
});

interface BluePrintBase {
  readonly isCustomRateMetric: typeof isCustomRateMetric;
  readonly getMetricsRequest: () => typeof getMobileAppMetrics;
  readonly getRuleTagFilterFormModel: (alertRule: MobileAppAlertRule) => FormModelElement[];
  readonly getEntityTagFilterFormModel: (alertConfig: MobileAppAlertConfig) => {
    name: string;
    operator: TagFilterOperator;
    value?: any;
  };
  readonly getExtraAnalyzeLinkTagFilterFormModel: (
    alertConfig: MobileAppAlertConfig,
    timeConfig: FixedTimeConfig
  ) => FormModelElement[];
  readonly getAlertsPreviewRequest: () => undefined;
  readonly thresholdDefaults: { readonly operator: ThresholdOperator };
  readonly getThresholdTypeOptions: () => ThresholdTypeOptions;
}

export type MobileAlertType = 'customEvent' | 'statusCode' | 'throughput';

const mobileAppThresholdTypeOptions: ThresholdTypeOptions = deepFreeze([...thresholdTypeOptions]);

export interface BluePrint extends BluePrintBase {
  readonly type: MobileAlertType;
  readonly defaultMetric: MetricName;
  readonly headline?: string;
  readonly text?: string;
  readonly isSelected?: (alertThreshold: ThresholdConfig) => boolean;
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
}

const baseBlueprint: Readonly<BluePrintBase> = Object.freeze({
  isCustomRateMetric: isCustomRateMetric,
  getMetricsRequest: () => getMobileAppMetrics,
  getRuleTagFilterFormModel: () => [],
  getEntityTagFilterFormModel: (alertConfig: MobileAppAlertConfig) =>
    tagFilter('mobileBeacon.mobileApp.id', EQUALS, alertConfig.mobileAppId),
  getExtraAnalyzeLinkTagFilterFormModel: () => [],
  getThresholdTypeOptions: () => mobileAppThresholdTypeOptions,
  thresholdDefaults: {
    operator: '>=' as ThresholdOperator
  },
  getAlertsPreviewRequest: () => undefined
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
  getMaxMetricValue: (metricName: MetricName) => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER)
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
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER
});

const customEventBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'customEvent',
  name: t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigText'),
  defaultMetric: 'beaconCount',
  getMetricName: () => 'beaconCount',
  getMetricLabel: () => t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigMetricLabel'),
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
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER
});

export const blueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
  statusCodeBlueprintConfig,
  throughputBlueprintConfig,
  customEventBlueprintConfig
]);

export const simpleModeBlueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
  statusCodeBlueprintConfig,
  {
    ...throughputBlueprintConfig,
    thresholdDefaults: {
      operator: '<='
    },
    isSelected: (alertThreshold: ThresholdConfig) => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  customEventBlueprintConfig
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
  alertThreshold: ThresholdConfig
): BluePrint | undefined {
  return simpleModeBlueprintConfigs
    .filter(blueprint => blueprint.type === alertType)
    .find(blueprint => !blueprint.isSelected || blueprint.isSelected(alertThreshold));
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
