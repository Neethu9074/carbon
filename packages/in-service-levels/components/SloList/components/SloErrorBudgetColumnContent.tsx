/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/carbon';

import ErrorBudgetInfo from 'in-service-levels/components/SloList/components/ErrorBudgetInfo';
import SparkChart from 'in-components/SparkChart/SparkChartReactComponent';
import { minutes, number } from 'in-services/formatters/number';
import { SloListItem } from 'in-service-levels/types';

import locals from 'in-service-levels/styles/SloAlignContent.mless';

interface SloErrorBudgetColumnContentProps {
  item: SloListItem;
  showSparkChart?: boolean;
}

export default function SloErrorBudgetColumnContent({ item, showSparkChart }: SloErrorBudgetColumnContentProps) {
  const { configuration, remainingBudget, burnDown, metricGranularity, metricTimeConfig } = item;

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

      <ErrorBudgetInfo configuration={configuration} remainingErrorBudget={remainingBudget} />
    </Stack>
  );
}
