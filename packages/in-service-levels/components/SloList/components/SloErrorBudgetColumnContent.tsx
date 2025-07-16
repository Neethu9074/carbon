/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { Stack } from '@instana/carbon';

import { applyAdjustedTimeframe, calculateSloGranularity } from 'in-service-levels/utils/time';
import ErrorBudgetInfo from 'in-service-levels/components/SloList/components/ErrorBudgetInfo';
import useOverlappingTimeWindows from 'in-service-levels/hooks/useOverlappingTimeWindows';
import { useSloErrorBudgetMetrics } from 'in-service-levels/hooks/useSloListMetrics';
import { getSingleNumberMetricValue } from 'in-service-levels/utils/format';
import SparkChart from 'in-components/SparkChart/SparkChartReactComponent';
import { minutes, number } from 'in-services/formatters/number';
import { MetricDataSeries } from 'in-components/Chart/types';
import { SloListItem } from 'in-service-levels/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hours } from 'in-services/time/time';
import { TimeConfig } from 'in-types';

import locals from 'in-service-levels/styles/SloAlignContent.mless';

interface SloErrorBudgetColumnContentProps {
  item: SloListItem;
  showSparkChart?: boolean;
}

const overlappingTimeWindowsTimeConfig: TimeConfig = { autoRefresh: false, windowSize: hours.toMillis(1) };

export default function SloErrorBudgetColumnContent({ item, showSparkChart }: SloErrorBudgetColumnContentProps) {
  const timeConfig = useTimeConfig();
  const { configuration } = item;
  const { id: sloConfigId } = configuration;
  const [metrics, metricsStatus] = useSloErrorBudgetMetrics(configuration);
  const { remainingBudgetSpark, remainingBudget: remainingBudgetMetrics } = metrics ?? {};
  const metricTimeConfig = applyAdjustedTimeframe(timeConfig, remainingBudgetSpark?.adjustedTimeframe);
  const metricGranularity = remainingBudgetSpark?.granularity ?? calculateSloGranularity(timeConfig);
  const remainingBudget = getSingleNumberMetricValue(remainingBudgetMetrics);
  const burnDown = (remainingBudgetSpark?.values ?? []) as MetricDataSeries;
  const [timeWindows, timeWindowsStatus] = useOverlappingTimeWindows({
    sloConfigId,
    timeConfig: overlappingTimeWindowsTimeConfig
  });

  if (metricsStatus === 'pending' || timeWindowsStatus === 'pending') {
    return <LoadingSkeleton className={locals.width100} />;
  }

  return (
    <Stack orientation="horizontal" gap="1rem" className={locals.stackAlignCenter}>
      {showSparkChart && (
        <SparkChart
          metrics={burnDown}
          rollup={metricGranularity}
          showNullValuesChartOnEmptyMetrics
          timeConfig={metricTimeConfig}
          // @ts-expect-error our number formatters are quite badly typed :/
          tooltipFormatter={configuration.indicator.type === 'timeBased' ? minutes.fixedCompact : number.compact}
        />
      )}

      <ErrorBudgetInfo timeWindows={timeWindows} configuration={configuration} remainingErrorBudget={remainingBudget} />
    </Stack>
  );
}
