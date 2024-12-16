/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import ControlledSloErrorBudgetChart from 'in-service-levels/components/Shared/ControlledSloErrorBudgetChart';
import { findMinMaxMetricValues } from 'in-service-levels/components/SloDashboard/components/chart/utils';
import useTimeWindowAwareSloChartMetrics from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { MetricDataPoint } from 'in-components/Chart/types';
import { sloMetrics } from 'in-service-levels/metrics';

interface ErrorBudgetChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  timeConfig: TimeConfig;
  timeWindows: TimeConfig[];
  timeWindowColors: string[];
  configuration: ServiceLevelObjectiveConfiguration;
  title?: string;
}

export default function ErrorBudgetChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  timeConfig,
  timeWindows,
  timeWindowColors,
  configuration,
  title
}: ErrorBudgetChartProps) {
  const granularity = calculateSloGranularity(timeConfig);
  const [metricResult, , errors, progress] = useTimeWindowAwareSloChartMetrics(
    configuration,
    timeConfig =>
      sloMetrics.remainingBudget.timeSeries({
        configId: configuration.id!,
        timeConfig,
        granularity
      }),
    timeConfig,
    timeWindows,
    granularity
  );

  const metricsWithGranularity = metricResult
    ? { ...metricResult, granularity: metricResult?.granularity ?? granularity }
    : undefined;

  return (
    <ControlledSloErrorBudgetChart
      automaticallySize={automaticallySize}
      customHeight={customHeight}
      customChartSkeletonHeight={customChartSkeletonHeight}
      timeConfig={timeConfig}
      timeWindows={timeWindows}
      timeWindowColors={timeWindowColors}
      configuration={configuration}
      title={title}
      metrics={metricsWithGranularity}
      errors={errors}
      progress={progress}
      renderPostChartContent={props => <SloDashboardMarkerLanes entity={configuration.entity} {...props} />}
    />
  );
}

export function calculateYScaleBuffer(filteredData: MetricDataPoint[][]): { yMin: number; yMax: number } {
  const { min: minYValue, max: maxYValue } = findMinMaxMetricValues(filteredData.flat(1));
  const range = maxYValue - minYValue;

  const maxRangeThreshold = 100;
  const smallRangeBufferPercentage = 0.15;
  const largeRangeBufferPercentage = 0.1;
  const smallRangeFixedBuffer = 10;
  const largeRangeFixedBuffer = 5;
  const isShortRange = range < maxRangeThreshold;

  // Adjusts the buffer proportionally to the data range, making sure that the buffer scales with larger or smaller ranges.
  const bufferPercentage = isShortRange ? smallRangeBufferPercentage : largeRangeBufferPercentage;
  // Provides a baseline buffer to ensure there is always a minimum amount of space around the data.
  const fixedBuffer = isShortRange ? smallRangeFixedBuffer : largeRangeFixedBuffer;

  const buffer = Math.max(Math.abs(range * bufferPercentage), fixedBuffer);

  const yMin = minYValue <= 0 ? minYValue : minYValue - buffer;
  const yMax = maxYValue + buffer;

  return { yMin, yMax };
}
