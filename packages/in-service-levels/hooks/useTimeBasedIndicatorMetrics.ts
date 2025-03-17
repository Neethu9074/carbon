/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetUnifiedMetricsQuery, Result, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { sloMetrics } from 'in-service-levels/metrics';

interface UseTimeBasedIndicatorMetricsParams {
  granularity: number;
  timeWindows: TimeConfig[];
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function useTimeBasedIndicatorMetrics({
  granularity,
  timeWindows,
  configuration
}: UseTimeBasedIndicatorMetricsParams): Result<UnifiedMetricsResult[]> {
  const hasMatchingTimeWindows = timeWindows.length > 0;
  const metricConfiguration = timeWindows.reduce<GetUnifiedMetricsQuery['metrics']>(
    (previous, timeConfig, index) => ({
      ...previous,
      [`timeWindow${index}`]: sloMetrics.indicator.timeSeries({
        configId: configuration.id!,
        timeConfig,
        granularity
      })
    }),
    {}
  );
  return (
    useObservable(() => {
      if (!hasMatchingTimeWindows) return successObservable([]);
      return getUnifiedMetrics({ metrics: metricConfiguration });
    }, [generateStableHash(metricConfiguration), hasMatchingTimeWindows]) ?? pendingResult
  );
}
