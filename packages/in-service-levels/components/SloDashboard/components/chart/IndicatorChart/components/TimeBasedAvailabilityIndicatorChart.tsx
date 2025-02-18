/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  AvailabilityBlueprintIndicator,
  DateAsNumber,
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
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
import { invertSyntheticPercentageMetrics } from 'in-service-levels/components/SloDashboard/components/chart/utils';
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
import { percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

const metricId = 'availability';

interface TimeBasedAvailabilityIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SloEntityUnion;
  indicator: AvailabilityBlueprintIndicator;
  missingDataIndicator?: DateAsNumber;
  title?: string;
}
export default function TimeBasedAvailabilityIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title
}: TimeBasedAvailabilityIndicatorChartProps) {
  const { threshold } = indicator;

  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const hasMatchingTimeWindows = timeWindows.length > 0;
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateTrafficGranularity(timeConfig);
  const metricConfiguration = useSliMetricConfiguration<AvailabilityBlueprintIndicator>(
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
  const normalizedData = isSyntheticSloEntity(entity) ? invertSyntheticPercentageMetrics(filteredData) : filteredData;

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
          colors: [...windowColorsWithData, themes.default.ids.color.option.red['500']],
          formatter: percentage.detailed,
          labels: [...timeWindowsWithData.map(() => metricLabel), t('in-service-levels:general.metrics.threshold')],
          metrics: [...normalizedData, thresholdMetrics],
          metricIds: [...timeWindowsWithData.map(() => metricId), thresholdMetricId],
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
  indicator: AvailabilityBlueprintIndicator,
  tagFilterExpression: TagFilterExpression,
  granularity: number
): UnifiedMetricConfigurationUnion {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.errorRate.timeSeries({
      entity,
      tagFilterExpression,
      granularity,
      timeConfig,
      aggregation: indicator.aggregation
    });
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconErrorRate.timeSeries({
      entity,
      tagFilterExpression,
      granularity,
      timeConfig,
      aggregation: indicator.aggregation
    });
  }

  if (isSyntheticSloEntity(entity)) {
    return syntheticMetrics.failureRate.timeSeries({
      entity,
      tagFilterExpression,
      granularity,
      timeConfig,
      aggregation: indicator.aggregation
    });
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

function getMetricLabel(entity: SloEntityUnion): string {
  if (isApplicationSloEntity(entity)) return applicationMetrics.errorRate.label;

  if (isWebsiteSloEntity(entity)) return websiteMetrics.beaconErrorRate.label;

  if (isSyntheticSloEntity(entity)) return syntheticMetrics.failureRate.label;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
