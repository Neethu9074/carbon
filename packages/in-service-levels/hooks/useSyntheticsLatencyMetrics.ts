/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetUnifiedMetricsQuery, TimeConfig } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { testIdTagName } from 'in-synthetics/tags';

interface UseSyntheticsLatencyMetricsProps {
  granularity: number;
  testIds: string[];
  timeWindows: TimeConfig[];
}

export default function useSyntheticsLatencyMetrics({
  granularity,
  testIds,
  timeWindows
}: UseSyntheticsLatencyMetricsProps) {
  return useObservable(
    () =>
      getUnifiedMetrics({
        metrics: testIds.reduce<GetUnifiedMetricsQuery['metrics']>(
          (prevMetrics, testId) => ({
            ...prevMetrics,
            ...timeWindows.reduce<GetUnifiedMetricsQuery['metrics']>(
              (prevTwMetrics, timeWindow, twIndex) => ({
                ...prevTwMetrics,
                [`test-${twIndex}-${testId}`]: {
                  aggregation: 'MEAN',
                  granularity,
                  metric: 'response_time',
                  resultType: 'TIME_SERIES',
                  source: 'SYNTHETICS',
                  tagFilters: [tagFilter(testIdTagName, EQUALS, testId)],
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
    [generateStableHash({ testIds, granularity, timeWindows })]
  );
}
