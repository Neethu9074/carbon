/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* eslint-disable import/prefer-default-export */

import { ServiceLevelIndicatorType, TimeConfig, TimeWindow } from '@instana/types';

import { calculateAvailableErrorBudget, truncFloat } from 'in-service-levels/utils/math';
import { MetricDataPoint, MetricDataSeries } from 'in-components/Chart/types';

interface ErrorBudgetSampleConfig {
  entityIds: string[];
  indicatorType?: ServiceLevelIndicatorType;
  sloTarget: number;
  timeWindow: TimeWindow;
}

interface ErrorBudgetSampleData {
  consumedErrorBudget: number;
  remainingErrorBudget: number;
  status: number;
  totalErrorBudget: number;
}

export function getErrorBudgetSampleData(
  { entityIds, indicatorType, sloTarget, timeWindow }: ErrorBudgetSampleConfig,
  timeConfig: TimeConfig,
  granularity: number
): ErrorBudgetSampleData {
  const isTimeBased = indicatorType === 'timeBased';

  const percentageConsumed = (1 - sloTarget) * 0.75;
  const status = truncFloat(1 - percentageConsumed, 2);

  if (isTimeBased) {
    const totalErrorBudget = calculateAvailableErrorBudget(timeWindow, sloTarget);
    const consumedErrorBudget = totalErrorBudget * percentageConsumed;
    const remainingErrorBudget = totalErrorBudget - consumedErrorBudget;

    return {
      consumedErrorBudget,
      remainingErrorBudget,
      status,
      totalErrorBudget
    };
  }

  const totalErrorBudget = (timeConfig.windowSize / granularity) * entityIds.length;
  const consumedErrorBudget = totalErrorBudget * percentageConsumed;
  const remainingErrorBudget = totalErrorBudget - consumedErrorBudget;

  return {
    consumedErrorBudget,
    remainingErrorBudget,
    status,
    totalErrorBudget
  };
}

export function generateSloErrorBudgetSampleMetrics(
  { windowSize, to }: TimeConfig,
  granularity: number,
  totalErrorBudget: number,
  remainingBudget: number,
  currentTime = Date.now()
): MetricDataSeries[] {
  const startTimestamp = (to ?? currentTime) - windowSize;
  const bucketCount = windowSize / granularity;
  const metricSeries: MetricDataSeries = [];
  const budgetRange = totalErrorBudget - remainingBudget;
  const bucketRange = budgetRange / bucketCount;

  for (let bucketNumber = 0; bucketNumber <= bucketCount; bucketNumber++) {
    const bucketTime = startTimestamp + granularity * bucketNumber;
    const minRemainingBudget = totalErrorBudget - bucketRange * bucketNumber;
    const maxRemainingBudget = totalErrorBudget - bucketRange * (bucketNumber + 1);
    const newRemainingBudget = Math.round(
      Math.random() * (maxRemainingBudget - minRemainingBudget) + maxRemainingBudget
    );
    const newBucket: MetricDataPoint = [bucketTime, newRemainingBudget];
    metricSeries.push(newBucket);
  }

  return [metricSeries];
}
