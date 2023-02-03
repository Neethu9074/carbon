/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error Needs to be converted to TS definition.
import AlertsLane from 'in-components/Chart/markerLanes/AlertsLane/AlertsLane';
import getSyntheticAlertClusters from 'in-synthetics/subscriptions/getSyntheticAlertClusters';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';

interface MarkerLanesSyntheticProps {
  testId: string;
}

const MarkerLanesSynthetic = ({ testId }: MarkerLanesSyntheticProps) => {
  return function MarkerLanesSynthMon(laneProps: any) {
    return (
      <MarkerLanesPresenter {...laneProps}>
        <AlertsLane
          getAlerts={getSyntheticAlertClusters}
          config={{
            syntheticTestId: testId
          }}
        />
      </MarkerLanesPresenter>
    );
  };
};

export default MarkerLanesSynthetic;
