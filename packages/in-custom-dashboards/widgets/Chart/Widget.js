/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { PotentialProblemsPostChartContent } from 'in-custom-dashboards/widgets/Chart/PotentialProblems/PotentialProblemsPostChartContent';
import { applicationSmartAlertsEnabled, potentialProblemsInCustomDashboardEnabled } from 'in-services/featureFlags';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';

export default function ChartWidget({ actions, config, title, isPreview, dragHandle, customHeight }) {
  const potentialProblemsEnabled =
    applicationSmartAlertsEnabled &&
    potentialProblemsInCustomDashboardEnabled &&
    anyDatasetWithPotentialProblemsConfigured(config?.y1?.metrics, config?.y2?.metrics);

  return (
    <UnifiedMetricsChart
      renderPostChartContent={
        potentialProblemsEnabled
          ? markerLaneProps => (
              <PotentialProblemsPostChartContent
                config={config}
                markerLaneProps={markerLaneProps}
                openingDialogDisabled={isPreview}
                widgetTitle={title}
              />
            )
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

function anyDatasetWithPotentialProblemsConfigured(metrics1, metrics2) {
  return metrics1?.some(m => Boolean(m.potentialProblems)) || metrics2?.some(m => Boolean(m.potentialProblems));
}
