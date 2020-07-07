import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleaseMarkerLane from 'in-components/Chart/markerLanes/ReleaseMarkerLane';

export default function K8DashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleaseMarkerLane />
    </MarkerLanesPresenter>
  );
}
