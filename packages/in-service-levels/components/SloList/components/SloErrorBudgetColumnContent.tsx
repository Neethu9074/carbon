/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import ErrorBudgetInfo from 'in-service-levels/components/SloList/components/ErrorBudgetInfo';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import SparkChart from 'in-components/SparkChart/SparkChartReactComponent';
import { minutes, number } from 'in-services/formatters/number';

interface SloErrorBudgetColumnContentProps {
  item: SloListItem;
  showSparkChart?: boolean;
}

export default function SloErrorBudgetColumnContent({ item, showSparkChart }: SloErrorBudgetColumnContentProps) {
  const { configuration, remainingBudget, burnDown, metricGranularity, metricTimeConfig } = item;

  return (
    <Stack direction="horizontal" align="center">
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
