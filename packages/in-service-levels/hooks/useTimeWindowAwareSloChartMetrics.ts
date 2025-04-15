/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  AdjustedTimeframe,
  GetUnifiedMetricsQuery,
  Result,
  ServiceLevelObjectiveConfiguration,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { calculateSloReferenceChartGranularity } from 'in-service-levels/components/SloDashboard/components/chart/utils';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { adjustTimeWindowsToTimeConfig } from 'in-service-levels/utils/time';
import { hasError, isLoading, success } from 'in-services/util/result';
import { MetricDataSeries } from 'in-components/Chart/types';
import { FetchedState } from 'in-hooks/utils/types';

export interface ResultAwareChartMetrics {
  granularity: number;
  metrics: MetricDataSeries[];
  adjustedTimeframe?: AdjustedTimeframe;
}

interface UseTimeWindowAwareSloChartMetricsParams {
  sloConfig: ServiceLevelObjectiveConfiguration;
  getMetricConfigForTimeConfig: (timeConfig: TimeConfig) => UnifiedMetricConfigurationUnion;
  timeConfig: TimeConfig;
  timeWindows: TimeConfig[];
  granularity?: number;
}

export default function useTimeWindowAwareSloChartMetrics({
  sloConfig,
  getMetricConfigForTimeConfig,
  timeConfig,
  timeWindows,
  granularity
}: UseTimeWindowAwareSloChartMetricsParams): FetchedState<ResultAwareChartMetrics> {
  const { id } = sloConfig;
  const adjustedTimeWindows = adjustTimeWindowsToTimeConfig(timeConfig, timeWindows);
  const metricConfigs: { [index: string]: UnifiedMetricConfigurationUnion } = adjustedTimeWindows.reduce(
    (previous, timeConfig, index) =>
      ({
        ...previous,
        [`timeWindow${index}`]: getMetricConfigForTimeConfig(timeConfig)
      } as {
        [index: string]: UnifiedMetricConfigurationUnion;
      }),
    {} as GetUnifiedMetricsQuery['metrics']
  );

  const result = useObservable(
    () => getUnifiedMetrics({ metrics: metricConfigs }),
    [id, generateStableHash(adjustedTimeWindows), generateStableHash(metricConfigs)]
  );

  if (!result || isLoading(result) || hasError(result)) {
    // We don't have data yet, so a transformation of the return type is not necessary
    return resultToFetchedStateResponse(result as Result<any>);
  }

  const metrics = result.data?.filter(r => r.id.startsWith('timeWindow')) ?? [];
  const mappedData: ResultAwareChartMetrics = {
    metrics: metrics.map(metric => metric.values as MetricDataSeries) ?? [],
    granularity: granularity ?? getMetricGranularity(timeConfig, metricConfigs, result.data),
    adjustedTimeframe: metrics?.[0]?.adjustedTimeframe
  };

  return resultToFetchedStateResponse(success(mappedData));
}

function getMetricGranularity(
  timeConfig: TimeConfig,
  metricConfigs: GetUnifiedMetricsQuery['metrics'],
  metricResults?: UnifiedMetricsResult[]
): number {
  const resultGranularity = metricResults?.[0]?.granularity;
  if (resultGranularity) return resultGranularity;

  const configGranularity = Object.keys(metricConfigs).reduce((prev, metricName) => {
    const granularity = metricConfigs[metricName].granularity ?? 0;
    return granularity > prev ? granularity : prev;
  }, 0);

  if (configGranularity) return configGranularity;

  return calculateSloReferenceChartGranularity(timeConfig);
}
