/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import { isSyntheticSloEntity, Result, ServiceLevelIndicator, SyntheticSloEntity, TimeConfig } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import { GREATER_THAN, LESS_OR_EQUAL_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { aggregateTests, normalizeTestMetrics } from 'in-service-levels/utils/synthetics';
import useSyntheticTestMetrics from 'in-service-levels/hooks/useSyntheticTestMetrics';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { all } from 'in-hooks/utils/progress';

interface UseSyntheticsEventBasedLatencyMetricsReturnType {
  good: MetricDataSeries;
  bad: MetricDataSeries;
}

export default function useSyntheticsEventBasedLatencyMetrics(
  indicator: ServiceLevelIndicator,
  entity: SyntheticSloEntity,
  timeConfig: TimeConfig,
  granularity: number
): Result<UseSyntheticsEventBasedLatencyMetricsReturnType> {
  if (!isSyntheticSloEntity(entity)) throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);

  const goodTestsResult = useSyntheticTestMetrics({
    aggregation: 'DISTINCT_COUNT',
    granularity,
    metric: 'response_time',
    resultType: 'TIME_SERIES',
    testIds: entity.syntheticTestIds,
    timeWindows: [timeConfig],
    tagFilters: [
      {
        name: 'synthetic.metricsResponseTime',
        operator: LESS_OR_EQUAL_THAN,
        numberValue: indicator.threshold,
        entity: 'NOT_APPLICABLE',
        type: 'TAG_FILTER'
      }
    ]
  });

  const badTestsResult = useSyntheticTestMetrics({
    aggregation: 'DISTINCT_COUNT',
    granularity,
    metric: 'response_time',
    resultType: 'TIME_SERIES',
    testIds: entity.syntheticTestIds,
    timeWindows: [timeConfig],
    tagFilters: [
      {
        name: 'synthetic.metricsResponseTime',
        operator: GREATER_THAN,
        numberValue: indicator.threshold,
        entity: 'NOT_APPLICABLE',
        type: 'TAG_FILTER'
      }
    ]
  });

  const aggregatedGoodResult = useMemo<Result<MetricDataSeries>>(() => {
    const data = goodTestsResult?.data ?? [];
    const [metrics] = normalizeTestMetrics(data);
    const aggregatedMetrics = aggregateTests(metrics ?? [], granularity, timeConfig, 'MEAN');
    return {
      ...goodTestsResult,
      data: aggregatedMetrics
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash({ indicator, entity, timeConfig, data: goodTestsResult?.data, granularity })]);

  const aggregatedBadResult = useMemo<Result<MetricDataSeries>>(() => {
    const data = badTestsResult?.data ?? [];
    const [metrics] = normalizeTestMetrics(data);
    const aggregatedMetrics = aggregateTests(metrics ?? [], granularity, timeConfig, 'MEAN');
    return {
      ...badTestsResult,
      data: aggregatedMetrics
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash({ indicator, entity, timeConfig, data: badTestsResult?.data, granularity })]);

  return {
    errors: [...aggregatedBadResult.errors, ...aggregatedGoodResult.errors],
    progress: all(aggregatedBadResult.progress, aggregatedGoodResult.progress),
    data: {
      bad: aggregatedBadResult.data ?? [],
      good: aggregatedGoodResult.data ?? []
    }
  };
}
