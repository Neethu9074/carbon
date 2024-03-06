/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isWebsiteSloEntity,
  Result,
  ServiceLevelIndicatorUnion,
  SloEntityUnion,
  TagFilterExpressionElementUnion,
  TimeConfig,
  UnifiedMetricConfiguration
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { IndicatorChartProps } from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import FilterInfo from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/FilterInfo';
import { calculateEventGraphGranularity } from 'in-service-levels/utils/time';
import { createTagFilterExpression } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { MetricDataSeries } from 'in-components/Chart/types';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';

const goodEventsMetricId = 'goodEvents';
const badEventsMetricId = 'badEvents';
export default function EventBasedIndicatorChart({
  entity,
  indicator
}: IndicatorChartProps<ServiceLevelIndicatorUnion>) {
  const sloZoomInAction = useSloZoomInAction();
  const [goodFilterExpression, badFilterExpression] = useTagFilterExpressions(entity, indicator);
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateEventGraphGranularity(timeConfig);
  const result: Result<UnifiedMetricsResult[]> =
    useObservable(
      () =>
        getUnifiedMetrics({
          metrics: {
            [goodEventsMetricId]: getMetricConfiguration(entity, goodFilterExpression, granularity, timeConfig),
            [badEventsMetricId]: getMetricConfiguration(entity, badFilterExpression, granularity, timeConfig)
          }
        }),
      [generateStableHash({ goodFilterExpression, badFilterExpression, timeConfig }), entity, granularity]
    ) ?? pendingResult;

  const goodEventsMetricResult = result.data?.find(res => res.id === goodEventsMetricId);
  const badEventsMetricResult = result.data?.find(res => res.id === badEventsMetricId);

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.indicatorChart.title'),
        rightHeaderContent: <FilterInfo entity={entity} indicator={indicator} />,
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [zoomInAction.name],
        granularity: goodEventsMetricResult?.granularity ?? granularity,
        y1: {
          metricIds: [badEventsMetricId, goodEventsMetricId],
          metrics: [
            (badEventsMetricResult?.values ?? []) as MetricDataSeries,
            (goodEventsMetricResult?.values ?? []) as MetricDataSeries
          ],
          labels: [t('in-service-levels:general.metrics.badEvents'), t('in-service-levels:general.metrics.goodEvents')],
          colors: [themes.default.ids.color.option.red['500'], themes.default.ids.color.option.green['500']],
          formatter: number.compact,
          renderer: Renderer.bar
        },
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}

function useTagFilterExpressions(
  entity: SloEntityUnion,
  indicator: ServiceLevelIndicatorUnion
): [TagFilterExpressionElementUnion, TagFilterExpressionElementUnion] {
  const baseTagFilterExpression = useBasicTagFilterExpression({ entity });
  const { good, bad } = createGoodBadTagFilterExpression({ entity, indicator });

  return [
    createTagFilterExpression('AND', [baseTagFilterExpression, good]),
    createTagFilterExpression('AND', [baseTagFilterExpression, bad])
  ];
}

function getMetricConfiguration(
  entity: SloEntityUnion,
  tagFilterExpression: TagFilterExpressionElementUnion,
  granularity: number,
  timeConfig: TimeConfig
): UnifiedMetricConfiguration {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.calls.timeSeries({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation: 'SUM'
    });
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconCount.timeSeries({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation: 'SUM'
    });
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
