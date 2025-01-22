/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { isSyntheticSloEntity, ServiceLevelObjectiveConfiguration } from '@instana/types';

import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  findMinMaxMetricValues
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import {
  calculateEventGraphGranularity,
  calculateTrafficGranularity,
  getIndexOfFirstTimeWindowWithData
} from 'in-service-levels/utils/time';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useSyntheticsTrafficMetrics from 'in-service-levels/hooks/useSyntheticsTrafficMetrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { finishedProgress } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface SyntheticsSloTrafficChartProps {
  automaticallySize?: boolean;
  configuration: ServiceLevelObjectiveConfiguration;
  customChartSkeletonHeight?: number;
  customHeight?: number;
}

export default function SyntheticsSloTrafficChart({
  automaticallySize,
  configuration,
  customChartSkeletonHeight,
  customHeight
}: SyntheticsSloTrafficChartProps) {
  const { entity, indicator, timeWindow, createdDate } = configuration;

  if (!isSyntheticSloEntity(entity)) throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);

  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity =
    indicator.type === 'timeBased'
      ? calculateTrafficGranularity(timeConfig)
      : calculateEventGraphGranularity(timeConfig);
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const { data, progress, errors } = useSyntheticsTrafficMetrics(entity, indicator, timeWindows, granularity);

  const missingDataIndicator = timeWindow.type === 'fixed' ? timeWindow.startTimestamp : createdDate;

  const sloZoomInAction = useSloZoomInAction();
  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator
  });

  const metrics = copyFirstBucketOfSubsequentDataSeries(data);
  const { min, max } = findMinMaxMetricValues(metrics.flat(1), { withBuffer: true });
  const timeWindowStartIndex = getIndexOfFirstTimeWindowWithData(metrics, timeWindows);
  const timeWindowsWithData = timeWindows.slice(timeWindowStartIndex);
  const windowColorsWithData = timeWindowColors.slice(timeWindowStartIndex);

  return (
    <ResultAwareChart
      config={{
        automaticallySize,
        customHeight,
        customChartSkeletonHeight,
        title: t('in-service-levels:sloDashboard.components.trafficChart.title'),
        renderHistoricDataIndicator: true,
        hasApproximateData: true,
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [sloZoomInAction.name],
        y1: {
          metrics,
          metricIds: timeWindowsWithData.map((_, index) => `timeWindows${index}`),
          min: Math.max(0, min),
          max,
          renderAllTickLabels: true,
          labels: timeWindowsWithData.map(() => t('in-service-levels:general.metrics.results')),
          colors: windowColorsWithData,
          formatter: number.compact,
          renderer
        },
        granularity,
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={{ progress: progress ?? finishedProgress, errors: errors ?? [] }}
    />
  );
}
