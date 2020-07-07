import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleaseMarkerLane from 'in-components/Chart/markerLanes/ReleaseMarkerLane';

export default function PluginDashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleaseMarkerLane />
    </MarkerLanesPresenter>
  );
}
