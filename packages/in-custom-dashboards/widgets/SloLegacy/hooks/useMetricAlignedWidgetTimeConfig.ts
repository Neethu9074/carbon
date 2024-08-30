/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MetricResult } from '@instana/types';

import { TimeWindowConfig } from 'in-custom-dashboards/widgets/SloLegacy/hooks/useWidgetTimeConfig';

export default function useMetricAlignedWidgetTimeConfig(
  tc: TimeWindowConfig,
  metric?: MetricResult
): TimeWindowConfig {
  if (!metric || !metric.adjustedTimeframe) {
    return tc;
  }

  const { adjustedTimeframe } = metric;
  const toTimestamp = adjustedTimeframe.to;
  const fromTimestamp = toTimestamp - adjustedTimeframe.windowSize;
  const timeConfig = { ...tc.timeConfig, ...adjustedTimeframe };

  return {
    toTimestamp,
    fromTimestamp,
    timeConfig
  };
}
