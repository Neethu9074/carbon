/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import LogsDistributionChartSection from 'in-logging/analyze/AnalyzeView/components/LogsDistributionChartSection';
import { chartChanged } from 'in-logging/analyze/AnalyzeView/tracker';

export function ChartsPresenter(props) {
  const { isValid } = props;

  return (
    isValid && (
      <LogsDistributionChartSection
        {...props}
        disableClose={false}
        hideRenderer
        tracking={{
          onChartChanged: chartConfig => chartConfig && chartChanged(chartConfig)
        }}
      />
    )
  );
}
