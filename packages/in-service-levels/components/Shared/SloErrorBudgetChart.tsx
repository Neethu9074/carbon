/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import {
  copyFirstBucketOfSubsequentDataSeries,
  filterMetricValuesByTime,
  findMaxMetricValue,
  findMinMetricValue
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
  const filteredData = filterMetricValuesByTime(metrics, timeConfig);
  const { yMin, yMax } = calculateYMinBuffer(filteredData);

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

function calculateYMinBuffer(filteredData: MetricDataPoint[][]) {
  const minYValue = findMinMetricValue(filteredData.flat(1));
  const maxYValue = findMaxMetricValue(filteredData.flat(1));
  const range = maxYValue - minYValue;

  // Percentage-based buffer (10% of the data range)
  const bufferPercentage = 0.1;
  // Fixed minimum buffer value to ensure some space even for small ranges
  const fixedBuffer = 5;
  const negativeBufferFactor = 1.5;
  let buffer = Math.abs(range * bufferPercentage);

  buffer = Math.max(buffer, fixedBuffer);

  const yMin = minYValue < 0 ? minYValue - buffer : minYValue;
  const yMax = maxYValue > 0 ? maxYValue + buffer : maxYValue + buffer * negativeBufferFactor;
  return { yMin, yMax };
}
