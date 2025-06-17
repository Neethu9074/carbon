/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  DateAsNumber,
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  LatencyBlueprintIndicator,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion
} from '@instana/types';

import { useLineWithThresholdAndMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThresholdAndMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  filterMetricValuesWithinTimeWindow
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes/SloDashboardMarkerLanes';
import { correctionWindowMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
import { thresholdMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { getCorrectionWindowMetrics } from 'in-service-levels/components/SloDashboard/components/chart/renderer/utils';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import { calculateSloGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import { applicationMetrics, syntheticMetrics, websiteMetrics } from 'in-service-levels/metrics';
import useTimeBasedIndicatorMetrics from 'in-service-levels/hooks/useTimeBasedIndicatorMetrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { carbonAlert, carbonCategorical } from 'in-themes/chartColors';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { hexToRGBA } from 'in-services/formatters/color';
import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metricId = 'latency';
interface TimeBasedLatencyIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SloEntityUnion;
  indicator: LatencyBlueprintIndicator;
  missingDataIndicator?: DateAsNumber;
  title?: string;
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function TimeBasedLatencyIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title,
  configuration
}: TimeBasedLatencyIndicatorChartProps) {
  const { threshold, aggregation } = indicator;
  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors, correctionData } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateSloGranularity(timeConfig);
  const result = useTimeBasedIndicatorMetrics({ configuration, granularity, timeWindows, aggregation, timeConfig });

  const metrics = result.data?.filter(r => r.id.startsWith('timeWindow')) ?? [];
  const metricValues = copyFirstBucketOfSubsequentDataSeries(metrics.map(metric => metric.values as MetricDataSeries));
  const thresholdMetrics: MetricDataSeries = metricValues.flat(1).map(([timestamp]) => [timestamp, threshold]);
  const metricLabel = getMetricLabel(entity);

  const filteredData = filterMetricValuesWithinTimeWindow(metricValues, timeConfig);

  const timeWindowStartIndex = getIndexOfFirstTimeWindowWithData(filteredData, timeWindows);

  const timeWindowsWithData = timeWindows.slice(timeWindowStartIndex);
  const windowColorsWithData = timeWindowColors.slice(timeWindowStartIndex);

  const correctionWindowMetrics = getCorrectionWindowMetrics(correctionData.data) ?? [];

  const renderer = useLineWithThresholdAndMissingDataIndicatorRenderer({
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
        renderHistoricDataIndicator: true,
        hasApproximateData: true,
        approximateTooltipText: t(
          'in-service-levels:sloDashboard.components.indicatorChart.components.approximateTooltip'
        ),
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [zoomInAction.name],
        granularity: result.data?.[0]?.granularity ?? granularity,
        reverseLegendOrder: true,
        y1: {
          icons: {
            colors: [
              ...(hasCorrectionWindows ? [hexToRGBA(carbonAlert.gray60, 0.6)] : []),
              carbonCategorical.red50,
              ...windowColorsWithData
            ],
            types: [
              ...(hasCorrectionWindows ? ['lib_actions_stop'] : []),
              'lib_legend_threshold',
              ...timeWindowsWithData.map(() => 'lib_legend_line_chart')
            ]
          },
          colors: [
            ...(hasCorrectionWindows ? [hexToRGBA(carbonAlert.gray60, 0.6)] : []),
            carbonCategorical.red50,
            ...windowColorsWithData
          ],
          formatter: millis.forcedCompactOnMs,
          labels: [
            ...(hasCorrectionWindows ? [t('in-service-levels:general.metrics.correctionWindows')] : []),
            t('in-service-levels:general.metrics.threshold'),
            ...timeWindowsWithData.map(() => metricLabel)
          ],
          excludedLabelsFromTooltip: [t('in-service-levels:general.metrics.correctionWindows')],
          metrics: [
            ...(hasCorrectionWindows ? [correctionWindowMetrics] : []),
            thresholdMetrics,
            ...filteredData.slice(timeWindowStartIndex)
          ],
          metricIds: [
            ...(hasCorrectionWindows ? [correctionWindowMetricId] : []),
            thresholdMetricId,
            ...timeWindowsWithData.map(() => metricId)
          ],
          renderer
        },
        timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}

function getMetricLabel(entity: SloEntityUnion): string {
  if (isApplicationSloEntity(entity)) return applicationMetrics.latency.label;

  if (isWebsiteSloEntity(entity)) return websiteMetrics.beaconDuration.label;

  if (isSyntheticSloEntity(entity)) return syntheticMetrics.responseTime.label;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
