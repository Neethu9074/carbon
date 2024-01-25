/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  CustomEventBasedSli,
  EventBasedSli,
  isApplicationSloEntity,
  isWebsiteSloEntity,
  Result,
  SloEntityUnion,
  TagFilterExpressionElementUnion,
  TimeConfig,
  UnifiedMetricConfiguration
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { IndicatorChartProps } from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import { calculateSloReferenceChartGranularity } from 'in-service-levels/components/SloDashboard/components/chart/utils';
import FilterInfo from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/FilterInfo';
import { createTagFilterExpression } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import Renderer, { extendTimeConfigForBarRenderer } from 'in-components/Chart/renderer/Renderer';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { applyAdjustedTimeframe } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';

const goodEventsMetricId = 'goodEvents';
const badEventsMetricId = 'badEvents';
export default function EventBasedIndicatorChart({
  entity,
  indicator
}: IndicatorChartProps<EventBasedSli | CustomEventBasedSli>) {
  const timeConfig = useTimeConfig();
  const [goodFilterExpression, badFilterExpression] = useTagFilterExpressions(entity, indicator);
  const granularity = calculateSloReferenceChartGranularity(timeConfig, true);
  const result: Result<UnifiedMetricsResult[]> =
    useObservable(
      () =>
        getUnifiedMetrics({
          metrics: {
            [goodEventsMetricId]: getMetricConfiguration(entity, goodFilterExpression, granularity, timeConfig),
            [badEventsMetricId]: getMetricConfiguration(entity, badFilterExpression, granularity, timeConfig)
          }
        }),
      [generateStableHash({ goodFilterExpression, badFilterExpression }), entity, granularity, timeConfig]
    ) ?? pendingResult;

  const goodEventsMetricResult = result.data?.find(res => res.id === goodEventsMetricId);
  const badEventsMetricResult = result.data?.find(res => res.id === badEventsMetricId);

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.indicatorChart.title'),
        rightHeaderContent: <FilterInfo entity={entity} indicator={indicator} />,
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
        timeConfig: extendTimeConfigForBarRenderer(
          applyAdjustedTimeframe(timeConfig, goodEventsMetricResult?.adjustedTimeframe),
          granularity
        ),
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}

function useTagFilterExpressions(
  entity: SloEntityUnion,
  indicator: EventBasedSli | CustomEventBasedSli
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
