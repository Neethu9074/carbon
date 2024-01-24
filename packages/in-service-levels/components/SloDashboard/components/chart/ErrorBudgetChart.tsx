/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  GetUnifiedMetricsQuery,
  isTimeBasedSli,
  Result,
  ServiceLevelObjectiveConfiguration,
  TimeConfig
} from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import { findMinMetricValue } from 'in-service-levels/components/SloDashboard/components/chart/utils';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { getFinestAvailableGranularity } from 'in-stores/metric/metric';
import { hasError, isLoading, success } from 'in-services/util/result';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { minutes, number } from 'in-services/formatters/number';
import { MetricDataSeries } from 'in-components/Chart/types';
import { sloMetrics } from 'in-service-levels/metrics';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface ErrorBudgetChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function ErrorBudgetChart({ configuration }: ErrorBudgetChartProps) {
  const { indicator, entity, lastUpdated } = configuration;

  const timeConfig = useTimeConfig();
  const { timeWindows, timeWindowColors, selectedTimeWindowType } = useSloTimeWindowContext();
  const [metricResult, , errors, progress] = useErrorBudgetChartMetrics(configuration, timeConfig, timeWindows);

  const formatter = isTimeBasedSli(indicator) ? minutes.fixedCompact : number.compact;
  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: lastUpdated
  });
  const metrics = metricResult?.remainingBudgetMetrics ?? [];

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.errorBudgetChart.title'),
        y1: {
          metricIds: timeWindows.map((_, index) => `timeWindows${index}`),
          metrics,
          min: findMinMetricValue(metrics.flatMap(metric => metric)),
          renderAllTickLabels: true,
          labels: timeWindows.map(() => sloMetrics.remainingBudget.label),
          colors: timeWindowColors,
          renderer,
          formatter
        },
        granularity: metricResult?.granularity,
        timeConfig: selectedTimeWindowType === 'SLO_TIME_WINDOW' ? timeWindows?.[0] ?? timeConfig : timeConfig,
        renderPostChartContent: props => <SloDashboardMarkerLanes entity={entity} {...props} />,
        // FIXME: Chart height should be dynamic based on the dashboard layout and available screen size.
        // The current values are just measures taken from the default rendering of the chart to make the sizing work
        customHeight: 250,
        customChartSkeletonHeight: 308
      }}
      result={{ progress, errors }}
    />
  );
}

interface ErrorBudgetChartMetrics {
  remainingBudgetMetrics: MetricDataSeries[];
  granularity: number;
}

function useErrorBudgetChartMetrics(
  config: ServiceLevelObjectiveConfiguration,
  selectedTimeConfig: TimeConfig,
  timeWindows: TimeConfig[]
): FetchedState<ErrorBudgetChartMetrics> {
  const { id } = config;
  const metricConfigs = timeWindows.reduce(
    (previous, timeConfig, index) => ({
      [`timeWindow${index}`]: sloMetrics.remainingBudget.timeSeries({
        configId: id!,
        timeConfig,
        contextTimeConfig: timeConfig
      }),
      ...previous
    }),
    {} as GetUnifiedMetricsQuery['metrics']
  );

  const result = useObservable(
    () =>
      getUnifiedMetrics({
        metrics: metricConfigs
      }),
    [id!, timeWindows]
  );

  if (!result || isLoading(result) || hasError(result)) {
    // We don't have data yet, so a transformation of the return type is not necessary
    return resultToFetchedStateResponse(result as Result<any>);
  }

  const metrics = result.data?.filter(r => r.id.startsWith('timeWindow')) ?? [];

  const mappedData: ErrorBudgetChartMetrics = {
    remainingBudgetMetrics: metrics.map(metric => metric.values as MetricDataSeries) ?? [],
    granularity: getMetricGranularity(selectedTimeConfig, metricConfigs, result.data)
  };

  return resultToFetchedStateResponse(success(mappedData));
}

type TimeSeriesConfig = ReturnType<typeof sloMetrics.remainingBudget.timeSeries>;

function getMetricGranularity(
  timeConfig: TimeConfig,
  metricConfigs: GetUnifiedMetricsQuery['metrics'],
  metricResults?: UnifiedMetricsResult[]
): number {
  const resultGranularity = metricResults?.[0]?.granularity;
  if (resultGranularity) return resultGranularity;

  if ('timeWindow0' in metricConfigs) return (metricConfigs.timeWindow0 as TimeSeriesConfig).granularity;

  return getFinestAvailableGranularity(timeConfig);
}
