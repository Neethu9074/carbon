/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import LogsDistributionChartSection from 'in-logging/analyze/AnalyzeView/components/LogsDistributionChartSection';

export function ChartsPresenter(props) {
  const { isValid } = props;

  return isValid && <LogsDistributionChartSection {...props} disableClose={false} hideRenderer showHeader />;
}
