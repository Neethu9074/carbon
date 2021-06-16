/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { PotentialProblemsPostChartContent } from 'in-custom-dashboards/widgets/Chart/PotentialProblems/PotentialProblemsPostChartContent';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { potentialProblemsInCustomDashboardEnabled } from 'in-services/featureFlags';

export default function ChartWidget({ actions, config, title, isPreview, dragHandle, customHeight }) {
  const potentialProblemsEnabled = potentialProblemsInCustomDashboardEnabled && Boolean(config?.potentialProblems);

  return (
    <UnifiedMetricsChart
      renderPostChartContent={
        potentialProblemsEnabled
          ? markerLaneProps => <PotentialProblemsPostChartContent config={config} markerLaneProps={markerLaneProps} />
          : undefined
      }
      cardUseMaxAvailableHeight={!isPreview}
      cardHeader={
        <>
          {dragHandle}
          {actions}
        </>
      }
      config={config}
      title={title}
      automaticallySize={!isPreview && !customHeight}
      customHeight={customHeight}
      shareMaxAxisDomain={config?.shareMaxAxisDomain}
    />
  );
}
