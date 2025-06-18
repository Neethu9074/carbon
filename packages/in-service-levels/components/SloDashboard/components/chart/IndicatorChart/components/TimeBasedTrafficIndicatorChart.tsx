/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  DateAsNumber,
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion,
  TrafficBlueprintIndicator
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
import { defaultSliThresholdOperator, ServiceLevelErrors } from 'in-service-levels/constants';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import { carbonAlert, carbonCategorical } from 'in-themes/chartColors';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
import { hexToRGBA } from 'in-services/formatters/color';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metricId = 'traffic';

interface TimeBasedTrafficIndicatorChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  entity: SloEntityUnion;
  indicator: TrafficBlueprintIndicator;
  missingDataIndicator?: DateAsNumber;
  title?: string;
  configuration: ServiceLevelObjectiveConfiguration;
}
export default function TimeBasedTrafficIndicatorChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  entity,
  indicator,
  missingDataIndicator,
  title,
  configuration
}: TimeBasedTrafficIndicatorChartProps) {
  const { threshold } = indicator;

  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors, correctionData } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateSloGranularity(timeConfig);
  const result = useTimeBasedIndicatorMetrics({ configuration, granularity, timeWindows, timeConfig });

  const metrics = result.data?.filter(r => r.id.startsWith('timeWindow')) ?? [];
  const metricValues = copyFirstBucketOfSubsequentDataSeries(metrics.map(metric => metric.values as MetricDataSeries));
  const thresholdMetrics: MetricDataSeries = metricValues.flat(1).map(([timestamp]) => [timestamp, threshold]);
  const metricLabel = getMetricLabel({ entity, indicator });

  const filteredData = filterMetricValuesWithinTimeWindow(metricValues, timeConfig);

  const timeWindowStartIndex = getIndexOfFirstTimeWindowWithData(filteredData, timeWindows);
  const timeWindowsWithData = timeWindows.slice(timeWindowStartIndex);
  const windowColorsWithData = timeWindowColors.slice(timeWindowStartIndex);

  const operator = indicator.operator ?? defaultSliThresholdOperator;
  const isGreaterOp = operator === '>' || operator === '>=';

  const correctionWindowMetrics = getCorrectionWindowMetrics(correctionData.data) ?? [];

  const renderer = useLineWithThresholdAndMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator,
    isGreaterOp
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

interface GetMetricLabelProps {
  entity: SloEntityUnion;
  indicator: TrafficBlueprintIndicator;
}

function getMetricLabel({ entity, indicator }: GetMetricLabelProps) {
  if (isApplicationSloEntity(entity)) {
    const metric = indicator.trafficType === 'all' ? 'calls' : 'erroneousCalls';

    return applicationMetrics[metric].label;
  }

  if (isWebsiteSloEntity(entity)) {
    const metric = indicator.trafficType === 'all' ? 'beaconCount' : 'beaconErrorCount';

    return websiteMetrics[metric].label;
  }

  if (isSyntheticSloEntity(entity)) {
    const metric = indicator.trafficType === 'all' ? 'allTests' : 'erroneousTests';

    return syntheticMetrics[metric].label;
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
