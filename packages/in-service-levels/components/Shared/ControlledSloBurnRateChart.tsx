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
import { correctionWindowMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { calculateSloGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import { ResultAwareChartMetrics } from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
import { hexToRGBA } from 'in-services/formatters/color';
import { number } from 'in-services/formatters/number';
import { sloMetrics } from 'in-service-levels/metrics';
import { carbonAlert } from 'in-themes/chartColors';
import { t } from 'in-i18n';

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
  correctionWindowMetrics?: MetricDataSeries;
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
  correctionWindowMetrics
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

  const hasCorrectionWindows = correctionWindowMetrics !== undefined && correctionWindowMetrics.length > 0;
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
        y1: {
          metricIds: [
            ...(hasCorrectionWindows ? [correctionWindowMetricId] : []),
            ...timeWindowsWithData.map((_, index) => `timeWindows${index}`)
          ],
          metrics: [...(hasCorrectionWindows ? [correctionWindowMetrics] : []), ...chartMetrics],
          min,
          max,
          excludedLabelsFromTooltip: [t('in-service-levels:general.metrics.correctionWindows')],
          labels: [
            ...(hasCorrectionWindows ? [t('in-service-levels:general.metrics.correctionWindows')] : []),
            ...timeWindowsWithData.map(() => sloMetrics.burnRate.label)
          ],
          icons: {
            colors: [...(hasCorrectionWindows ? [hexToRGBA(carbonAlert.gray60, 0.6)] : []), ...windowColorsWithData],
            types: [
              ...(hasCorrectionWindows ? ['lib_actions_stop'] : []),
              ...timeWindowsWithData.map(() => 'lib_legend_line_chart')
            ]
          },
          colors: [...(hasCorrectionWindows ? [hexToRGBA(carbonAlert.gray60, 0.6)] : []), ...windowColorsWithData],
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
