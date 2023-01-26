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

export default function CustomDashboardMarkerLanes(markerLaneProps) {
  return (
    <MarkerLanesPresenter {...markerLaneProps}>
      {potentialProblemsEnabled &&
      anyDatasetWithPotentialProblemsConfigured(
        markerLaneProps.config?.y1?.metrics,
        markerLaneProps.config?.y2?.metrics
      )
        ? markerLaneProps => (
            <PotentialProblemsPostChartContent
              config={markerLaneProps.config}
              markerLaneProps={markerLaneProps}
              openingDialogDisabled={markerLaneProps.isPreview}
              widgetTitle={markerLaneProps.title}
            />
          )
        : undefined}
      {markerLaneProps.displayReleaseLane ? <ReleasesLane /> : undefined}
    </MarkerLanesPresenter>
  );
}

function anyDatasetWithPotentialProblemsConfigured(metrics1, metrics2) {
  return metrics1?.some(m => Boolean(m.potentialProblems)) || metrics2?.some(m => Boolean(m.potentialProblems));
}
