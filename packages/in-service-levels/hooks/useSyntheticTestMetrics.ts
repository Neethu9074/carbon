/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  GetUnifiedMetricsQuery,
  Result,
  SyntheticUnifiedMetricConfiguration,
  TagFilter,
  TimeConfig
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { testIdTagName } from 'in-synthetics/tags';
import { success } from 'in-services/util/result';

interface UseSyntheticTestMetricsProps
  extends Pick<SyntheticUnifiedMetricConfiguration, 'aggregation' | 'metric' | 'resultType'> {
  granularity: number;
  testIds: string[];
  timeWindows: TimeConfig[];
  tagFilters?: TagFilter[];
}

export default function useSyntheticTestMetrics({
  granularity,
  testIds,
  timeWindows,
  aggregation = 'DISTINCT_COUNT',
  metric = 'id',
  resultType = 'TIME_SERIES',
  tagFilters = []
}: UseSyntheticTestMetricsProps): Result<UnifiedMetricsResult[]> {
  return (
    useObservable(
      () =>
        getUnifiedMetrics({
          metrics: testIds.reduce<GetUnifiedMetricsQuery['metrics']>(
            (prevMetrics, testId) => ({
              ...prevMetrics,
              ...timeWindows.reduce<GetUnifiedMetricsQuery['metrics']>(
                (prevTwMetrics, timeWindow, twIndex) => ({
                  ...prevTwMetrics,
                  [`test-${twIndex}-${testId}`]: {
                    aggregation,
                    granularity,
                    metric,
                    resultType,
                    source: 'SYNTHETICS',
                    tagFilters: [tagFilter(testIdTagName, EQUALS, testId), ...tagFilters],
                    timeConfig: timeWindow,
                    timeShift: { offset: 0 }
                  }
                }),
                {} as GetUnifiedMetricsQuery['metrics']
              )
            }),
            {} as GetUnifiedMetricsQuery['metrics']
          )
        }),
      [generateStableHash({ testIds, granularity, timeWindows, tagFilters })]
    ) ?? success([])
  );
}
