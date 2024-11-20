/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DateAsNumber, LatencyBlueprintIndicator, SyntheticSloEntity } from '@instana/types';
import { themes } from '@instana/design-tokens';

import { useLineWithThresholdAndMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThresholdAndMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  filterMetricValuesWithinTimeWindow
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import { thresholdMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import useSyntheticsTimeBasedLatencyMetrics from 'in-service-levels/hooks/useSyntheticsTimeBasedLatencyMetrics';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { calculateTrafficGranularity } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metricId = 'latency';
interface SyntheticsTimeBasedLatencyIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SyntheticSloEntity;
  indicator: LatencyBlueprintIndicator;
  missingDataIndicator?: DateAsNumber;
  title?: string;
}

export default function SyntheticsTimeBasedLatencyIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title
}: SyntheticsTimeBasedLatencyIndicatorChartProps) {
  const { threshold } = indicator;
  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateTrafficGranularity(timeConfig);
  const metricsResult = useSyntheticsTimeBasedLatencyMetrics(entity, timeWindows, granularity);

  const metricValues = copyFirstBucketOfSubsequentDataSeries(metricsResult.data ?? []);
  const thresholdMetrics: MetricDataSeries = metricValues.flat(1).map(([timestamp]) => [timestamp, threshold]);
  const metricLabel = t('in-service-levels:general.metrics.latency');

  const filteredData = filterMetricValuesWithinTimeWindow(metricValues, timeConfig);
  const renderer = useLineWithThresholdAndMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator
  });

  return (
    <ResultAwareChart
      config={{
        automaticallySize,
        customHeight,
        customChartSkeletonHeight,
        title,
        renderHistoricDataIndicator: true,
        hasApproximateData: true,
        approximateTooltipText: t(
          'in-service-levels:sloDashboard.components.indicatorChart.components.approximateTooltip'
        ),
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [zoomInAction.name],
        granularity,
        y1: {
          metricIds: [...timeWindows.map(() => metricId), thresholdMetricId],
          metrics: [...filteredData, thresholdMetrics],
          labels: [...timeWindows.map(() => metricLabel), t('in-service-levels:general.metrics.threshold')],
          colors: [...timeWindowColors, themes.default.ids.color.option.red['500']],
          formatter: millis.compact,
          renderer
        },
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={metricsResult}
    />
  );
}
