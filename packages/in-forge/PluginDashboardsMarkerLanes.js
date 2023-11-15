/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import ActionsLane from 'in-automation/components/MarkersLane/ActionsLane';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

export default function PluginDashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
      {props.hasActionlane && actionAutomationEnabled && role?.canViewAutomationActionInstances && (
        <ActionsLane snapshotId={props.snapshotId} {...props} />
      )}
    </MarkerLanesPresenter>
  );
}
