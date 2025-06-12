/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  DateAsNumber,
  Result,
  ServiceLevelIndicatorUnion,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion,
  TimeConfig
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { useBarWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/barWithMissingDataIndicator';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/SloDashboardMarkerLanes';
import { overlappingSectionsMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import FilterInfo from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/FilterInfo';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import useCorrectionWindowOverlay from 'in-service-levels/hooks/useCorrectionWindowOverlay';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { sloMetrics } from 'in-service-levels/metrics';
import { number } from 'in-services/formatters/number';
import { lighten } from 'in-services/formatters/color';
import { chartColors } from 'in-themes/chartColors';
import { t } from 'in-i18n';

const timeWindow = 'timeWindow';
const goodEventsMetricId = `${timeWindow}-good`;
const badEventsMetricId = `${timeWindow}-bad`;
interface EventBasedIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
  missingDataIndicator?: DateAsNumber;
  title?: string;
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function EventBasedIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title,
  configuration
}: EventBasedIndicatorChartProps) {
  const sloZoomInAction = useSloZoomInAction();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateSloGranularity(timeConfig);
  const result = useEventBasedIndicatorMetrics({ configuration, granularity, timeConfig });

  const goodEventsMetricResult = result.data?.find(res => res.id === goodEventsMetricId);
  const badEventsMetricResult = result.data?.find(res => res.id === badEventsMetricId);

  const { onLegendItemToggle, groups, overlappingSections } = useCorrectionWindowOverlay();

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
        reverseLegendOrder: true,
        onLegendItemToggle: (_, __, id) => onLegendItemToggle(id),
        y1: {
          manualRenderLoop: true,
          metricIds: [
            ...groups.map(({ id }) => `correctionWindow-${id}`),
            overlappingSectionsMetricId,
            badEventsMetricId,
            goodEventsMetricId
          ],
          metrics: [
            ...groups.map(({ metrics }) => metrics),
            overlappingSections,
            (badEventsMetricResult?.values ?? []) as MetricDataSeries,
            (goodEventsMetricResult?.values ?? []) as MetricDataSeries
          ],
          labels: [
            ...groups.map(({ name }) => name),
            overlappingSectionsMetricId,
            t('in-service-levels:general.metrics.badEvents'),
            t('in-service-levels:general.metrics.goodEvents')
          ],
          excludedLabelsFromTooltip: [...groups.map(({ name }) => name), overlappingSectionsMetricId],
          excludedLabelsFromLegend: [overlappingSectionsMetricId],
          icons: {
            colors: [
              ...groups.map((_, i) =>
                lighten(chartColors.strokeColors100[i % chartColors.strokeColors100.length], 0.25)
              ),
              '',
              themes.default.ids.color.option.red['500'],
              themes.default.ids.color.option.green['500']
            ],
            types: [...groups.map(() => 'lib_actions_stop'), '', 'lib_circle_fill', 'lib_circle_fill']
          },
          colors: [
            ...groups.map((_, i) => lighten(chartColors.strokeColors100[i % chartColors.strokeColors100.length], 0.25)),
            '',
            themes.default.ids.color.option.red['500'],
            themes.default.ids.color.option.green['500']
          ],
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

interface UseEventBasedIndicatorMetricsParams {
  granularity: number;
  timeConfig: TimeConfig;
  configuration: ServiceLevelObjectiveConfiguration;
}

function useEventBasedIndicatorMetrics({
  configuration,
  timeConfig,
  granularity
}: UseEventBasedIndicatorMetricsParams): Result<UnifiedMetricsResult[]> {
  const { timeWindows } = useSloTimeWindowContext();
  const hasMatchingTimeWindows = timeWindows.length > 0;
  const configId = configuration.id!;
  return (
    useObservable(() => {
      if (!hasMatchingTimeWindows) return successObservable([]);

      return getUnifiedMetrics({
        metrics: {
          [timeWindow]: sloMetrics.indicator.timeSeries({
            configId,
            timeConfig,
            granularity
          })
        }
      });
    }, [configId, granularity, hasMatchingTimeWindows, generateStableHash(timeConfig)]) ?? pendingResult
  );
}
