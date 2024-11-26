/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import { isSyntheticSloEntity, Result, SyntheticSloEntity, TimeConfig } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import { aggregateTests, normalizeTestMetrics } from 'in-service-levels/utils/synthetics';
import useSyntheticTestMetrics from 'in-service-levels/hooks/useSyntheticTestMetrics';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { statusTagName } from 'in-synthetics/tags';

interface UseSyntheticsEventBasedAvailabilityMetricsReturnType {
  good: MetricDataSeries;
  bad: MetricDataSeries;
}

export default function useSyntheticsEventBasedAvailabilityMetrics(
  entity: SyntheticSloEntity,
  timeConfig: TimeConfig,
  granularity: number
): Result<UseSyntheticsEventBasedAvailabilityMetricsReturnType> {
  if (!isSyntheticSloEntity(entity)) throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);

  const result = useSyntheticTestMetrics({
    // In order to get distinct status for each result, we need to request
    // fine granularity
    granularity: 1,
    testIds: entity.syntheticTestIds,
    timeWindows: [timeConfig],
    aggregation: 'DISTINCT_COUNT',
    metric: 'id',
    resultType: 'TIME_SERIES',
    tagFilters: [
      {
        numberValue: 0,
        name: statusTagName,
        operator: EQUALS,
        entity: 'NOT_APPLICABLE',
        type: 'TAG_FILTER'
      }
    ]
  });

  return useMemo(() => {
    const data = result?.data ?? [];
    const [metrics] = normalizeTestMetrics(data);
    const emptyResult = { good: [] as MetricDataSeries, bad: [] as MetricDataSeries };
    const { good, bad } =
      metrics?.reduce<{ good: MetricDataSeries; bad: MetricDataSeries }>((prev, [timeStamp, value]) => {
        if (value === 1) return { good: [...prev.good], bad: [...prev.bad, [timeStamp, 1]] };
        if (value === 0) return { good: [...prev.good, [timeStamp, 1]], bad: [...prev.bad] };
        return prev;
      }, emptyResult) ?? emptyResult;
    const goodMetrics = aggregateTests(good, granularity, timeConfig, 'SUM');
    const badMetrics = aggregateTests(bad, granularity, timeConfig, 'SUM');
    return {
      ...result,
      data: {
        good: goodMetrics,
        bad: badMetrics
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash({ entity, timeConfig, data: result?.data, granularity })]);
}
