/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ApplicationBoundaryScope, TimeConfig } from '@instana/types';

import ActionsLane from 'in-automation/components/MarkersLane/ActionsLane';
import { automationAccessPermissions } from 'in-stores/permission';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import useHasAccess from 'in-stores/useHasAccess';

interface ActionsLaneProps {
  snapshotId?: string;
  applicationId?: string;
  clusterSizeMillis: number;
  timeConfig: TimeConfig;
  serviceId?: string;
  endpointId?: string;
  snapshotHostFqdn?: string;
  boundaryScope: ApplicationBoundaryScope;
  chartName: string;
}

export default function ActionsLaneWithAccess(props: ActionsLaneProps) {
  const hasAutomationAccess = useHasAccess({
    optionalPrecondition: actionAutomationEnabled,
    requiredPermissions: automationAccessPermissions
  });

  if (!hasAutomationAccess) {
    return null;
  }

  return <ActionsLane {...props} />;
}
