/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MetricResult, Result, UnifiedMetricConfigurationUnion } from '@instana/types';
import { useObservable } from '@instana/hooks';

import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export const metricKey = 'histogram';

export default function useResultData({ config }: any) {
  const timeConfig = useTimeConfig();

  const metricDefaults = {
    timeShift: {
      offset: 0
    },
    resultType: 'HISTOGRAM'
  };

  const metrics: { [index: string]: UnifiedMetricConfigurationUnion } = {
    [metricKey]: {
      timeConfig,
      ...config.metricConfiguration,
      ...config.tagFilters,
      ...metricDefaults
    }
  };

  const result: Result<MetricResult[]> =
    useObservable(() => getUnifiedMetrics({ metrics }), [config, timeConfig, config.metricConfiguration.timeShift]) ??
    pendingResult;

  return result;
}
