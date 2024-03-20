/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { t } from '@instana/i18n-react';

import { useLineWithMissingDataIndicatorRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import {
  copyFirstBucketOfSubsequentDataSeries,
  findMinMetricValue
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import useTimeWindowAwareSloChartMetrics from 'in-service-levels/hooks/useTimeWindowAwareSloChartMetrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { minutes, number } from 'in-services/formatters/number';
import { sloMetrics } from 'in-service-levels/metrics';
import useSloZoomInAction from 'in-service-levels/hooks/useSloZoomInAction';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';

interface ErrorBudgetChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function ErrorBudgetChart({ configuration }: ErrorBudgetChartProps) {
  const { indicator, entity, lastUpdated } = configuration;

  const sloZoomInAction = useSloZoomInAction();
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const granularity = calculateSloGranularity(timeConfig);

  const [metricResult, , errors, progress] = useTimeWindowAwareSloChartMetrics(
    configuration,
    timeConfig =>
      sloMetrics.remainingBudget.timeSeries({
        configId: configuration.id!,
        timeConfig,
        granularity
      }),
    timeConfig,
    timeWindows,
    granularity
  );

  const formatter = indicator.type === 'timeBased' ? minutes.fixedCompact : number.compact;
  const renderer = useLineWithMissingDataIndicatorRenderer({
    firstCollectedMetricTimestamp: lastUpdated
  });

  const metrics = copyFirstBucketOfSubsequentDataSeries(metricResult?.metrics);

  return (
    <ResultAwareChart
      config={{
        title: t('in-service-levels:sloDashboard.components.errorBudgetChart.title'),
        primaryContextMenuAction: sloZoomInAction.name,
        additionalContextMenuButtons: [sloZoomInAction],
        excludedContextMenuActions: [zoomInAction.name],
        y1: {
          metricIds: timeWindows.map((_, index) => `timeWindows${index}`),
          metrics,
          min: findMinMetricValue(metrics.flat(1)),
          renderAllTickLabels: true,
          labels: timeWindows.map(() => sloMetrics.remainingBudget.label),
          colors: timeWindowColors,
          renderer,
          formatter
        },
        granularity: metricResult?.granularity ?? granularity,
        timeConfig,
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
