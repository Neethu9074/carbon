/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import { Result, ServiceLevelIndicatorUnion, SyntheticSloEntity, TagFilter, TimeConfig } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import { aggregateTests, normalizeTestMetrics } from 'in-service-levels/utils/synthetics';
import useSyntheticTestMetrics from 'in-service-levels/hooks/useSyntheticTestMetrics';
import { isTrafficBlueprintIndicator } from 'in-service-levels/types';
import { MetricDataSeries } from 'in-components/Chart/types';
import { statusTagName } from 'in-synthetics/tags';

export default function useSyntheticsTrafficMetrics(
  entity: SyntheticSloEntity,
  indicator: ServiceLevelIndicatorUnion,
  timeWindows: TimeConfig[],
  granularity: number
): Result<MetricDataSeries[]> {
  const trafficType = isTrafficBlueprintIndicator(indicator) ? indicator.trafficType : undefined;
  const tagFilters: TagFilter[] =
    trafficType === 'erroneous'
      ? [
          {
            name: statusTagName,
            operator: 'EQUALS',
            numberValue: 1,
            entity: 'NOT_APPLICABLE',
            type: 'TAG_FILTER'
          }
        ]
      : [];

  const result = useSyntheticTestMetrics({
    granularity,
    testIds: entity.syntheticTestIds,
    timeWindows,
    aggregation: 'DISTINCT_COUNT',
    metric: 'id',
    resultType: 'TIME_SERIES',
    tagFilters
  });

  return useMemo(() => {
    const data = result?.data ?? [];
    const twGroupedMetrics = normalizeTestMetrics(data);
    const aggregatedMetrics = twGroupedMetrics.map((metrics, twIndex) =>
      aggregateTests(metrics, granularity, timeWindows[twIndex], 'SUM')
    );
    return {
      ...result,
      data: aggregatedMetrics
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash({ entity, timeWindows, data: result?.data, granularity })]);
}
