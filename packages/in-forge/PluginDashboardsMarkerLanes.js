/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import ActionsLane from 'in-automation/components/MarkersLane/ActionsLane';
import { hasAutomationAccess } from 'in-stores/permission';

export default function PluginDashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
      {props.hasActionlane && hasAutomationAccess && <ActionsLane snapshotId={props.snapshotId} {...props} />}
    </MarkerLanesPresenter>
  );
}
