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
import { themes } from '@instana/design-tokens';

import { useLineWithThresholdAndMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThresholdAndMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  filterMetricValuesWithinTimeWindow
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import { thresholdMetricId } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import { calculateSloGranularity, getIndexOfFirstTimeWindowWithData } from 'in-service-levels/utils/time';
import { applicationMetrics, syntheticMetrics, websiteMetrics } from 'in-service-levels/metrics';
import useTimeBasedIndicatorMetrics from 'in-service-levels/hooks/useTimeBasedIndicatorMetrics';
import { defaultSliThresholdOperator, ServiceLevelErrors } from 'in-service-levels/constants';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { MetricDataSeries } from 'in-components/Chart/types';
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
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
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
  const renderer = useLineWithThresholdAndMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: missingDataIndicator,
    isGreaterOp
  });

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
        y1: {
          metricIds: [...timeWindowsWithData.map(() => metricId), thresholdMetricId],
          metrics: [...filteredData.slice(timeWindowStartIndex), thresholdMetrics],
          labels: [...timeWindowsWithData.map(() => metricLabel), t('in-service-levels:general.metrics.threshold')],
          colors: [...windowColorsWithData, themes.default.ids.color.option.red['500']],
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
