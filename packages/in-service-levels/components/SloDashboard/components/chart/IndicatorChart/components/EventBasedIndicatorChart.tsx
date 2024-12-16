/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  DateAsNumber,
  isApplicationSloEntity,
  isWebsiteSloEntity,
  Result,
  ServiceLevelIndicatorUnion,
  SloEntityUnion,
  TagFilterExpressionElementUnion,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { useBarWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/barWithMissingDataIndicator';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import FilterInfo from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/FilterInfo';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import { createTagFilterExpression } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { calculateEventGraphGranularity } from 'in-service-levels/utils/time';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';

const goodEventsMetricId = 'goodEvents';
const badEventsMetricId = 'badEvents';
interface EventBasedIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
  missingDataIndicator?: DateAsNumber;
  title?: string;
}
export default function EventBasedIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title
}: EventBasedIndicatorChartProps) {
  const sloZoomInAction = useSloZoomInAction();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateEventGraphGranularity(timeConfig);
  const result = useEventBasedIndicatorMetrics({ entity, indicator, granularity, timeConfig });

  const goodEventsMetricResult = result.data?.find(res => res.id === goodEventsMetricId);
  const badEventsMetricResult = result.data?.find(res => res.id === badEventsMetricId);
  const renderer = useBarWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator
  });
  return (
    <ResultAwareChart
      config={{
        automaticallySize,
        customHeight,
        customChartSkeletonHeight,
        title,
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
          renderer
        },
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}

interface UseEventBasedIndicatorMetricsProps extends EventBasedIndicatorChartProps {
  granularity: number;
  timeConfig: TimeConfig;
}
function useEventBasedIndicatorMetrics({
  entity,
  indicator,
  timeConfig,
  granularity
}: UseEventBasedIndicatorMetricsProps): Result<UnifiedMetricsResult[]> {
  const [goodFilterExpression, badFilterExpression] = useTagFilterExpressions(entity, indicator);
  const { timeWindows } = useSloTimeWindowContext();
  const hasMatchingTimeWindows = timeWindows.length > 0;

  return (
    useObservable(() => {
      if (!hasMatchingTimeWindows) return successObservable([]);

      return getUnifiedMetrics({
        metrics: {
          [goodEventsMetricId]: getMetricConfiguration(entity, goodFilterExpression, granularity, timeConfig),
          [badEventsMetricId]: getMetricConfiguration(entity, badFilterExpression, granularity, timeConfig)
        }
      });
    }, [
      generateStableHash({ goodFilterExpression, badFilterExpression, timeConfig }),
      entity,
      granularity,
      hasMatchingTimeWindows
    ]) ?? pendingResult
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
): UnifiedMetricConfigurationUnion {
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
