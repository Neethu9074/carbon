/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isWebsiteSloEntity,
  LatencyBlueprintIndicator,
  Result,
  SloEntityUnion,
  TagFilterExpression,
  TimeConfig,
  UnifiedMetricConfiguration
} from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import {
  lineWithThreshold,
  thresholdMetricId
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
import { IndicatorChartProps } from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import useSliMetricConfiguration from 'in-service-levels/hooks/useSliMetricConfiguration';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { pendingResult } from 'in-services/fixedObjects';
import { millis } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { copyFirstBucketOfSubsequentDataSeries } from 'in-service-levels/components/SloDashboard/components/chart/utils';

const metricId = 'latency';

export default function TimeBasedLatencyIndicatorChart({
  entity,
  indicator
}: IndicatorChartProps<LatencyBlueprintIndicator>) {
  const { threshold } = indicator;

  const selectedTimeConfig = useTimeConfig();
  const { timeWindows, timeWindowColors, selectedTimeWindowType } = useSloTimeWindowContext();
  const granularity = calculateSloGranularity(selectedTimeConfig);
  const metricConfiguration = useSliMetricConfiguration<LatencyBlueprintIndicator>(
    entity,
    indicator,
    granularity,
    timeWindows,
    getMetricConfig
  );
  const result: Result<UnifiedMetricsResult[]> =
    useObservable(
      () => getUnifiedMetrics({ metrics: metricConfiguration }),
      [generateStableHash(metricConfiguration)]
    ) ?? pendingResult;

  const metrics = result.data?.filter(r => r.id.startsWith('timeWindow')) ?? [];
  const metricValues = copyFirstBucketOfSubsequentDataSeries(metrics.map(metric => metric.values as MetricDataSeries));
  const thresholdMetrics: MetricDataSeries = metricValues.flat(1).map(([timestamp]) => [timestamp, threshold]);
  const metricLabel = isApplicationSloEntity(entity)
    ? applicationMetrics.latency.label
    : websiteMetrics.beaconDuration.label;

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.indicatorChart.title'),
        granularity: result.data?.[0]?.granularity ?? granularity,
        y1: {
          metricIds: [...timeWindows.map(() => metricId), thresholdMetricId],
          metrics: [...metricValues, thresholdMetrics],
          labels: [...timeWindows.map(() => metricLabel), t('in-service-levels:general.metrics.threshold')],
          colors: [...timeWindowColors, themes.default.ids.color.option.red['500']],
          formatter: millis.compact,
          renderer: lineWithThreshold
        },
        timeConfig:
          selectedTimeWindowType === 'SLO_TIME_WINDOW' ? timeWindows[0] ?? selectedTimeConfig : selectedTimeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}

function getMetricConfig(
  entity: SloEntityUnion,
  timeConfig: TimeConfig,
  indicator: LatencyBlueprintIndicator,
  tagFilterExpression: TagFilterExpression,
  granularity: number
): UnifiedMetricConfiguration {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.latency.timeSeries({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation: indicator.aggregation
    });
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconDuration.timeSeries({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation: indicator.aggregation
    });
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
