/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import {
  AggregationType,
  WebsiteBeaconType,
  CustomEventWebsiteAlertRule,
  HistoricBaselineData,
  isAdaptiveBaselineConfig,
  SlownessWebsiteAlertRule,
  SpecificJsErrorsWebsiteAlertRule,
  StatusCodeWebsiteAlertRule,
  ThresholdConfig,
  ThresholdOperator,
  WebsiteAlertRule,
  isStaticThresholdConfig,
  TagFilter,
  StaticThresholdRule,
  StaticBaselineThresholdRule,
  AdaptiveBaselineData
} from '@instana/types';

import {
  getApproximatedAdaptiveBaselineThresholdValue,
  getApproximatedHistoricBaselineThresholdValue
} from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import getWebsiteRateMetricThresholdSuggestion from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetricThresholdSuggestion';
import getWebsiteMetricsThresholdSuggestion from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteMetricsThresholdSuggestion';
import getWebsiteRateMetricAlertsPreview from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteMetricAlertsPreview';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import getWebsiteRateMetric from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteRateMetric';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
// @ts-expect-error needs conversion to TS
import { availableFilterTags } from 'in-websites/tags';
import { toTagFilterNumberOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { WebsiteSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { millis, number, NumberFormatter, percentage } from 'in-services/formatters/number';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
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

interface BluePrintBase {
  readonly isCustomRateMetric: typeof isCustomRateMetric;
  readonly getMetricsRequest: (metricName: MetricName) => typeof getWebsiteRateMetric | typeof getWebsiteMetrics;
  readonly getAlertsPreviewRequest: (
    metricName: MetricName
  ) => typeof getWebsiteRateMetricAlertsPreview | typeof getWebsiteMetricAlertsPreview;
  readonly getThresholdSuggestionRequest: (
    metricName: MetricName
  ) => typeof getWebsiteRateMetricThresholdSuggestion | typeof getWebsiteMetricsThresholdSuggestion;
  readonly thresholdDefaults: { readonly operator: ThresholdOperator };
  readonly getThresholdTypeOptions: () => ThresholdTypeOptions;

  readonly getEntityTagFilterFormModel: (alertConfig: WebsiteSmartAlertConfig) => TagFilter;
  readonly enrichWithDefaultThresholdValues: (alertConfig: WebsiteSmartAlertConfig) => WebsiteSmartAlertConfig;

  readonly getRuleTagFilterFormModel: (alertRule: WebsiteAlertRule) => FormModelElement[];
  readonly getExtraAnalyzeLinkTagFilterFormModel: (
    alertConfig: WebsiteSmartAlertConfig,
    timeConfig: FixedTimeConfig,
    adaptiveBaselineInfo?: Record<string, number>
  ) => FormModelElement[];
}

export type WebsitesAlertType = 'slowness' | 'specificJsError' | 'statusCode' | 'throughput' | 'customEvent';

type ThresholdTypeOptions = readonly Option[];

export interface BluePrint extends BluePrintBase {
  readonly type: WebsitesAlertType;
  readonly name: string;
  readonly headline?: string;
  readonly text?: string;
  readonly subType?: string;
  readonly isSelected?: (alertThreshold: ThresholdConfig) => boolean;

  readonly baselineEnabled: boolean;
  readonly defaultMetric: MetricName;
  readonly getMetricName: (alertRule: WebsiteAlertRule) => string; // TODO figure out if the backend type could be a enum which could map to MetricName?
  /**
   * Gets the human-readable metric label, optionally extended with the aggregation type only if relevant.
   */
  readonly getMetricLabel: (metricName: MetricName, aggregation?: AggregationType) => string;
  readonly getMetricFormat: (metricName: MetricName) => NumberFormatter;
  readonly getMaxMetricValue: (metricName: MetricName) => number;

  readonly getAvailableTags: (metricName: MetricName) => string[];
  readonly getBeaconType: (metricName: MetricName) => WebsiteBeaconType;
  readonly getAggregation: (alertRule: WebsiteAlertRule) => AggregationType;

  readonly isRuleComplete: (alertRule: WebsiteAlertRule) => boolean;
  readonly incompleteRuleMessage?: string;
  readonly impactTimeThresholdDisabled?: boolean;
}

const websitesThresholdTypeOptions: ThresholdTypeOptions = deepFreeze([
  ...thresholdTypeOptions,
  {
    value: ADAPTIVE_BASELINE,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionAdaptiveBaseline')
  }
]);

const baseBlueprint: Readonly<BluePrintBase> = Object.freeze({
  isCustomRateMetric: isCustomRateMetric,
  getMetricsRequest: (metricName: MetricName) =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetric : getWebsiteMetrics,
  getAlertsPreviewRequest: (metricName: MetricName) =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetricAlertsPreview : getWebsiteMetricAlertsPreview,
  getThresholdSuggestionRequest: (metricName: MetricName) =>
    isCustomRateMetric(metricName) ? getWebsiteRateMetricThresholdSuggestion : getWebsiteMetricsThresholdSuggestion,
  getThresholdTypeOptions: () => websitesThresholdTypeOptions,
  enrichWithDefaultThresholdValues: enrichWithDefaultThresholdValuesForBaselines,
  thresholdDefaults: {
    operator: '>='
  } as const,
  getEntityTagFilterFormModel: (alertConfig: WebsiteSmartAlertConfig) =>
    tagFilter('beacon.website.id', EQUALS, alertConfig.websiteId),
  getRuleTagFilterFormModel: () => [],
  getExtraAnalyzeLinkTagFilterFormModel: () => []
});

const slownessBlueprintConfig: Readonly<BluePrint> = Object.freeze({
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
      <br/>
      <p>
      ${t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextP2')}
      </p>
    `,
  getAvailableTags: (metricName: MetricName) =>
    getIncludedTags(metricName === 'onLoadTime' ? availableFilterTags.pageLoad : availableFilterTags.httpRequest),
  tearSheet: {
    headline: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigHeadline'),
    text: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextP'),
    description: {
      text1: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli1'),
      text2: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli2'),
      text3: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli3'),
      text4: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli4'),
      text5: t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigTextli5')
    }
  },
  baselineEnabled: true,
  defaultMetric: 'onLoadTime',
  getMetricName: (alertRule: WebsiteAlertRule) => alertRule.metricName,
  getMetricLabel: getSlownessMetricLabel,
  getMetricFormat: () => millis.forcedFixedCompact,
  getMaxMetricValue: () => Number.MAX_SAFE_INTEGER,
  getAggregation: (alertRule: WebsiteAlertRule) => {
    // this is always set SlownessWebsiteAlertRule
    return (alertRule as SlownessWebsiteAlertRule).aggregation;
  },
  isRuleComplete: () => true,
  getBeaconType: (metricName: MetricName) => (metricName === 'onLoadTime' ? 'pageLoad' : 'httpRequest'),
  getExtraAnalyzeLinkTagFilterFormModel: getExtraSlownessAnalyzeLinkTagFilterFormModel
});

const jsErrorsBlueprintConfig: Readonly<BluePrint> = Object.freeze({
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
  enrichWithDefaultThresholdValues: enrichWithDefaultStaticThresholdValues,
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

const statusCodeBlueprintConfig: Readonly<BluePrint> = Object.freeze({
  ...baseBlueprint,
  type: 'statusCode',
  name: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigName'),
  headline: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigHeadline'),
  text: t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigText'),
  getAvailableTags: () => getIncludedTags(availableFilterTags.httpRequest),
  baselineEnabled: true,
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
  getBeaconType: () => 'httpRequest',
  tearSheet: {
    headline: t('in-alerting:smartAlerts.websites.tearSheet.statusCode.headline'),
    text: t('in-alerting:smartAlerts.websites.tearSheet.statusCode.text')
  }
});

const throughputBlueprintConfig: Readonly<BluePrint> = Object.freeze({
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
  impactTimeThresholdDisabled: true,
  tearSheet: {
    headline: t('in-alerting:smartAlerts.websites.tearSheet.throughput.headline'),
    text: t('in-alerting:smartAlerts.websites.tearSheet.throughput.text')
  }
});

const customEventBlueprintConfig: Readonly<BluePrint> = Object.freeze({
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

export const blueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
  slownessBlueprintConfig,
  jsErrorsBlueprintConfig,
  statusCodeBlueprintConfig,
  throughputBlueprintConfig,
  customEventBlueprintConfig
]);

export const simpleModeBlueprintConfigs: readonly Readonly<BluePrint>[] = Object.freeze([
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
    isSelected: (alertThreshold: ThresholdConfig) => alertThreshold.operator === '<=' || alertThreshold.operator === '<'
  },
  {
    ...throughputBlueprintConfig,
    subType: 'unexpectedlyHighNumber',
    name: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberName'),
    headline: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberHeadline'),
    text: t('in-alerting:smartAlerts.websites.data.simpleModeBlueprintConfigsUnexpectedlyHighNumberText'),
    isSelected: (alertThreshold: ThresholdConfig) => alertThreshold.operator === '>=' || alertThreshold.operator === '>'
  },
  customEventBlueprintConfig
]);

const excludedWebsiteTags: readonly string[] = Object.freeze(['beacon.website.id', 'beacon.website.name']);

function getIncludedTags(tagCatalog: string[]): string[] {
  return tagCatalog.filter((tag: string) => !excludedWebsiteTags.includes(tag));
}

export function getBlueprintConfig(alertType: WebsitesAlertType): BluePrint {
  const config = blueprintConfigs.find(blueprint => blueprint.type === alertType);
  if (!config) {
    throw new Error('Unknown alert type: ' + alertType);
  }
  return config;
}

function getSlownessMetricLabel(metricName: MetricName, aggregation?: AggregationType) {
  const metricLabel =
    metricName == 'onLoadTime'
      ? t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigMetricLabel')
      : t('in-alerting:smartAlerts.websites.data.slownessBlueprintConfigHttpMetricLabel');

  return aggregation ? `${metricLabel} (${getAggregationText(aggregation)})` : metricLabel;
}

// Radio buttons need a unique string id
// type alone is not unique when subType is defined
export function idFromBluePrint(item: BluePrint): string {
  return `${item.type}_${item.subType || ''}`;
}

export function getSimpleModeBlueprintConfig(
  alertType: WebsitesAlertType,
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
  alertConfig: WebsiteSmartAlertConfig,
  timeConfig: FixedTimeConfig,
  adaptiveBaselineInfo = {}
): FormModelElement[] {
  let value: number;

  const { threshold } = alertConfig;

  if (isStaticThresholdConfig(threshold)) {
    value = threshold.value;
  } else if (isAdaptiveBaselineConfig(threshold)) {
    value = getApproximatedAdaptiveBaselineThresholdValue(threshold, adaptiveBaselineInfo);
  } else {
    // HISTORIC_BASELINE
    value = getApproximatedHistoricBaselineThresholdValue(
      threshold as HistoricBaselineData,
      alertConfig.granularity,
      timeConfig
    );
  }

  return [tagFilter('beacon.duration', toTagFilterNumberOperator(threshold.operator), value)];
}

function enrichWithDefaultStaticThresholdValues(alertConfig: WebsiteSmartAlertConfig): WebsiteSmartAlertConfig {
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

function enrichWithDefaultThresholdValuesForBaselines(alertConfig: WebsiteSmartAlertConfig): WebsiteSmartAlertConfig {
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
            baseline:
              (rules[0]?.thresholds?.WARNING as StaticBaselineThresholdRule)?.baseline ??
              (rules[0]?.thresholds?.WARNING as AdaptiveBaselineData)?.baseline,
            deviationFactor: (rules[0]?.thresholds?.WARNING as StaticBaselineThresholdRule)?.deviationFactor ?? null
          },
          // @ts-expect-error-error needs to be refactored
          CRITICAL: {
            ...rules[0]?.thresholds?.CRITICAL,
            value: (rules[0]?.thresholds?.CRITICAL as StaticThresholdRule)?.value ?? null,
            baseline:
              (rules[0]?.thresholds?.CRITICAL as StaticBaselineThresholdRule)?.baseline ??
              (rules[0]?.thresholds?.WARNING as AdaptiveBaselineData)?.baseline,
            deviationFactor: (rules[0]?.thresholds?.CRITICAL as StaticBaselineThresholdRule)?.deviationFactor ?? null
          }
        }
      },
      ...rules.slice(1)
    ]
  };
}
