/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion,
  TagFilterExpression,
  TimeConfig,
  UnifiedMetricConfiguration
} from '@instana/types';
import { t } from '@instana/i18n-react';
// eslint-disable-next-line no-restricted-imports -- We cant specifically allow parts of a otherwise restricted package
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import {
  copyFirstBucketOfSubsequentDataSeries,
  findMinMetricValue
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { calculateTrafficGranularity } from 'in-service-levels/utils/time';
import useTimeWindowAwareSloChartMetrics from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import lineRenderer from 'in-components/Chart/renderer/line';
import { number } from 'in-services/formatters/number';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';

interface TrafficChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function TrafficChart({ configuration }: TrafficChartProps) {
  const { entity } = configuration;

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
    const metrics = copyFirstBucketOfSubsequentDataSeries(metricResult?.metrics);


  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.trafficChart.title'),
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [zoomInAction.name],
        y1: {
          metrics,
          metricIds: timeWindows.map((_, index) => `timeWindows${index}`),
          min: findMinMetricValue(metrics.flat(1)),
          renderAllTickLabels: true,
          labels: timeWindows.map(() => label),
          colors: timeWindowColors,
          formatter: number.compact,
          renderer: lineRenderer
        },
        granularity,
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />,
        // FIXME: Chart height should be dynamic based on the dashboard layout and available screen size.
        // The current values are just measures taken from the default rendering of the chart to make the sizing work
        customHeight: 250,
        customChartSkeletonHeight: 308
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
): UnifiedMetricConfiguration {
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
