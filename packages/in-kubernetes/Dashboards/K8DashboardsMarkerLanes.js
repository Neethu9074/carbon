/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { actionsLaneEnabled, actionAutomationEnabled } from 'in-services/featureFlags';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import ActionsLane from 'in-automation/components/MarkersLane/ActionsLane';
import { role } from 'in-stores/user';

export default function K8DashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
      {props.hasActionlane &&
        actionsLaneEnabled &&
        actionAutomationEnabled &&
        role?.canViewAutomationActionInstances && (
          <ActionsLane snapshotId={props.snapshotId} {...props} boundaryScope="ALL" />
        )}
    </MarkerLanesPresenter>
  );
}
