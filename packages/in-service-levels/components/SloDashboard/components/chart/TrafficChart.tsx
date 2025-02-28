/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  ServiceLevelIndicatorUnion,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion
} from '@instana/types';

// eslint-disable-next-line no-restricted-imports -- We cant specifically allow parts of a otherwise restricted package
import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  findMinMaxMetricValues
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { applicationMetrics, sloMetrics, syntheticMetrics, websiteMetrics } from 'in-service-levels/metrics';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import { calculateSloGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import useTimeWindowAwareSloChartMetrics from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { isTrafficBlueprintIndicator } from 'in-service-levels/types';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface TrafficChartProps {
  automaticallySize?: boolean;
  configuration: ServiceLevelObjectiveConfiguration;
  customChartSkeletonHeight?: number;
  customHeight?: number;
}

export default function TrafficChart({
  automaticallySize,
  configuration,
  customHeight,
  customChartSkeletonHeight
}: TrafficChartProps) {
  const { entity, createdDate, indicator } = configuration;
  const configId = configuration.id!;
  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors, selectedTimeWindowType } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateSloGranularity(timeConfig);
  const [metricResult, , errors, progress] = useTimeWindowAwareSloChartMetrics(
    configuration,
    timeConfig => sloMetrics.traffic.timeSeries({ configId, timeConfig, granularity }),
    timeConfig,
    selectedTimeWindowType === 'SELECTED_TIME' ? [timeConfig] : timeWindows,
    granularity
  );

  const label = getMetricLabels({ entity, indicator });
  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: createdDate
  });

  const metrics = copyFirstBucketOfSubsequentDataSeries(metricResult?.metrics);
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
        excludedContextMenuActions: [zoomInAction.name],
        y1: {
          metrics,
          metricIds: timeWindowsWithData.map((_, index) => `timeWindows${index}`),
          min: Math.max(0, min),
          max,
          renderAllTickLabels: true,
          labels: timeWindowsWithData.map(() => label),
          colors: windowColorsWithData,
          formatter: number.compact,
          renderer
        },
        granularity,
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={{ progress, errors }}
    />
  );
}

interface GetMetricLabel {
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
}

function getMetricLabels({ entity, indicator }: GetMetricLabel): string {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.calls.label;
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconCount.label;
  }

  if (isSyntheticSloEntity(entity)) {
    const shouldUseErroneousMetrics = isTrafficBlueprintIndicator(indicator) && indicator.trafficType === 'erroneous';
    const metric = shouldUseErroneousMetrics ? 'erroneousTests' : 'allTests';

    return syntheticMetrics[metric].label;
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
