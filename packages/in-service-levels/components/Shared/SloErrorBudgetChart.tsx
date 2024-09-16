/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import {
  copyFirstBucketOfSubsequentDataSeries,
  filterMetricValuesWithinTimeWindow,
  findMinMaxMetricValues
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import useTimeWindowAwareSloChartMetrics from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { minutes, number } from 'in-services/formatters/number';
import { MetricDataPoint } from 'in-components/Chart/types';
import { sloMetrics } from 'in-service-levels/metrics';

interface ErrorBudgetChartProps {
  timeConfig: TimeConfig;
  timeWindows: TimeConfig[];
  timeWindowColors: string[];
  configuration: ServiceLevelObjectiveConfiguration;
  title?: string;
}

export default function ErrorBudgetChart({
  timeConfig,
  timeWindows,
  timeWindowColors,
  configuration,
  title
}: ErrorBudgetChartProps) {
  const { indicator, entity, createdDate, timeWindow } = configuration;

  const missingDataIndicator = timeWindow.type === 'fixed' ? timeWindow.startTimestamp : createdDate;
  const sloZoomInAction = useSloZoomInAction();
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

  const formatter = indicator.type === 'timeBased' ? minutes.fixedCompact : number.compact;
  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator
  });
  const metrics = copyFirstBucketOfSubsequentDataSeries(metricResult?.metrics);
  const filteredData = filterMetricValuesWithinTimeWindow(metrics, timeConfig);
  const { yMin, yMax } = calculateYScaleBuffer(filteredData);

  return (
    <ResultAwareChart
      config={{
        title,
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [zoomInAction.name],
        y1: {
          metricIds: timeWindows.map((_, index) => `timeWindows${index}`),
          metrics: filteredData,
          min: yMin,
          max: yMax,
          renderAllTickLabels: true,
          labels: timeWindows.map(() => sloMetrics.remainingBudget.label),
          colors: timeWindowColors,
          renderer,
          formatter
        },
        granularity: metricResult?.granularity ?? granularity,
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />,
        // FIXME: Chart height should be dynamic based on the dashboard layout and available screen size.
        // The current values are just measures taken from the default rendering of the chart to make the sizing work
        customHeight: 250,
        customChartSkeletonHeight: 308
      }}
      result={{ progress, errors }}
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
