/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isTimeBasedSli, Result, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { hasError, isLoading, success } from 'in-services/util/result';
import { applyAdjustedTimeframe } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { minutes, number } from 'in-services/formatters/number';
import { MetricDataSeries } from 'in-components/Chart/types';
import { sloMetrics } from 'in-service-levels/metrics';
import { FetchedState } from 'in-hooks/utils/types';

interface ErrorBudgetConsumptionChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export default function ErrorBudgetConsumptionChart({ configuration, timeConfig }: ErrorBudgetConsumptionChartProps) {
  const { indicator, lastUpdated } = configuration;

  const [metricResult, , errors, progress] = useErrorBudgetConsumptionChartMetrics(configuration, timeConfig);

  const formatter = isTimeBasedSli(indicator) ? minutes.fixedCompact : number.compact;
  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: lastUpdated
  });
  const metric = metricResult?.errorBudgetConsumptionMetric ?? [];

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.errorBudgetConsumptionChart.title'),
        y1: {
          metricIds: ['consumption'],
          metrics: [metric],
          min: 0,
          labels: [sloMetrics.momentaryConsumption.label],
          colors: [themes.default.ids.color.option.blue['400']],
          renderer,
          formatter
        },
        granularity: metricResult?.granularity,
        timeConfig: metricResult?.adjustedTimeConfig ?? timeConfig,

        // FIXME: Chart height should be dynamic based on the dashboard layout and available screen size.
        // The current values are just measures taken from the default rendering of the chart to make the sizing work
        customHeight: 300,
        customChartSkeletonHeight: 300
      }}
      result={{ progress, errors }}
    />
  );
}

interface ErrorBudgetConsumptionChartMetrics {
  errorBudgetConsumptionMetric: MetricDataSeries;
  granularity: number;
  adjustedTimeConfig: TimeConfig;
}

function useErrorBudgetConsumptionChartMetrics(
  config: ServiceLevelObjectiveConfiguration,
  timeConfig: TimeConfig
): FetchedState<ErrorBudgetConsumptionChartMetrics> {
  const { id } = config;
  const metricConfig = {
    consumption: sloMetrics.momentaryConsumption.timeSeries({
      configId: id!,
      timeConfig: timeConfig
    })
  };

  const result = useObservable(
    () =>
      getUnifiedMetrics({
        metrics: metricConfig
      }),
    [id!, timeConfig]
  );

  if (!result || isLoading(result) || hasError(result)) {
    // We don't have data yet, so a transformation of the return type is not necessary
    return resultToFetchedStateResponse(result as Result<any>);
  }

  const mappedData: ErrorBudgetConsumptionChartMetrics = {
    errorBudgetConsumptionMetric: (result.data?.find(r => r.id === 'consumption')?.values ?? []) as MetricDataSeries,
    granularity: result.data?.[0]?.granularity ?? metricConfig.consumption.granularity,
    adjustedTimeConfig: applyAdjustedTimeframe(timeConfig, result.data?.[0]?.adjustedTimeframe)
  };

  return resultToFetchedStateResponse(success(mappedData));
}
