/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isTimeBasedSli, Result, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { useTheme } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { useStairwayRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/stairway';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { hasError, isLoading, success } from 'in-services/util/result';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { applyAdjustedTimeframe } from 'in-service-levels/utils';
import { minutes, number } from 'in-services/formatters/number';
import { MetricDataSeries } from 'in-components/Chart/types';
import { FetchedState } from 'in-hooks/utils/types';
import metrics from 'in-service-levels/metrics';

interface ErrorBudgetChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
  isFullSloTimeWindow?: boolean;
}

export default function ErrorBudgetChart({ configuration, timeConfig, isFullSloTimeWindow }: ErrorBudgetChartProps) {
  const theme = useTheme();

  const { id, indicator, lastUpdated } = configuration;

  const [metricResult, , errors, progress] = useErrorBudgetChartMetrics(id!, timeConfig);

  const formatter = isTimeBasedSli(indicator) ? minutes.fixedCompact : number.compact;
  const renderer = useStairwayRenderer({
    metricConfiguration: {
      remaining: { fillTopBackground: true }
    },
    firstCollectedMetricTimestamp: lastUpdated
  });

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.errorBudgetChart.title', {
          context: isFullSloTimeWindow ? 'fullWindow' : ''
        }),
        y1: {
          metricIds: ['consumed', 'remaining'],
          metrics: [metricResult?.metrics.consumed ?? [], metricResult?.metrics.remaining ?? []],
          labels: [metrics.consumedBudget.label, metrics.remainingBudget.label],
          colors: [theme.ids.color.option.blue['400'], theme.ids.color.option.red['500']],
          renderer,
          formatter
        },
        granularity: metricResult?.granularity,
        timeConfig: metricResult?.adjustedTimeConfig ?? timeConfig,

        // FIXME: Chart height should be dynamic based on the dashboard layout and available screen size
        customHeight: isFullSloTimeWindow ? 300 : undefined,
        customChartSkeletonHeight: isFullSloTimeWindow ? 300 : 182
      }}
      result={{ progress, errors }}
    />
  );
}

interface ErrorBudgetChartMetrics {
  metrics: {
    consumed: MetricDataSeries;
    remaining: MetricDataSeries;
  };
  granularity: number;
  adjustedTimeConfig: TimeConfig;
}

function useErrorBudgetChartMetrics(configId: string, timeConfig: TimeConfig): FetchedState<ErrorBudgetChartMetrics> {
  const metricConfigs = {
    consumed: metrics.consumedBudget.timeSeries({ configId: configId, timeConfig }),
    remaining: metrics.remainingBudget.timeSeries({ configId: configId, timeConfig })
  };
  const result = useObservable(
    () =>
      getUnifiedMetrics({
        metrics: metricConfigs
      }),
    [configId, timeConfig]
  );

  if (!result || isLoading(result) || hasError(result)) {
    // We don't have data yet, so a transformation of the return type is not necessary
    return resultToFetchedStateResponse(result as Result<any>);
  }

  const mappedData: ErrorBudgetChartMetrics = {
    metrics: {
      consumed: (result.data?.find(r => r.id === 'consumed')?.values ?? []) as MetricDataSeries,
      remaining: (result.data?.find(r => r.id === 'remaining')?.values ?? []) as MetricDataSeries
    },
    granularity: result.data?.[0].granularity ?? metricConfigs.consumed.granularity,
    adjustedTimeConfig: applyAdjustedTimeframe(timeConfig, result.data?.[0].adjustedTimeframe)
  };

  return resultToFetchedStateResponse(success(mappedData));
}
