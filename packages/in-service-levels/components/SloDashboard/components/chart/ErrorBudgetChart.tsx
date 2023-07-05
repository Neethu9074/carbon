/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { isTimeBasedSli, Result, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { useTheme } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import { useStairwayRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/stairway';
import { findMinMetricValue } from 'in-service-levels/components/SloDashboard/components/chart/utils';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import useSloWindowTimeConfig from 'in-service-levels/hooks/useSloWindowTimeConfig';
import { hasError, isLoading, success } from 'in-services/util/result';
import { applyAdjustedTimeframe } from 'in-service-levels/utils/time';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { minutes, number } from 'in-services/formatters/number';
import { MetricDataSeries } from 'in-components/Chart/types';
import { sloMetrics } from 'in-service-levels/metrics';
import { FetchedState } from 'in-hooks/utils/types';
import ButtonGroup from 'in-components/ButtonGroup';

interface ErrorBudgetChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
  // The currently user selected timeConfig, the chart will calculate the full slo  time window on its own
  timeConfig: TimeConfig;
  showFullSloTimeWindow?: boolean;
}

export default function ErrorBudgetChart({ configuration, timeConfig, showFullSloTimeWindow }: ErrorBudgetChartProps) {
  const theme = useTheme();

  const { indicator, entity, lastUpdated } = configuration;

  const [metricResult, , errors, progress] = useErrorBudgetChartMetrics(
    configuration,
    timeConfig,
    showFullSloTimeWindow
  );

  const [showFullConsumption, setShowFullConsumption] = useState(false);

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
          context: showFullSloTimeWindow ? 'fullWindow' : ''
        }),
        y1: {
          metricIds: ['consumed', 'remaining'],
          metrics: [metricResult?.metrics.consumed ?? [], metricResult?.metrics.remaining ?? []],
          min: showFullConsumption ? findMinMetricValue(metricResult?.metrics.remaining ?? []) : 0,
          renderAllTickLabels: showFullConsumption,
          labels: [sloMetrics.consumedBudget.label, sloMetrics.remainingBudget.label],
          colors: [theme.ids.color.option.blue['400'], theme.ids.color.option.red['500']],
          renderer,
          formatter
        },
        granularity: metricResult?.granularity,
        timeConfig: metricResult?.adjustedTimeConfig ?? timeConfig,
        rightHeaderContent: (
          <ButtonGroup
            buttonPropsList={[
              {
                key: 'compact',
                text: t('in-service-levels:sloDashboard.components.errorBudgetChart.optionCompact'),
                onClick: () => setShowFullConsumption(false)
              },
              {
                key: 'full',
                text: t('in-service-levels:sloDashboard.components.errorBudgetChart.optionFull'),
                onClick: () => setShowFullConsumption(true)
              }
            ]}
            activeKey={showFullConsumption ? 'full' : 'compact'}
          />
        ),
        renderPostChartContent: props =>
          showFullSloTimeWindow ? undefined : <SloDashboardMarkerLanes entity={entity} {...props} />,

        // FIXME: Chart height should be dynamic based on the dashboard layout and available screen size.
        // The current values are just measures taken from the default rendering of the chart to make the sizing work
        customHeight: showFullSloTimeWindow ? 300 : undefined,
        customChartSkeletonHeight: showFullSloTimeWindow ? 300 : 238
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

function useErrorBudgetChartMetrics(
  config: ServiceLevelObjectiveConfiguration,
  timeConfig: TimeConfig,
  showFullSloTimeWindow: boolean | undefined
): FetchedState<ErrorBudgetChartMetrics> {
  const { id, timeWindow } = config;
  const fullWindowTimeConfig = useSloWindowTimeConfig(timeWindow);
  const activeTimeConfig = showFullSloTimeWindow ? fullWindowTimeConfig : timeConfig;
  const metricConfigs = {
    consumed: sloMetrics.consumedBudget.timeSeries({
      configId: id!,
      timeConfig: activeTimeConfig,
      contextTimeConfig: !showFullSloTimeWindow ? fullWindowTimeConfig : undefined
    }),
    remaining: sloMetrics.remainingBudget.timeSeries({
      configId: id!,
      timeConfig: activeTimeConfig,
      contextTimeConfig: !showFullSloTimeWindow ? fullWindowTimeConfig : undefined
    })
  };
  const result = useObservable(
    () =>
      getUnifiedMetrics({
        metrics: metricConfigs
      }),
    [id!, timeConfig]
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
