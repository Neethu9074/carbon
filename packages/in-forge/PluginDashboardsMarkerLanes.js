/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import ActionsLane from 'in-automation/components/MarkersLane/ActionsLane';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import { automationAccessPermissions } from 'in-stores/permission';
import useHasAccess from 'in-stores/useHasAccess';

function ActionsLaneWithAccess(props) {
  const hasAutomationAccess = useHasAccess({
    optionalPrecondition: actionAutomationEnabled,
    requiredPermissions: automationAccessPermissions
  });

  if (!props.hasActionlane || !hasAutomationAccess) {
    return null;
  }

  return <ActionsLane snapshotId={props.snapshotId} {...props} />;
}

export default function PluginDashboardsMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
      <ActionsLaneWithAccess {...props} />
    </MarkerLanesPresenter>
  );
}
