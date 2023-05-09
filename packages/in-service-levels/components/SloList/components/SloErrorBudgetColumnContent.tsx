/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import ErrorBudgetInfo from 'in-service-levels/components/SloList/components/ErrorBudgetInfo';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import SparkChart from 'in-components/SparkChart';

interface SloErrorBudgetColumnContentProps {
  item: SloListItem;
}
export default function SloErrorBudgetColumnContent({ item }: SloErrorBudgetColumnContentProps) {
  const { configuration, remainingBudget, burnDown, metricGranularity, metricTimeConfig } = item;

  return (
    <Stack direction="horizontal" align="center">
      <SparkChart timeConfig={metricTimeConfig} metrics={burnDown} rollup={metricGranularity} />
      <ErrorBudgetInfo configuration={configuration} remainingErrorBudget={remainingBudget} />
    </Stack>
  );
}
