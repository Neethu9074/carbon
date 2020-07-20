import React from 'react';

import ReleaseMarkerLane from 'in-components/Chart/markerLanes/ReleaseMarkerLane/ReleaseMarkerLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';

export default function ApplicationDashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleaseMarkerLane />
    </MarkerLanesPresenter>
  );
}
