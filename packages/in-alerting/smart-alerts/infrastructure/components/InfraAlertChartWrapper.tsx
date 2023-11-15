/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType, InfraAlertConfigWithMetadata, Result, TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

//@ts-expect-error TS migration
import { getThreshold, extendMetricConfiguration } from 'in-alerting/components/Chart/AlertingChartWrapper';
//@ts-expect-error TS migration
import { getRendererBasedOnThresholdType, getY1 } from 'in-alerting/components/Chart/AlertingChart';
import {
  getUnifiedMetricConfig,
  getChartConfig
} from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
// @ts-expect-error TS migration
import { getUniqueMetricsAndLabels } from 'in-infrastructure/Explore/Explore';
import { MetricItem } from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { useResultData } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { finishedProgress, indeterminateProgress } from 'in-services/fixedObjects';
import { Config, MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { getMetricDefinition } from 'in-sdk/metrics';
import { t } from 'in-i18n';

interface InfraAlertChartWrapperProps {
  alertConfig: InfraAlertConfigWithMetadata;
  timeConfig: TimeConfig;
  predictions?: number[][];
  lowerBound?: number[][];
  upperBound?: number[][];
}

export default function InfraAlertChartWrapper(props: InfraAlertChartWrapperProps) {
  const { alertConfig, timeConfig, predictions, lowerBound, upperBound } = props;
  const { entityType, metricName, aggregation } = alertConfig.rule;
  const { threshold, granularity } = alertConfig;

  const metricDefinition = getMetricDefinition(entityType, metricName);
  const formatter = metricDefinition.formatter;

  const highlight = undefined;

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  const displayPredictions = predictions && predictions?.length > 0 ? true : false;

  const renderer = getRendererBasedOnThresholdType(threshold, highlight, granularity, [], displayPredictions);

  // config to get unified metric data
  const unifiedMetricConfig = getUnifiedMetricConfig({
    alertConfig
  });

  // chartProps to render the metric values and threshold to the chart
  const chartProps = {
    ...getChartConfig({
      alertConfig,
      timeConfig
    }),
    y1: getY1(
      metricName,
      highlight,
      metricLabel,
      formatter,
      renderer,
      granularity,
      threshold,
      [],
      chartViewConfig,
      displayPredictions
    )
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
    metricResults = {
      progress: finishedProgress,
      errors: {},
      time: predictionMaxTime ?? metricResult?.time,
      data: {
        [metricName]: metricValues,
        threshold: getThreshold(chartProps.y1, chartProps.thresholdType, metricValues, timeConfig),
        predictions: predictions ?? [],
        lowerBound: lowerBound ?? [],
        upperBound: upperBound ?? []
      }
    };
  }

  const metricChartProps = { ...chartProps, result: metricResults as Result<MetricData> };
  return (
    <Card title={t('in-events:titleMetrics')}>
      <ChartWrapper
        showNoDataInfoWhenEmpty
        {...metricChartProps}
        metricsConfiguration={extendMetricConfiguration(chartProps)}
        granularity={granularity}
      />
    </Card>
  );
}

function getMetricValues(metricResult: Result<UnifiedMetricsResult[]>) {
  return metricResult?.data && metricResult?.data.length > 0 ? metricResult?.data[0]?.values : [];
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

  return uniqueMetrics.find((metric: MetricItem) => metric.metric === metricName)?.label;
}
