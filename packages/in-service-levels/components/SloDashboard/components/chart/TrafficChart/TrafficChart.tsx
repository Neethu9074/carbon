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
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion,
  TagFilterExpression,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { t } from '@instana/i18n-react';

// eslint-disable-next-line no-restricted-imports -- We cant specifically allow parts of a otherwise restricted package
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import SyntheticsSloTrafficChart from 'in-service-levels/components/SloDashboard/components/chart/TrafficChart/components/SyntheticsSloTrafficChart';
import {
  copyFirstBucketOfSubsequentDataSeries,
  findMinMaxMetricValues
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useTimeWindowAwareSloChartMetrics from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { calculateTrafficGranularity } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { number } from 'in-services/formatters/number';

interface TrafficChartProps {
  automaticallySize?: boolean;
  configuration: ServiceLevelObjectiveConfiguration;
  customChartSkeletonHeight?: number;
  customHeight?: number;
}

export default function TrafficChart({
  automaticallySize,
  configuration,
  customChartSkeletonHeight,
  customHeight
}: TrafficChartProps) {
  if (isSyntheticSloEntity(configuration.entity))
    return (
      <SyntheticsSloTrafficChart
        automaticallySize={automaticallySize}
        configuration={configuration}
        customChartSkeletonHeight={customChartSkeletonHeight}
        customHeight={customHeight}
      />
    );

  return (
    <AppWebsiteTrafficChart
      automaticallySize={automaticallySize}
      configuration={configuration}
      customChartSkeletonHeight={customChartSkeletonHeight}
      customHeight={customHeight}
    />
  );
}

function AppWebsiteTrafficChart({
  automaticallySize,
  configuration,
  customHeight,
  customChartSkeletonHeight
}: TrafficChartProps) {
  const { entity, createdDate, timeWindow } = configuration;

  const missingDataIndicator = timeWindow.type === 'fixed' ? timeWindow.startTimestamp : createdDate;

  const sloZoomInAction = useSloZoomInAction();
  const tagFilterExpression = useBasicTagFilterExpression({ entity });
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateTrafficGranularity(timeConfig);
  const [metricResult, , errors, progress] = useTimeWindowAwareSloChartMetrics(
    configuration,
    timeConfig => getMetricConfig(entity, timeConfig, tagFilterExpression, granularity),
    timeConfig,
    timeWindows,
    granularity
  );

  const label = getMetricLabels(entity);
  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator
  });
  const metrics = copyFirstBucketOfSubsequentDataSeries(metricResult?.metrics);
  const { min } = findMinMaxMetricValues(metrics.flat(1));

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
          metricIds: timeWindows.map((_, index) => `timeWindows${index}`),
          min,
          renderAllTickLabels: true,
          labels: timeWindows.map(() => label),
          colors: timeWindowColors,
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

function getMetricConfig(
  entity: SloEntityUnion,
  timeConfig: TimeConfig,
  tagFilterExpression: TagFilterExpression,
  granularity: number
): UnifiedMetricConfigurationUnion {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.calls.timeSeries({ entity, tagFilterExpression, timeConfig, granularity });
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconCount.timeSeries({ entity, tagFilterExpression, timeConfig, granularity });
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

function getMetricLabels(entity: SloEntityUnion): string {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.calls.label;
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconCount.label;
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
