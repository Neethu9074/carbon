/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Progress, Error, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  findMinMaxMetricValues
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import { overlappingSectionsMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { calculateSloGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import { ResultAwareChartMetrics } from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { Group } from 'in-service-levels/hooks/useCorrectionWindowOverlay';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
import { number } from 'in-services/formatters/number';
import { sloMetrics } from 'in-service-levels/metrics';
import { lighten } from 'in-services/formatters/color';
import { chartColors } from 'in-themes/chartColors';

interface ControlledSloBurnRateChartProps {
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
  onLegendItemToggle?: (id: string) => void;
  groups?: Group[];
  overlappingSections?: MetricDataSeries;
}

export default function ControlledSloBurnRateChart({
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
  renderPostChartContent,
  onLegendItemToggle,
  groups = [],
  overlappingSections = []
}: ControlledSloBurnRateChartProps) {
  const { createdDate } = configuration;

  const sloZoomInAction = useSloZoomInAction();

  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: createdDate
  });

  const chartMetrics = copyFirstBucketOfSubsequentDataSeries(metrics?.metrics);
  const { min, max } = findMinMaxMetricValues(chartMetrics.flat(1), { withBuffer: true });
  const timeWindowStartIndex = getIndexOfFirstTimeWindowWithData(chartMetrics, timeWindows);
  const timeWindowsWithData = timeWindows.slice(timeWindowStartIndex);
  const windowColorsWithData = timeWindowColors.slice(timeWindowStartIndex);

  const hasCorrectionWindows = groups.length > 0;
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
        reverseLegendOrder: hasCorrectionWindows,
        onLegendItemToggle: (_, __, id) => onLegendItemToggle?.(id),
        y1: {
          metricIds: [
            ...(hasCorrectionWindows
              ? [...groups.map(({ id }) => `correctionWindow-${id}`), overlappingSectionsMetricId]
              : []),
            ...timeWindowsWithData.map((_, index) => `timeWindows${index}`)
          ],
          metrics: [
            ...(hasCorrectionWindows ? [...groups.map(({ metrics }) => metrics), overlappingSections] : []),
            ...chartMetrics
          ],
          min,
          max,
          excludedLabelsFromTooltip: [...groups.map(({ name }) => name), overlappingSectionsMetricId],
          excludedLabelsFromLegend: [overlappingSectionsMetricId],
          labels: [
            ...(hasCorrectionWindows ? [...groups.map(({ name }) => name), overlappingSectionsMetricId] : []),
            ...timeWindowsWithData.map(() => sloMetrics.burnRate.label)
          ],
          icons: {
            colors: [
              ...(hasCorrectionWindows
                ? [
                    ...groups.map((_, i) =>
                      lighten(chartColors.strokeColors100[i % chartColors.strokeColors100.length], 0.25)
                    ),
                    ''
                  ]
                : []),
              ...windowColorsWithData
            ],
            types: [
              ...(hasCorrectionWindows ? [...groups.map(() => 'lib_actions_stop'), ''] : []),
              ...timeWindowsWithData.map(() => 'lib_circle_fill')
            ]
          },
          colors: [
            ...(hasCorrectionWindows
              ? [
                  ...groups.map((_, i) =>
                    lighten(chartColors.strokeColors100[i % chartColors.strokeColors100.length], 0.25)
                  ),
                  ''
                ]
              : []),
            ...windowColorsWithData
          ],
          renderer,
          formatter: number.detailed
        },
        granularity: metrics?.granularity ?? calculateSloGranularity(timeConfig),
        timeConfig,
        renderPostChartContent
      }}
      result={{ progress, errors }}
    />
  );
}
