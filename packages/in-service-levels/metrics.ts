/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

import { calculateSloGranularity } from 'in-service-levels/utils';

interface SloMetricConfigGeneratorProps {
  configId: string;
  timeConfig: TimeConfig;
}

const metricConfigurations = Object.freeze({
  status: {
    label: t('in-service-levels:general.metrics.status'),
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
    label: t('in-service-levels:general.metrics.remainingBudget'),
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
    timeSeries: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'ERROR_BUDGET_REMAINING_CHART',
        timeConfig,
        granularity: calculateSloGranularity(timeConfig)
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
  },
  totalBudget: {
    label: t('in-service-levels:general.metrics.totalBudget'),
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'SINGLE_NUMBER',
        metric: 'TOTAL_ERROR_BUDGET',
        timeConfig
      } as const)
  },
  consumedBudget: {
    label: t('in-service-levels:general.metrics.consumedBudget'),
    timeSeries: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'CONSUMED_ERROR_BUDGET_CHART',
        timeConfig,
        granularity: calculateSloGranularity(timeConfig)
      } as const)
  }
});

export default metricConfigurations;
