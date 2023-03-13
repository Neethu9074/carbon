/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error Needs to be converted to TS definition.
import AlertsLane from 'in-components/Chart/markerLanes/AlertsLane/AlertsLane';
import getMobileAppAlertClusters from 'in-mobile-apps/subscriptions/getMobileAppAlertClusters';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';

export default function MobileAppMarkerLane({ mobileAppId }: { mobileAppId: string }) {
  return function MarkerLaneMobileApp(laneProps: any) {
    return (
      <MarkerLanesPresenter {...laneProps}>
        <AlertsLane
          getAlerts={getMobileAppAlertClusters}
          config={{
            mobileAppId
          }}
        />
      </MarkerLanesPresenter>
    );
  };
}
