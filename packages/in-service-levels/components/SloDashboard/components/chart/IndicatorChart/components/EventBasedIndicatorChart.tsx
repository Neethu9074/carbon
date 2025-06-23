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
import { correctionWindowMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import FilterInfo from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/components/FilterInfo';
import { getCorrectionWindowMetrics } from 'in-service-levels/components/SloDashboard/components/chart/renderer/utils';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { hexToRGBA } from 'in-services/formatters/color';
import { sloMetrics } from 'in-service-levels/metrics';
import { number } from 'in-services/formatters/number';
import { carbonAlert } from 'in-themes/chartColors';
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
  const { correctionData } = useSloTimeWindowContext();

  const granularity = calculateSloGranularity(timeConfig);
  const result = useEventBasedIndicatorMetrics({ configuration, granularity, timeConfig });

  const goodEventsMetricResult = result.data?.find(res => res.id === goodEventsMetricId);
  const badEventsMetricResult = result.data?.find(res => res.id === badEventsMetricId);

  const correctionWindowMetrics = getCorrectionWindowMetrics(correctionData.data) ?? [];

  const renderer = useBarWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator
  });

  const hasCorrectionWindows = correctionWindowMetrics.length > 0;
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
        y1: {
          manualRenderLoop: true,
          metricIds: [
            ...(hasCorrectionWindows ? [correctionWindowMetricId] : []),
            badEventsMetricId,
            goodEventsMetricId
          ],
          metrics: [
            ...(hasCorrectionWindows ? [correctionWindowMetrics] : []),
            (badEventsMetricResult?.values ?? []) as MetricDataSeries,
            (goodEventsMetricResult?.values ?? []) as MetricDataSeries
          ],
          labels: [
            ...(hasCorrectionWindows ? [t('in-service-levels:general.metrics.correctionWindows')] : []),
            t('in-service-levels:general.metrics.badEvents'),
            t('in-service-levels:general.metrics.goodEvents')
          ],
          excludedLabelsFromTooltip: [t('in-service-levels:general.metrics.correctionWindows')],
          icons: {
            colors: [
              ...(hasCorrectionWindows ? [hexToRGBA(carbonAlert.gray60, 0.6)] : []),
              themes.default.ids.color.option.red['500'],
              themes.default.ids.color.option.green['500']
            ],
            types: [...(hasCorrectionWindows ? ['lib_actions_stop'] : []), 'lib_circle_fill', 'lib_circle_fill']
          },
          colors: [
            ...(hasCorrectionWindows ? [hexToRGBA(carbonAlert.gray60, 0.6)] : []),
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
