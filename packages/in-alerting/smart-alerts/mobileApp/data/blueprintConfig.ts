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
  StatusCodeMobileAppAlertRule
} from '@instana/types';

//@ts-expect-error needs TS migration
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { number, NumberFormatter, percentage } from 'in-services/formatters/number';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { FixedTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

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
}

export type MobileAlertType = 'customEvent' | 'statusCode' | 'throughput';

export interface BluePrint extends BluePrintBase {
  readonly type: MobileAlertType;
  readonly isSelected?: (alertThreshold: ThresholdConfig) => boolean;
  readonly getMetricName: (alertRule: MobileAppAlertRule) => string;
  readonly getMetricFormat: (metricName: MetricName) => NumberFormatter;
  readonly getBeaconType: (metricName: MetricName) => MobileAppMonitoringBeaconType;
  readonly getAggregation: (alertRule: MobileAppAlertRule) => AggregationType;
  readonly getMetricLabel: (metricName: MetricName, aggregation?: AggregationType) => string;
}

const baseBlueprint: Readonly<BluePrintBase> = Object.freeze({
  isCustomRateMetric: isCustomRateMetric,
  getMetricsRequest: () => getMobileAppMetrics,
  getRuleTagFilterFormModel: () => [],
  getEntityTagFilterFormModel: (alertConfig: MobileAppAlertConfig) =>
    tagFilter('mobileBeacon.mobileApp.id', EQUALS, alertConfig.mobileAppId),
  getExtraAnalyzeLinkTagFilterFormModel: () => []
});

const statusCodeBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
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
  getMetricLabel: (metricName: MetricName) => statusCodeMetricLabelsByName[metricName]
});

const throughputBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  getMetricName: (alertRule: MobileAppAlertRule) => alertRule.metricName,
  getMetricFormat: () => number.forcedCompact,
  getBeaconType: (metricName: MetricName) => (metricName === 'views' ? 'viewChange' : 'sessionStart'),
  getAggregation: () => 'SUM',
  impactTimeThresholdDisabled: true,
  getMetricLabel: (metricName: MetricName) => throughputMetricLabelsByName[metricName]
});

const customEventBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'customEvent',
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
  getBeaconType: () => 'custom'
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
  {
    ...throughputBlueprintConfig,
    isSelected: (alertThreshold: ThresholdConfig) => alertThreshold.operator === '>=' || alertThreshold.operator === '>'
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

function isCustomRateMetric(metricName: MetricName | string): boolean {
  return metricName === 'beaconRate';
}
