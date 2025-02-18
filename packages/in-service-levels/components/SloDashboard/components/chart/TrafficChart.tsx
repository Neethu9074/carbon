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
  SloEntityUnion,
  TagFilterExpression,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';

// eslint-disable-next-line no-restricted-imports -- We cant specifically allow parts of a otherwise restricted package
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
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useTimeWindowAwareSloChartMetrics from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import { applicationMetrics, syntheticMetrics, websiteMetrics } from 'in-service-levels/metrics';
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

  const sloZoomInAction = useSloZoomInAction();
  const tagFilterExpression = useBasicTagFilterExpression({ entity });
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity =
    indicator.type === 'timeBased'
      ? calculateTrafficGranularity(timeConfig)
      : calculateEventGraphGranularity(timeConfig);
  const [metricResult, , errors, progress] = useTimeWindowAwareSloChartMetrics(
    configuration,
    timeConfig => getMetricConfig({ entity, indicator, granularity, tagFilterExpression, timeConfig }),
    timeConfig,
    timeWindows,
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

interface GetMetricConfigProps {
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
  granularity: number;
  tagFilterExpression: TagFilterExpression;
  timeConfig: TimeConfig;
}

function getMetricConfig({
  entity,
  indicator,
  granularity,
  tagFilterExpression,
  timeConfig
}: GetMetricConfigProps): UnifiedMetricConfigurationUnion {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.calls.timeSeries({ entity, tagFilterExpression, timeConfig, granularity });
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconCount.timeSeries({ entity, tagFilterExpression, timeConfig, granularity });
  }

  if (isSyntheticSloEntity(entity)) {
    const shouldUseErroneousMetrics = isTrafficBlueprintIndicator(indicator) && indicator.trafficType === 'erroneous';
    const metric = shouldUseErroneousMetrics ? 'erroneousTests' : 'allTests';

    return syntheticMetrics[metric].timeSeries({ entity, tagFilterExpression, timeConfig, granularity });
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
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
