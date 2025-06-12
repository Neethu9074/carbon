/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  DateAsNumber,
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  LatencyBlueprintIndicator,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion
} from '@instana/types';
import { themes } from '@instana/design-tokens';

import { useLineWithThresholdAndMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThresholdAndMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  filterMetricValuesWithinTimeWindow
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/SloDashboardMarkerLanes';
import { overlappingSectionsMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
import { thresholdMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import { calculateSloGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import { applicationMetrics, syntheticMetrics, websiteMetrics } from 'in-service-levels/metrics';
import useTimeBasedIndicatorMetrics from 'in-service-levels/hooks/useTimeBasedIndicatorMetrics';
import useCorrectionWindowOverlay from 'in-service-levels/hooks/useCorrectionWindowOverlay';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { millis } from 'in-services/formatters/number';
import { lighten } from 'in-services/formatters/color';
import { chartColors } from 'in-themes/chartColors';
import { t } from 'in-i18n';

const metricId = 'latency';
interface TimeBasedLatencyIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SloEntityUnion;
  indicator: LatencyBlueprintIndicator;
  missingDataIndicator?: DateAsNumber;
  title?: string;
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function TimeBasedLatencyIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title,
  configuration
}: TimeBasedLatencyIndicatorChartProps) {
  const { threshold, aggregation } = indicator;
  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateSloGranularity(timeConfig);
  const result = useTimeBasedIndicatorMetrics({ configuration, granularity, timeWindows, aggregation, timeConfig });

  const metrics = result.data?.filter(r => r.id.startsWith('timeWindow')) ?? [];
  const metricValues = copyFirstBucketOfSubsequentDataSeries(metrics.map(metric => metric.values as MetricDataSeries));
  const thresholdMetrics: MetricDataSeries = metricValues.flat(1).map(([timestamp]) => [timestamp, threshold]);
  const metricLabel = getMetricLabel(entity);

  const filteredData = filterMetricValuesWithinTimeWindow(metricValues, timeConfig);

  const timeWindowStartIndex = getIndexOfFirstTimeWindowWithData(filteredData, timeWindows);

  const timeWindowsWithData = timeWindows.slice(timeWindowStartIndex);
  const windowColorsWithData = timeWindowColors.slice(timeWindowStartIndex);

  const { onLegendItemToggle, groups, overlappingSections } = useCorrectionWindowOverlay();

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
        granularity: result.data?.[0]?.granularity ?? granularity,
        reverseLegendOrder: true,
        onLegendItemToggle: (_, __, id) => onLegendItemToggle(id),
        y1: {
          icons: {
            colors: [
              ...groups.map((_, i) =>
                lighten(chartColors.strokeColors100[i % chartColors.strokeColors100.length], 0.25)
              ),
              '',
              themes.default.ids.color.option.red['500'],
              ...windowColorsWithData
            ],
            types: [
              ...groups.map(() => 'lib_actions_stop'),
              '',
              'lib_circle_fill',
              ...timeWindowsWithData.map(() => 'lib_circle_fill')
            ]
          },
          colors: [
            ...groups.map((_, i) => lighten(chartColors.strokeColors100[i % chartColors.strokeColors100.length], 0.25)),
            '',
            themes.default.ids.color.option.red['500'],
            ...windowColorsWithData
          ],
          formatter: millis.forcedCompactOnMs,
          labels: [
            ...groups.map(({ name }) => name),
            overlappingSectionsMetricId,
            t('in-service-levels:general.metrics.threshold'),
            ...timeWindowsWithData.map(() => metricLabel)
          ],
          excludedLabelsFromTooltip: [...groups.map(({ name }) => name), overlappingSectionsMetricId],
          excludedLabelsFromLegend: [overlappingSectionsMetricId],
          metrics: [
            ...groups.map(({ metrics }) => metrics),
            overlappingSections,
            thresholdMetrics,
            ...filteredData.slice(timeWindowStartIndex)
          ],
          metricIds: [
            ...groups.map(({ id }) => `correctionWindow-${id}`),
            overlappingSectionsMetricId,
            thresholdMetricId,
            ...timeWindowsWithData.map(() => metricId)
          ],
          renderer
        },
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}

function getMetricLabel(entity: SloEntityUnion): string {
  if (isApplicationSloEntity(entity)) return applicationMetrics.latency.label;

  if (isWebsiteSloEntity(entity)) return websiteMetrics.beaconDuration.label;

  if (isSyntheticSloEntity(entity)) return syntheticMetrics.responseTime.label;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
