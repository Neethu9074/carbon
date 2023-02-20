/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PotentialProblemsPostChartContent } from 'in-custom-dashboards/widgets/Chart/PotentialProblems/PotentialProblemsPostChartContent';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import { potentialProblemsEnabled } from 'in-services/featureFlags';

export default function CustomDashboardMarkerLanes({ openingDialogDisabled, config, widgetTitle, markerLaneProps }) {
  return (
    <MarkerLanesPresenter {...markerLaneProps}>
      {potentialProblemsEnabled &&
      anyDatasetWithPotentialProblemsConfigured(config?.y1?.metrics, config?.y2?.metrics) ? (
        <PotentialProblemsPostChartContent
          config={config}
          markerLaneProps={markerLaneProps}
          openingDialogDisabled={openingDialogDisabled}
          widgetTitle={widgetTitle}
        />
      ) : (
        undefined
      )}
      {markerLaneProps.displayReleaseLane ? <ReleasesLane /> : undefined}
    </MarkerLanesPresenter>
  );
}

function anyDatasetWithPotentialProblemsConfigured(metrics1, metrics2) {
  return metrics1?.some(m => Boolean(m.potentialProblems)) || metrics2?.some(m => Boolean(m.potentialProblems));
}
