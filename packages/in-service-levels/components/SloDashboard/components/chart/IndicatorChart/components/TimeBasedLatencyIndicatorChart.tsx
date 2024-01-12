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
  SloEntityUnion,
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
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import { applyAdjustedTimeframe, calculateSloGranularity } from 'in-service-levels/utils/time';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { TimeBasedLatencyBlueprintIndicator } from 'in-service-levels/types';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { pendingResult } from 'in-services/fixedObjects';
import { millis } from 'in-services/formatters/number';

const metricId = 'latency';

export default function TimeBasedLatencyIndicatorChart({
  entity,
  indicator,
  timeConfig
}: IndicatorChartProps<TimeBasedLatencyBlueprintIndicator>) {
  const { threshold } = indicator;

  const granularity = calculateSloGranularity(timeConfig);
  const metricConfiguration = useMetricConfiguration(entity, indicator, granularity, timeConfig);
  const result: Result<UnifiedMetricsResult[]> =
    useObservable(
      () => getUnifiedMetrics({ metrics: { [metricId]: metricConfiguration } }),
      [generateStableHash(metricConfiguration)]
    ) ?? pendingResult;

  const metric = (result.data?.[0]?.values as MetricDataSeries) ?? [];

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.indicatorChart.title'),
        granularity: result.data?.[0]?.granularity ?? granularity,
        y1: {
          metricIds: [metricId, thresholdMetricId],
          metrics: [metric, metric.map(([timestamp]) => [timestamp, threshold])],
          labels: [
            isApplicationSloEntity(entity) ? applicationMetrics.latency.label : websiteMetrics.beaconDuration.label,
            t('in-service-levels:general.metrics.threshold')
          ],
          colors: [themes.default.ids.color.option.blue['400'], themes.default.ids.color.option.red['500']],
          formatter: millis.compact,
          renderer: lineWithThreshold
        },
        timeConfig: applyAdjustedTimeframe(timeConfig, result.data?.[0]?.adjustedTimeframe),
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />
      }}
      result={result}
    />
  );
}

function useMetricConfiguration(
  entity: SloEntityUnion,
  indicator: TimeBasedLatencyBlueprintIndicator,
  granularity: number,
  timeConfig: TimeConfig
): UnifiedMetricConfiguration {
  const tagFilterExpression = useBasicTagFilterExpression({ entity });
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
