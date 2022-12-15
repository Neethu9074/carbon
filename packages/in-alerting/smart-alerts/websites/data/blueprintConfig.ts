/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  AggregationType,
  HistoricBaselineData,
  SlownessWebsiteAlertRule,
  SpecificJsErrorsWebsiteAlertRule,
  StatusCodeWebsiteAlertRule,
  CustomEventWebsiteAlertRule,
  TagFilterOperator,
  ThresholdConfig,
  ThresholdOperator,
  WebsiteAlertConfig,
  WebsiteAlertRule,
  BeaconType
} from '@instana/types';

import getWebsiteRateMetricThresholdSuggestion from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetricThresholdSuggestion';
import getWebsiteMetricsThresholdSuggestion from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteMetricsThresholdSuggestion';
import getWebsiteRateMetricAlertsPreview from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteMetricAlertsPreview';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { getApproximatedHistoricBaselineThresholdValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { ADAPTIVE_BASELINE, isStaticThresholdConfig } from 'in-alerting/smart-alerts/data/thresholdTypes';
import getWebsiteRateMetric from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetric';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
// @ts-expect-error needs conversion to TS
import { availableFilterTags } from 'in-websites/tags';
import { toTagFilterNumberOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { millis, number, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { FixedTimeConfig } from 'in-stores/time/config';
import { isNotBlank } from 'in-services/util/string';
import { deepFreeze } from 'in-services/util/object';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

const jsErrorMetricLabelsByName: Record<string, string> = Object.freeze({
  errors: t('in-alerting:smartAlerts.websites.data.errorCount'),
  specificJsErrorRate: t('in-alerting:smartAlerts.websites.data.specificJsErrorRate')
});

const statusCodeMetricLabelsByName: Record<string, string> = Object.freeze({
  httpxxx: t('in-alerting:smartAlerts.websites.data.statusCodeCount'),
  specificStatusCodeRate: t('in-alerting:smartAlerts.websites.data.specificStatusCodeRate')
});

const throughputMetricLabelsByName: Record<string, string> = Object.freeze({
  pageLoads: t('in-alerting:smartAlerts.websites.data.pageLoads'),
  pageTransitions: t('in-alerting:smartAlerts.websites.data.pageTransitions')
});

export type MetricName =
  | 'specificJsErrorRate'
  | 'specificStatusCodeRate'
  | 'onLoadTime'
  | 'pageLoads'
  | 'httpxxx'
  | 'errors'
  | 'beaconCount';

export type WebsitesAlertType = 'slowness' | 'specificJsError' | 'statusCode' | 'throughput' | 'customEvent';

type ThresholdTypeOptions = readonly Option[];

const websitesThresholdTypeOptions: ThresholdTypeOptions = deepFreeze([
  ...thresholdTypeOptions,
  {
    value: ADAPTIVE_BASELINE,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionAdaptiveBaseline')
  }
]);

const baseBlueprint: BluePrintBase = Object.freeze({
  isCustomRateMetric: isCustomRateMetric,
  getMetricsRequest: metricName => (isCustomRateMetric(metricName) ? getWebsiteRateMetric : getWebsiteMetrics),
  getAlertsPreviewRequest: metricName =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetricAlertsPreview : getWebsiteMetricAlertsPreview,
  getThresholdSuggestionRequest: metricName =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetricThresholdSuggestion : getWebsiteMetricsThresholdSuggestion,
  getThresholdTypeOptions: () => websitesThresholdTypeOptions,
  thresholdDefaults: {
    operator: '>='
  },
  getEntityTagFilterFormModel: alertConfig => tagFilter('beacon.website.id', EQUALS, alertConfig.websiteId),
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: () => []
});

const slownessBlueprintConfig: BluePrint = Object.freeze({
  ...baseBlueprint,
  type: 'slowness',
  name: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigHeadline'),
  text: `
      <p>
      ${t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextP')}
      </p>
      <ul>
        <li>${t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli1')}</li>
        <li>${t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli2')}</li>
        <li>${t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli3')}</li>
        <li>${t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli4')}</li>
        <li>${t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli5')}</li>
      <ul>
    `,
  getAvailableTags: () => getIncludedTags(availableFilterTags.pageLoad),
  baselineEnabled: true,
  defaultMetric: 'onLoadTime',
  getMetricName: () => 'onLoadTime',
  getMetricLabel: () => t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigMetricLabel'),
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: (alertRule: WebsiteAlertRule) => {
    // this is always set SlownessWebsiteAlertRule
    return (alertRule as SlownessWebsiteAlertRule).aggregation;
  },
  isRuleComplete: () => true,
  getBeaconType: () => 'pageLoad',
  getExtraAnalyzeLinkTagFilterFormModel: getExtraSlownessAnalyzeLinkTagFilterFormModel
});

type NumberFormatter =
  | ((...args: any) => string)
  | {
      compact?: (...args: any) => string;
      detailed?: (...args: any) => string;

      // More properties may be defined, but we ignore them.
      [other: string]: any;
    };

const jsErrorsBlueprintConfig: BluePrint = Object.freeze({
  ...baseBlueprint,
  type: 'specificJsError',
  name: t('in-alerting:smartAlerts.websites.data.jsErrorsBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.jsErrorsBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.websites.data.jsErrorsBlueprintConfigText'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.error),
  baselineEnabled: false,
  defaultMetric: 'errors',
  getMetricName: (alertRule: WebsiteAlertRule) => alertRule.metricName,
  getMetricLabel: (metricName: MetricName) => jsErrorMetricLabelsByName[metricName],
  getMetricFormat: (metricName: MetricName) => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: (metricName: MetricName) => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  getAggregation: (alertRule: WebsiteAlertRule) => (isCustomRateMetric(alertRule.metricName) ? 'MEAN' : 'SUM'),
  isRuleComplete: (alertRule: WebsiteAlertRule) => isNotBlank((alertRule as SpecificJsErrorsWebsiteAlertRule).value),
  incompleteRuleMessage: t('in-alerting:smartAlerts.websites.data.jsErrorsBlueprintConfigIncompleteRuleMessage'),
  getRuleTagFilterFormModel: (alertRule: WebsiteAlertRule) => [
    tagFilter(
      'beacon.error.message',
      (alertRule as SpecificJsErrorsWebsiteAlertRule).operator,
      (alertRule as SpecificJsErrorsWebsiteAlertRule).value
    )
  ],
  getBeaconType: () => 'error',
  getExtraAnalyzeLinkTagFilterFormModel: () => [] // TODO in AP error blueprint, we add a call.erroneous filter, to only show erroneous calls, in WebsiteSmartAlerts we never did that. Ask PM whether we want to add such filter for Websites as well.
});

const statusCodeBlueprintConfig: BluePrint = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigText'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.httpRequest),
  baselineEnabled: false,
  defaultMetric: 'httpxxx',
  getMetricName: (alertRule: WebsiteAlertRule) => alertRule.metricName,
  getMetricLabel: (metricName: MetricName) => statusCodeMetricLabelsByName[metricName],
  getMetricFormat: (metricName: MetricName) => (isCustomRateMetric(metricName) ? percentage : number.forcedCompact),
  getMaxMetricValue: (metricName: MetricName) => (isCustomRateMetric(metricName) ? 100 : Number.MAX_SAFE_INTEGER),
  getAggregation: (alertRule: WebsiteAlertRule) =>
    isCustomRateMetric((alertRule as StatusCodeWebsiteAlertRule).metricName) ? 'MEAN' : 'SUM',
  isRuleComplete: (alertRule: WebsiteAlertRule) => isNotBlank((alertRule as StatusCodeWebsiteAlertRule).value),
  incompleteRuleMessage: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigIncompleteRuleMessage'),
  getRuleTagFilterFormModel: (alertRule: WebsiteAlertRule) => [
    tagFilter(
      'beacon.http.status',
      (alertRule as StatusCodeWebsiteAlertRule).operator,
      (alertRule as StatusCodeWebsiteAlertRule).value
    )
  ],
  getBeaconType: () => 'httpRequest'
});

const throughputBlueprintConfig: BluePrint = Object.freeze({
  ...baseBlueprint,
  type: 'throughput',
  name: t('in-alerting:smartAlerts.websites.data.throughputBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.throughputBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.websites.data.throughputBlueprintConfigText'),
  getAvailableTags: (metricName: MetricName) =>
    getIncludedTags(metricName === 'pageLoads' ? availableFilterTags.pageLoad : availableFilterTags.pageChange),
  baselineEnabled: true,
  defaultMetric: 'pageLoads',
  getMetricName: (alertRule: WebsiteAlertRule) => alertRule.metricName,
  getMetricLabel: (metricName: MetricName) => throughputMetricLabelsByName[metricName],
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  isRuleComplete: () => true,
  getBeaconType: (metricName: MetricName) => (metricName === 'pageLoads' ? 'pageLoad' : 'pageChange'),
  impactTimeThresholdDisabled: true
});

const customEventBlueprintConfig: BluePrint = Object.freeze({
  ...baseBlueprint,
  type: 'customEvent',
  name: t('in-alerting:smartAlerts.websites.data.customEventBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.customEventBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.websites.data.customEventBlueprintConfigText'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.custom),
  baselineEnabled: true,
  defaultMetric: 'beaconCount',
  getMetricName: () => 'beaconCount',
  getMetricLabel: () => t('in-alerting:smartAlerts.websites.data.customEventBlueprintConfigMetricLabel'),
  getMetricFormat: () => number.forcedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: () => 'SUM',
  isRuleComplete: (alertRule: WebsiteAlertRule) =>
    isNotBlank((alertRule as CustomEventWebsiteAlertRule).customEventName),
  incompleteRuleMessage: t('in-alerting:smartAlerts.websites.data.customEventBlueprintConfigIncompleteRuleMessage'),
  getRuleTagFilterFormModel: (alertRule: WebsiteAlertRule) =>
    joinExpressions({
      expressions: [
        tagFilter('beacon.type', EQUALS, 'custom'),
        tagFilter('beacon.customEvent.name', EQUALS, (alertRule as CustomEventWebsiteAlertRule).customEventName)
      ]
    }),
  getBeaconType: () => 'custom'
});

export const blueprintConfigs: readonly BluePrint[] = Object.freeze([
  slownessBlueprintConfig,
  jsErrorsBlueprintConfig,
  statusCodeBlueprintConfig,
  throughputBlueprintConfig,
  customEventBlueprintConfig
]);

interface BluePrintBase {
  readonly thresholdDefaults: { readonly operator: ThresholdOperator };
  readonly isCustomRateMetric: typeof isCustomRateMetric;
  readonly getMetricsRequest: (metricName: MetricName) => typeof getWebsiteRateMetric | typeof getWebsiteMetrics;
  readonly getAlertsPreviewRequest: (
    metricName: MetricName
  ) => typeof getWebsiteRateMetricAlertsPreview | typeof getWebsiteMetricAlertsPreview;
  readonly getThresholdTypeOptions: () => ThresholdTypeOptions;
  readonly getThresholdSuggestionRequest: (
    metricName: MetricName
  ) => typeof getWebsiteRateMetricThresholdSuggestion | typeof getWebsiteMetricsThresholdSuggestion;
  readonly getEntityTagFilterFormModel: (
    alertConfig: WebsiteAlertConfig
  ) => { name: string; operator: TagFilterOperator; value?: any };
  readonly getRuleTagFilterFormModel: (alertRule: WebsiteAlertRule) => FormModelElement[];
  readonly getExtraAnalyzeLinkTagFilterFormModel: (
    alertConfig: WebsiteAlertConfig,
    timeConfig: FixedTimeConfig
  ) => { name: string; type: string; operator: TagFilterOperator; value?: number }[];
}

interface BluePrint extends BluePrintBase {
  readonly type: WebsitesAlertType;
  readonly name: string;

  readonly headline?: string;
  readonly text?: string;
  readonly subType?: string;
  readonly isSelected?: (alertThreshold: ThresholdConfig) => boolean;

  readonly incompleteRuleMessage?: string;
  readonly getAvailableTags: (metricName: MetricName) => string[];
  readonly baselineEnabled: boolean;
  readonly getBeaconType: (metricName: MetricName) => BeaconType;
  readonly defaultMetric: MetricName;
  readonly getMetricName: (alertRule: WebsiteAlertRule) => string; // TODO figure out if the backend type could be a enum which could map to MetricName?
  readonly getMetricLabel: (metricName: MetricName) => string;
  readonly getMetricFormat: (metricName: MetricName) => NumberFormatter;
  readonly getMaxMetricValue: (metricName: MetricName) => number;
  readonly getAggregation: (alertRule: WebsiteAlertRule) => AggregationType;
  readonly isRuleComplete: (alertRule: WebsiteAlertRule) => boolean;
  readonly impactTimeThresholdDisabled?: boolean;
}

export const simpleModeBlueprintConfigs: readonly BluePrint[] = [
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
    isSelected: ({ operator }) => operator === '<=' || operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberName'),
    headline: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberHeadline'),
    text: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberText'),
    isSelected: ({ operator }) => operator === '>=' || operator === '>'
  },
  customEventBlueprintConfig
];

const excludedWebsiteTags: readonly string[] = Object.freeze(['beacon.website.id', 'beacon.website.name']);

function getIncludedTags(tagCatalog: string[]): string[] {
  return tagCatalog.filter((tag: string) => !excludedWebsiteTags.includes(tag));
}

export function getBlueprintConfig(alertType: string): BluePrint | undefined {
  return blueprintConfigs.find(blueprint => blueprint.type === alertType);
}

export function getSimpleModeBlueprintConfig(
  alertType: string,
  alertThreshold: ThresholdConfig
): BluePrint | undefined {
  return simpleModeBlueprintConfigs
    .filter(blueprint => blueprint.type === alertType)
    .find(blueprint => !blueprint.isSelected || blueprint.isSelected(alertThreshold));
}

function isCustomRateMetric(metricName: MetricName | string): boolean {
  return metricName === 'specificJsErrorRate' || metricName === 'specificStatusCodeRate';
}

function getExtraSlownessAnalyzeLinkTagFilterFormModel(
  alertConfig: WebsiteAlertConfig,
  timeConfig: FixedTimeConfig
): { name: string; type: string; operator: TagFilterOperator; value?: number }[] {
  let value: number;

  const { threshold } = alertConfig;

  if (isStaticThresholdConfig(threshold)) {
    value = threshold.value;
  } else {
    value = getApproximatedHistoricBaselineThresholdValue(
      threshold as HistoricBaselineData,
      alertConfig.granularity,
      timeConfig
    );
  }

  return [tagFilter('beacon.duration', toTagFilterNumberOperator(threshold.operator), value)];
}
