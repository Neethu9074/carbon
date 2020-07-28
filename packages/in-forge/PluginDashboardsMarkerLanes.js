import React from 'react';

import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';

export default function PluginDashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
    </MarkerLanesPresenter>
  );
}
