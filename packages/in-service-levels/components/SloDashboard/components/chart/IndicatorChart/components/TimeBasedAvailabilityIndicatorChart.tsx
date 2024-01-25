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
import { calculateSloReferenceChartGranularity } from 'in-service-levels/components/SloDashboard/components/chart/utils';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import useSliMetricConfiguration from 'in-service-levels/hooks/useSliMetricConfiguration';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { TimeBasedAvailabilityBlueprintIndicator } from 'in-service-levels/types';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

const metricId = 'availability';

export default function TimeBasedAvailabilityIndicatorChart({
  entity,
  indicator
}: IndicatorChartProps<TimeBasedAvailabilityBlueprintIndicator>) {
  const { threshold } = indicator;

  const selectedTimeConfig = useTimeConfig();
  const granularity = calculateSloReferenceChartGranularity(selectedTimeConfig);
  const { timeWindows, timeWindowColors, selectedTimeWindowType } = useSloTimeWindowContext();
  const metricConfiguration = useSliMetricConfiguration<TimeBasedAvailabilityBlueprintIndicator>(
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
  const metricValues = metrics.map(metric => metric.values as MetricDataSeries) ?? [];
  const thresholdMetrics: MetricDataSeries = metricValues.flat(1).map(([timestamp]) => [timestamp, threshold]);
  const metricLabel = isApplicationSloEntity(entity)
    ? applicationMetrics.errorRate.label
    : websiteMetrics.beaconErrorRate.label;

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
          formatter: percentage.detailed,
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
  indicator: TimeBasedAvailabilityBlueprintIndicator,
  tagFilterExpression: TagFilterExpression,
  granularity: number
): UnifiedMetricConfiguration {
  if (isApplicationSloEntity(entity)) {
    return applicationMetrics.errorRate.timeSeries({
      entity,
      tagFilterExpression,
      granularity,
      timeConfig,
      aggregation: indicator.aggregation
    });
  }

  if (isWebsiteSloEntity(entity)) {
    return websiteMetrics.beaconErrorRate.timeSeries({
      entity,
      tagFilterExpression,
      granularity,
      timeConfig,
      aggregation: indicator.aggregation
    });
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
