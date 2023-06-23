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
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { useTheme } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import {
  lineWithThreshold,
  thresholdMetricId
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
import { IndicatorChartProps } from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import { calculateSloReferenceChartGranularity } from 'in-service-levels/components/SloDashboard/components/chart/utils';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { TimeBasedAvailabilityBlueprintIndicator } from 'in-service-levels/types';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { applyAdjustedTimeframe } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { MetricDataSeries } from 'in-components/Chart/types';
import { percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';

const metricId = 'availability';

export default function TimeBasedAvailabilityIndicatorChart({
  entity,
  indicator,
  timeConfig
}: IndicatorChartProps<TimeBasedAvailabilityBlueprintIndicator>) {
  const { threshold } = indicator;

  const granularity = calculateSloReferenceChartGranularity(timeConfig);
  const theme = useTheme();
  const metricConfiguration = useMetricConfiguration(entity, indicator, granularity, timeConfig);
  const result: Result<UnifiedMetricsResult[]> =
    useObservable(
      () => getUnifiedMetrics({ metrics: { [metricId]: metricConfiguration } }),
      [entity, indicator, granularity, timeConfig]
    ) ?? pendingResult;

  const metric = (result.data?.[0].values as MetricDataSeries) ?? [];

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.indicatorChart.title'),
        granularity: result.data?.[0]?.granularity ?? granularity,
        y1: {
          metricIds: [metricId, thresholdMetricId],
          metrics: [metric, metric.map(([timestamp]) => [timestamp, threshold])],
          labels: [
            isApplicationSloEntity(entity) ? applicationMetrics.errorRate.label : websiteMetrics.beaconErrorRate.label,
            t('in-service-levels:general.metrics.threshold')
          ],
          colors: [theme.ids.color.option.blue['400'], theme.ids.color.option.red['500']],
          formatter: percentage.detailed,
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
  indicator: TimeBasedAvailabilityBlueprintIndicator,
  granularity: number,
  timeConfig: TimeConfig
): UnifiedMetricConfigurationUnion {
  const tagFilterExpression = useBasicTagFilterExpression({ entity });
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
