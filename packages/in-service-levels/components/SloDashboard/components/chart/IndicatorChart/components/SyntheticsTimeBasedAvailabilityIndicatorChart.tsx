/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { AvailabilityBlueprintIndicator, DateAsNumber, SyntheticSloEntity } from '@instana/types';
import { themes } from '@instana/design-tokens';

import { useLineWithThresholdAndMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThresholdAndMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  filterMetricValuesWithinTimeWindow
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import { thresholdMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
import useSyntheticsTimeBasedAvailabilityMetrics from 'in-service-levels/hooks/useSyntheticsTimeBasedAvailabilityMetrics';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { calculateTrafficGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metricId = 'availability';

interface SyntheticsTimeBasedAvailabilityIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SyntheticSloEntity;
  indicator: AvailabilityBlueprintIndicator;
  missingDataIndicator?: DateAsNumber;
  title?: string;
}
export default function SyntheticsTimeBasedAvailabilityIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title
}: SyntheticsTimeBasedAvailabilityIndicatorChartProps) {
  const { threshold } = indicator;

  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateTrafficGranularity(timeConfig);
  const metricsResult = useSyntheticsTimeBasedAvailabilityMetrics(entity, timeWindows, granularity);

  const metricValues = copyFirstBucketOfSubsequentDataSeries(metricsResult.data ?? []);
  const thresholdMetrics: MetricDataSeries = metricValues.flat(1).map(([timestamp]) => [timestamp, threshold]);
  const metricLabel = t('in-service-levels:general.metrics.failureRate');

  const filteredData = filterMetricValuesWithinTimeWindow(metricValues, timeConfig);

  const timeWindowStartIndex = getIndexOfFirstTimeWindowWithData(filteredData, timeWindows);
  const timeWindowsWithData = timeWindows.slice(timeWindowStartIndex);
  const windowColorsWithData = timeWindowColors.slice(timeWindowStartIndex);

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
          metricIds: [...timeWindowsWithData.map(() => metricId), thresholdMetricId],
          metrics: [...filteredData, thresholdMetrics],
          labels: [...timeWindowsWithData.map(() => metricLabel), t('in-service-levels:general.metrics.threshold')],
          colors: [...windowColorsWithData, themes.default.ids.color.option.red['500']],
          formatter: percentage.detailed,
          renderer
        },
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={metricsResult}
    />
  );
}
