/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  AggregationType,
  GetInfraMetricAlertsPreviewQuery,
  Granularity,
  InfraTimeThreshold,
  Result,
  TagFilter,
  TagFilterExpression,
  ThresholdData,
  TimeConfig,
  InfraAlertRuleUnion,
  RuleWithThreshold,
  Severity,
  SmartAlertThresholdRuleUnion,
  ThresholdOperator,
  StaticThresholdRule,
  AdaptiveThresholdRule,
  ForecastingConfig
} from '@instana/types';

import {
  getChartConfig,
  getEnrichedTagFilterExpression,
  getUnifiedMetricConfig
} from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
// @ts-expect-error TS migration
import { getRendererBasedOnThresholdTypeForMultiThreshold } from 'in-alerting/components/Chart/AlertingChart';
//@ts-expect-error TS migration
import { extendMetricConfiguration, getThreshold } from 'in-alerting/components/Chart/AlertingChartWrapper';
// @ts-expect-error TS migration
import AlertsPreviewLane from 'in-alerting/components/Chart/AlertsPreviewLane/AlertsPreviewLane';
import getInfraMetricsAlertPreview from 'in-alerting/smart-alerts/infrastructure/subscriptions/getInfraMetricsAlertPreview';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { useSelectedMetricGroup } from 'in-alerting/smart-alerts/infrastructure/providers/SelectedMetricGroupProvider';
//@ts-expect-error TS migration
import { getY1ForMultiThreshold } from 'in-alerting/components/Chart/AlertingChart';
// @ts-expect-error TS migration
import { getUniqueMetricsAndLabels } from 'in-infrastructure/Explore/Explore';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { MetricItem } from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { useResultData } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { finishedProgress, indeterminateProgress } from 'in-services/fixedObjects';
import { Config, MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { getMetricDefinition } from 'in-sdk/metrics';

interface InfraAlertChartWrapperProps {
  alertConfig: InfraSmartAlertConfigWithMetadata;
  timeConfig: TimeConfig;
  metricLabel: string;
  predictions?: number[][];
  lowerBound?: number[][];
  upperBound?: number[][];
  alertsPreviewEnabled?: boolean;
  isEventDetailPage?: boolean;
  eventSeverity?: number;
}

export default function InfraAlertChartWrapper({
  alertConfig,
  timeConfig,
  predictions,
  lowerBound,
  upperBound,
  alertsPreviewEnabled,
  metricLabel
}: InfraAlertChartWrapperProps) {
  const { timeThreshold, granularity, tagFilterExpression, rules, forecastingConfig } = alertConfig;

  const firstRule: RuleWithThreshold<InfraAlertRuleUnion> = rules[0];
  const { entityType, metricName, aggregation, crossSeriesAggregation, regex } = firstRule.rule;
  const thresholdsMap = firstRule.thresholds;

  const metricDefinition = getMetricDefinition(entityType, metricName);
  const formatter = metricDefinition.formatter;
  const chartViewConfig = createDefaultChartConfig(timeConfig);
  const displayPredictions = predictions && predictions?.length > 0 ? true : false;

  const warningThreshold = thresholdsMap[WARNING_SEVERITY];
  const criticalThreshold = thresholdsMap[CRITICAL_SEVERITY];
  const thresholdOperator = firstRule.thresholdOperator;
  const renderer = getRendererBasedOnThresholdTypeForMultiThreshold(
    thresholdOperator,
    warningThreshold,
    criticalThreshold,
    false,
    granularity,
    undefined,
    timeConfig,
    displayPredictions
  );

  const { selectedMetricGroup } = useSelectedMetricGroup();
  const enrichedTagFilterExpression = getEnrichedTagFilterExpression(tagFilterExpression, selectedMetricGroup);
  const unifiedMetricConfig = getUnifiedMetricConfig(alertConfig.rule, enrichedTagFilterExpression, granularity);

  const minThreshold = getThresholdData(getThresholdWithLowestSeverity(thresholdsMap)!, thresholdOperator);
  const y1Props = getY1ForMultiThreshold(
    metricName,
    metricLabel,
    formatter,
    renderer,
    granularity,
    thresholdOperator,
    warningThreshold,
    criticalThreshold,
    undefined,
    chartViewConfig,
    displayPredictions
  );

  // chartProps to render the metric values and threshold to the chart
  const chartProps = {
    ...getChartConfig({
      alertConfig,
      timeConfig
    }),
    y1: y1Props
  };

  // WS hook to get unified metric results
  const unifiedMetricData = useResultData(unifiedMetricConfig as Config, alertConfig.granularity, timeConfig);
  const metricResult = unifiedMetricData.metricResult;
  let metricResults = {};

  if (metricResult.errors.length > 0 || metricResult.progress.loading) {
    metricResults = {
      time: 0,
      progress: indeterminateProgress,
      errors: metricResult.errors,
      data: {}
    };
  } else {
    const metricValues = getMetricValues(metricResult) ?? [];
    const predictionMaxTime =
      predictions && predictions.length > 0 ? predictions[predictions.length - 1][0] : undefined;
    const thresholdValues = getThreshold(y1Props, minThreshold.type, metricValues, timeConfig, true);
    metricResults = {
      progress: finishedProgress,
      errors: {},
      time: predictionMaxTime ?? metricResult?.time,
      data: {
        [metricName]: metricValues,
        ...thresholdValues,
        predictions: predictions ?? [],
        lowerBound: lowerBound ?? [],
        upperBound: upperBound ?? []
      }
    };
  }

  const metricChartProps = { ...chartProps, result: metricResults as Result<MetricData> };
  return (
    <ChartWrapper
      showNoDataInfoWhenEmpty
      {...metricChartProps}
      metricsConfiguration={extendMetricConfiguration(chartProps)}
      granularity={granularity}
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) {
          return;
        }

        const alertsPreviewQuery = getAlertsPreviewQuery(
          timeConfig,
          enrichedTagFilterExpression,
          metricName,
          aggregation,
          crossSeriesAggregation,
          granularity,
          minThreshold,
          timeThreshold,
          entityType,
          regex,
          forecastingConfig
        );

        return (
          <MarkerLanesPresenter {...props}>
            <AlertsPreviewLane
              getAlertsPreview={getInfraMetricsAlertPreview}
              alertsPreviewConfiguration={alertsPreviewQuery}
            />
          </MarkerLanesPresenter>
        );
      }}
      nonInteractive
    />
  );
}

function getMetricValues(metricResult: Result<UnifiedMetricsResult[]>) {
  return metricResult?.data && metricResult?.data.length > 0 ? metricResult?.data[0]?.values : [];
}

function getThresholdData(rule: SmartAlertThresholdRuleUnion, operator: ThresholdOperator): ThresholdData {
  return {
    ...rule,
    operator
  };
}

export function useGetMetricLabel(entityType: string, metricName: string, aggregation: AggregationType) {
  const kpiDefinitions = getKpiDefinitions(entityType);

  const metricMetadatas = useMetricMetadatas({
    type: entityType,
    kpiDefinitions,
    queries: [metricName]
  });

  const metric = { aggregation, metric: metricName };
  const uniqueMetrics = getUniqueMetricsAndLabels([metric], metricMetadatas);

  return uniqueMetrics.find((metric: MetricItem) => metric.metric === metricName)?.label || metricName;
}

/**
 * In the alert preview, we pass the warning threshold if it is present. Otherwise, critical threshold.
 */
function getThresholdWithLowestSeverity(thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion }) {
  if (
    !isEmpty((thresholdsMap[WARNING_SEVERITY] as StaticThresholdRule)?.value) ||
    !isEmpty((thresholdsMap[WARNING_SEVERITY] as AdaptiveThresholdRule)?.deviationFactor)
  ) {
    return thresholdsMap[WARNING_SEVERITY];
  }

  return thresholdsMap[CRITICAL_SEVERITY];
}

function getAlertsPreviewQuery(
  timeConfig: TimeConfig,
  enrichedTagFilterExpression: TagFilter | TagFilterExpression,
  metricName: string,
  aggregation: AggregationType,
  crossSeriesAggregation: AggregationType,
  granularity: Granularity,
  threshold: ThresholdData,
  timeThreshold: InfraTimeThreshold,
  entityType: string,
  regex: boolean,
  forecastingConfig?: ForecastingConfig
) {
  if (shouldRequestAlertsPreview(threshold)) {
    return {
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metric: {
        source: 'INFRASTRUCTURE_METRICS',
        metric: metricName,
        aggregation,
        crossSeriesAggregation,
        granularity,
        tagFilterExpression: enrichedTagFilterExpression,
        timeConfig,
        regex: regex,
        type: entityType
      },
      forecastingConfig
    } as GetInfraMetricAlertsPreviewQuery;
  }
  return null;
}

function shouldRequestAlertsPreview(threshold: ThresholdData) {
  if ([STATIC_THRESHOLD, ADAPTIVE_BASELINE].includes(threshold.type)) {
    return !!((threshold as any)?.value || (threshold as any)?.baseline);
  }
  return false;
}
