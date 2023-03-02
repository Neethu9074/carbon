/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import LogsDistributionChartSection from 'in-logging/analyze/AnalyzeView/components/Charts/LogsDistributionChartSection';
import { UngroupedViewProps } from 'in-components/AnalyzeView/UngroupedView/types';

export function ChartsPresenter(props: UngroupedViewProps) {
  return <LogsDistributionChartSection {...props} disableClose={false} hideRenderer showHeader />;
}
