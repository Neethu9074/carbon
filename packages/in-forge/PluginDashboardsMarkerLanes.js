/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ActionsLaneWithAccess from 'in-automation/components/MarkersLane/ActionsLaneWithAccess';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';

export default function PluginDashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
      {props.hasActionlane && <ActionsLaneWithAccess snapshotId={props.snapshotId} {...props} />}
    </MarkerLanesPresenter>
  );
}
