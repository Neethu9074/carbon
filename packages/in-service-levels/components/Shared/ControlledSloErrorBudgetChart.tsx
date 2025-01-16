/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Progress, Error, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  findMinMaxMetricValues
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { calculateSloGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import { ResultAwareChartMetrics } from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { minutes, number } from 'in-services/formatters/number';
import { sloMetrics } from 'in-service-levels/metrics';

interface ControlledSloErrorBudgetChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  timeConfig: TimeConfig;
  timeWindows: TimeConfig[];
  timeWindowColors: string[];
  configuration: ServiceLevelObjectiveConfiguration;
  progress: Progress;
  errors: Error[];
  metrics?: ResultAwareChartMetrics;
  title?: string;
  renderPostChartContent?: Parameters<typeof ResultAwareChart>[0]['config']['renderPostChartContent'];
}

export default function ControlledSloErrorBudgetChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  timeConfig,
  timeWindows,
  timeWindowColors,
  configuration,
  metrics,
  progress,
  errors,
  title,
  renderPostChartContent
}: ControlledSloErrorBudgetChartProps) {
  const { indicator, createdDate, timeWindow } = configuration;

  const missingDataIndicator = timeWindow.type === 'fixed' ? timeWindow.startTimestamp : createdDate;
  const sloZoomInAction = useSloZoomInAction();

  const formatter = indicator.type === 'timeBased' ? minutes.fixedCompact : number.compact;
  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator
  });

  const chartMetrics = copyFirstBucketOfSubsequentDataSeries(metrics?.metrics);
  const { min, max } = findMinMaxMetricValues(chartMetrics.flat(1), { withBuffer: true });
  const timeWindowStartIndex = getIndexOfFirstTimeWindowWithData(chartMetrics, timeWindows);
  const timeWindowsWithData = timeWindows.slice(timeWindowStartIndex);
  const windowColorsWithData = timeWindowColors.slice(timeWindowStartIndex);

  return (
    <ResultAwareChart
      config={{
        title,
        automaticallySize,
        customHeight,
        customChartSkeletonHeight,
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [zoomInAction.name],
        y1: {
          metricIds: timeWindowsWithData.map((_, index) => `timeWindows${index}`),
          metrics: chartMetrics,
          min,
          max,
          renderAllTickLabels: true,
          labels: timeWindowsWithData.map(() => sloMetrics.remainingBudget.label),
          colors: windowColorsWithData,
          renderer,
          formatter
        },
        granularity: metrics?.granularity ?? calculateSloGranularity(timeConfig),
        timeConfig,
        renderPostChartContent
      }}
      result={{ progress, errors }}
    />
  );
}
