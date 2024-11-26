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

export default function useSyntheticsTimeBasedAvailabilityMetrics(
  entity: SyntheticSloEntity,
  timeWindows: TimeConfig[],
  granularity: number
): Result<MetricDataSeries[]> {
  if (!isSyntheticSloEntity(entity)) throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);

  const result = useSyntheticTestMetrics({
    // In order to get distinct status for each result, we need to request
    // fine granularity
    granularity: 1,
    testIds: entity.syntheticTestIds,
    timeWindows,
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
    const twGroupedMetrics = normalizeTestMetrics(data);
    const aggregatedMetrics: MetricDataSeries[] = twGroupedMetrics.map((metrics, twIndex) =>
      aggregateTests(metrics, granularity, timeWindows[twIndex], 'MEAN')
    );
    return {
      ...result,
      data: aggregatedMetrics
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash({ entity, timeWindows, data: result?.data, granularity })]);
}
