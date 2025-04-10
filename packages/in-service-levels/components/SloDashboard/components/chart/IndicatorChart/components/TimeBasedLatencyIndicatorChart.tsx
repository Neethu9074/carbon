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
import { thresholdMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import { calculateSloGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import { applicationMetrics, syntheticMetrics, websiteMetrics } from 'in-service-levels/metrics';
import useTimeBasedIndicatorMetrics from 'in-service-levels/hooks/useTimeBasedIndicatorMetrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { millis } from 'in-services/formatters/number';
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
        y1: {
          metricIds: [...timeWindowsWithData.map(() => metricId), thresholdMetricId],
          metrics: [...filteredData.slice(timeWindowStartIndex), thresholdMetrics],
          labels: [...timeWindowsWithData.map(() => metricLabel), t('in-service-levels:general.metrics.threshold')],
          colors: [...windowColorsWithData, themes.default.ids.color.option.red['500']],
          formatter: millis.forcedCompactOnMs,
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
