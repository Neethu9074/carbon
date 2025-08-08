/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ActionsLaneWithAccess from 'in-automation/components/MarkersLane/ActionsLaneWithAccess';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import CDEventsLane from 'in-components/Chart/markerLanes/CDEventsLane/CDEventsLane';

export default function K8DashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
      <ActionsLaneWithAccess snapshotId={props.snapshotId} {...props} boundaryScope="ALL" />
      <CDEventsLane {...props} />
    </MarkerLanesPresenter>
  );
}
