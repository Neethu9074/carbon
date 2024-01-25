/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

// eslint-disable-next-line no-restricted-imports -- We cant specifically allow parts of a otherwise restricted package
import { defaultNumberOfSuggestedDatapoints } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { MetricDataSeries } from 'in-components/Chart/types';
import { getChartGranularity } from 'in-stores/metric';

export function findMinMetricValue(metrics: MetricDataSeries): number {
  return metrics.reduce<number>((acc, [, value], index) => {
    if (index === 0) return value;
    return Math.min(acc, value);
  }, 0);
}

export function calculateSloReferenceChartGranularity(timeConfig: TimeConfig, needsExtraSpace = false): number {
  return getChartGranularity(
    timeConfig,
    defaultNumberOfSuggestedDatapoints * (needsExtraSpace ? 0.5 : 1),
    calculateSloGranularity(timeConfig)
  );
}
