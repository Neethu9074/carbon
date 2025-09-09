/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { AggregationType, Result, TimeConfig, UnifiedMetricConfigurationUnion } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getChartGranularity } from 'in-gen-ai-observability/config/metricsConfig';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { MetricDataSeries } from 'in-components/Chart/types';
import { pendingResult } from 'in-services/fixedObjects';

export interface LlmMetricsOptions {
  metricName: string;
  tag: string;
  groupBy?: string;
  timeConfig: TimeConfig;
  maxResults?: number;
  aggregation?: AggregationType;
  resultType?: 'TIME_SERIES' | 'SINGLE_NUMBER';
  direction?: 'ASC' | 'DESC';
  crossSeriesAggregation?: string;
}

/**
 * Hook to fetch LLM metrics data
 * @param options Configuration options for the metrics
 * @returns Result object with the metrics data
 */
export function useLlmMetrics({
  metricName,
  tag,
  groupBy = 'model_id',
  timeConfig,
  maxResults = 100,
  aggregation = 'SUM' as AggregationType,
  resultType = 'TIME_SERIES',
  direction = 'DESC',
  crossSeriesAggregation = 'SUM'
}: LlmMetricsOptions): Result<any> {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);

  const metricConfig: UnifiedMetricConfigurationUnion = {
    aggregation,
    metric: metricName,
    source: 'INFRASTRUCTURE_METRICS',
    timeShift: { offset: 0 },
    tagFilterExpression: {
      logicalOperator: 'AND',
      type: 'EXPRESSION',
      elements: []
    },
    type: 'oTelLLM',
    crossSeriesAggregation: crossSeriesAggregation as AggregationType,
    grouping: [
      {
        maxResults,
        by: {
          groupbyTag: tag,
          groupbyTagEntity: 'DESTINATION',
          groupbyTagSecondLevelKey: ''
        },
        includeOthers: false,
        includeUnmatched: false,
        direction
      }
    ],
    timeConfig: timeConfigExtendedForLiveMode,
    resultType,
    regex: false,
    granularity: getChartGranularity(timeConfig)
  };

  const metrics = {
    data: metricConfig
  };

  return (
    useObservable(
      () => getUnifiedMetrics({ metrics }),
      [timeConfig, metricName, tag, groupBy, maxResults, aggregation, resultType, direction, crossSeriesAggregation]
    ) ?? pendingResult
  );
}

/**
 * Helper function to extract metrics data from a result object
 * @param result The result object from useLlmMetrics
 * @returns Object containing metrics data arrays and labels
 */
export function extractMetricsData(result: Result<any>): { metricsData: MetricDataSeries[]; labels: string[] } {
  let metricsData: MetricDataSeries[] = [];
  let labels: string[] = [];

  if (result && result.data) {
    if (result.data.values && Array.isArray(result.data.values)) {
      // If data is in the format { id, values: [[timestamp, value], ...], label }
      const validatedValues = result.data.values.filter((point: any) => Array.isArray(point) && point.length === 2);
      metricsData = [validatedValues as MetricDataSeries];
      labels = [result.data.label || 'Data'];
    } else if (Array.isArray(result.data)) {
      // If data is an array of metrics
      metricsData = result.data.map(item => {
        const values = item.values || [];
        return values.filter((point: any) => Array.isArray(point) && point.length === 2) as MetricDataSeries;
      });
      labels = result.data.map(item => item.label || 'Data');
    }
  }

  return { metricsData, labels };
}
