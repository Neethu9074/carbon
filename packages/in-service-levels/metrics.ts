/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

import { calculateSloGranularity } from 'in-service-levels/utils';

interface SloMetricConfigGeneratorProps {
  configId: string;
  timeConfig: TimeConfig;
}

const metricConfigurations = Object.freeze({
  status: {
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'SINGLE_NUMBER',
        metric: 'STATUS',
        timeConfig
      } as const)
  },
  remainingBudget: {
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'SINGLE_NUMBER',
        metric: 'ERROR_BUDGET_REMAINING',
        timeConfig
      } as const),
    timeSeriesCompact: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'ERROR_BUDGET_REMAINING_SPARK_CHART',
        timeConfig,
        granularity: calculateSloGranularity(timeConfig)
      } as const)
  }
});

export default metricConfigurations;
