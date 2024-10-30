/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  GetUnifiedMetricsQuery,
  ServiceLevelIndicator,
  SloEntityUnion,
  TagFilterExpression,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';

import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';

export default function useSliMetricConfiguration<INDICATOR_TYPE extends ServiceLevelIndicator>(
  entity: SloEntityUnion,
  indicator: INDICATOR_TYPE,
  granularity: number,
  timeWindows: TimeConfig[],
  getMetricConfig: (
    entity: SloEntityUnion,
    timeConfig: TimeConfig,
    indicator: INDICATOR_TYPE,
    tagFilterExpression: TagFilterExpression,
    granularity: number
  ) => UnifiedMetricConfigurationUnion
): Record<string, UnifiedMetricConfigurationUnion> {
  const tagFilterExpression = useBasicTagFilterExpression({ entity });

  return timeWindows.reduce(
    (previous, timeConfig, index) => ({
      ...previous,
      [`timeWindow${index}`]: getMetricConfig(entity, timeConfig, indicator, tagFilterExpression, granularity)
    }),
    {} as GetUnifiedMetricsQuery['metrics']
  );
}
