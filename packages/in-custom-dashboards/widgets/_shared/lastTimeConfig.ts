/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig, UnifiedMetricConfiguration } from '@instana/types';

export function getTimeConfigBasedOnMetricConfiguration(
  metricConfig: UnifiedMetricConfiguration,
  originalTimeConfig: TimeConfig
): TimeConfig {
  return metricConfig.lastValue
    ? {
        ...originalTimeConfig,
        windowSize: 10000
      }
    : originalTimeConfig;
}
