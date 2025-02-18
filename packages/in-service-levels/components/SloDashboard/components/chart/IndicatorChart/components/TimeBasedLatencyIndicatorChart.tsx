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
  Result,
  SloEntityUnion,
  TagFilterExpression,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { useLineWithThresholdAndMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThresholdAndMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  filterMetricValuesWithinTimeWindow
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import { thresholdMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import { calculateTrafficGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import { applicationMetrics, syntheticMetrics, websiteMetrics } from 'in-service-levels/metrics';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import useSliMetricConfiguration from 'in-service-levels/hooks/useSliMetricConfiguration';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
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
}

export default function TimeBasedLatencyIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title
}: TimeBasedLatencyIndicatorChartProps) {
  const { threshold } = indicator;
  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const hasMatchingTimeWindows = timeWindows.length > 0;
  const granularity = calculateTrafficGranularity(timeConfig);
  const metricConfiguration = useSliMetricConfiguration<LatencyBlueprintIndicator>(
    entity,
    indicator,
    granularity,
    timeWindows,
    getMetricConfig
  );
  const result: Result<UnifiedMetricsResult[]> =
    useObservable(() => {
      if (!hasMatchingTimeWindows) return successObservable([]);
      return getUnifiedMetrics({ metrics: metricConfiguration });
    }, [generateStableHash(metricConfiguration), hasMatchingTimeWindows]) ?? pendingResult;

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
          metrics: [...filteredData, thresholdMetrics],
          labels: [...timeWindowsWithData.map(() => metricLabel), t('in-service-levels:general.metrics.threshold')],
          colors: [...windowColorsWithData, themes.default.ids.color.option.red['500']],
          formatter: millis.compact,
          renderer
        },
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}

function getMetricConfig(
  entity: SloEntityUnion,
  timeConfig: TimeConfig,
  indicator: LatencyBlueprintIndicator,
  tagFilterExpression: TagFilterExpression,
  granularity: number
): UnifiedMetricConfigurationUnion {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.latency.timeSeries({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation: indicator.aggregation
    });
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconDuration.timeSeries({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation: indicator.aggregation
    });
  }

  if (isSyntheticSloEntity(entity)) {
    return syntheticMetrics.responseTime.timeSeries({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation: indicator.aggregation
    });
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

function getMetricLabel(entity: SloEntityUnion): string {
  if (isApplicationSloEntity(entity)) return applicationMetrics.latency.label;

  if (isWebsiteSloEntity(entity)) return websiteMetrics.beaconDuration.label;

  if (isSyntheticSloEntity(entity)) return syntheticMetrics.responseTime.label;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
