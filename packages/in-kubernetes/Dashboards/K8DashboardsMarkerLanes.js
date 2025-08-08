/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import CDEventsLane from 'in-components/Chart/markerLanes/CDEventsLane/CDEventsLane';
import ActionsLane from 'in-automation/components/MarkersLane/ActionsLane';
import { automationAccessPermissions } from 'in-stores/permission';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import useHasAccess from 'in-stores/useHasAccess';

export default function K8DashboardsMarkerLanes(props) {
  const hasAutomationAccess = useHasAccess({
    optionalPrecondition: actionAutomationEnabled,
    requiredPermissions: automationAccessPermissions
  });
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
      {props.hasActionlane && hasAutomationAccess && (
        <ActionsLane snapshotId={props.snapshotId} {...props} boundaryScope="ALL" />
      )}
      <CDEventsLane {...props} />
    </MarkerLanesPresenter>
  );
}
