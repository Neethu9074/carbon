/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';

export default function K8DashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
    </MarkerLanesPresenter>
  );
}
