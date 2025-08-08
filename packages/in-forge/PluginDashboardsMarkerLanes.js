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

export default function PluginDashboardsMarkerLanes(props) {
  const hasAutomationAccess = useHasAccess({
    optionalPrecondition: actionAutomationEnabled,
    requiredPermissions: automationAccessPermissions
  });
  return (
    <MarkerLanesPresenter {...props}>
      <ReleasesLane />
      {props.hasActionlane && hasAutomationAccess && <ActionsLane snapshotId={props.snapshotId} {...props} />}
    </MarkerLanesPresenter>
  );
}
