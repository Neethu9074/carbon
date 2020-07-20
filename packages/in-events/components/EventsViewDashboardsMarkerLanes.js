import React from 'react';

import ReleaseMarkerLane from 'in-components/Chart/markerLanes/ReleaseMarkerLane/ReleaseMarkerLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';

export default function EventsViewDashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleaseMarkerLane />
    </MarkerLanesPresenter>
  );
}
