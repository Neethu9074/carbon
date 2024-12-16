/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ApplicationBoundaryScope, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

//@ts-expect-error TS migration
import { useGetLabels } from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLane';
import getApplicationActionInstancesForCluster from 'in-automation/subscriptions/getApplicationActionInstancesCluster';
import ActionsLanePresenter from 'in-automation/components/MarkersLane/ActionsLanePresenter';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';

export default function ActionsLane({
  snapshotId,
  applicationId,
  ...remainingProps
}: {
  snapshotId?: string;
  applicationId?: string;
  clusterSizeMillis: number;
  timeConfig: TimeConfig;
  serviceId?: string;
  endpointId?: string;
  snapshotHostFqdn?: string;
  boundaryScope: ApplicationBoundaryScope;
  chartName: string;
}) {
  const { clusterSizeMillis, timeConfig, endpointId, serviceId, snapshotHostFqdn } = remainingProps;
  const labels = useGetLabels(applicationId, serviceId, endpointId);
  // Purpose: Derive an `appId` based on the presence of certain IDs.
  // The logic checks for the presence of IDs in the following order of precedence:
  // 1. endpointId: When present, it indicates the action lane is for an endpoint dashboard.
  //    Note: Even when the targetSnapshotId is an endpointId, an appId and service  are still available.
  // 2. serviceId: When present, it indicates the action lane is for a service dashboard.
  //    Note: Even when the targetSnapshotId is a serviceId, an appId is still available.
  // 3. applicationId: If neither endpointId nor serviceId are present,
  //    it indicates the action lane is for an application dashboard.
  // 4. snapshotId: Used for infra host dashboard.

  const appId = endpointId || serviceId || applicationId || snapshotId;

  // Entity type is sent using the same logic as above for the order
  // Note: The INFRASTRUCURE type will be sent for infra host dashboard as well as Kubernetes dashboard.
  const actionInstancesEntityType =
    (endpointId && 'ENDPOINT') ||
    (serviceId && 'SERVICE') ||
    (applicationId && 'APPLICATION') ||
    (snapshotId && 'INFRASTRUCTURE');

  const getActionInstancesList =
    useObservable(GetActionInstanceListData, [timeConfig, clusterSizeMillis, appId, actionInstancesEntityType]) ??
    pendingResult;

  if (
    (applicationId && !labels.applicationLabel) ||
    (serviceId && !labels.serviceLabel) ||
    (endpointId && !labels.endpointLabel)
  ) {
    // don't proceed when not all necessary labels are loaded, because otherwise we will get broken filter.

    return null;
  }

  return (
    <ActionsLanePresenter
      {...remainingProps}
      actionInstancesData={getActionInstancesList?.data ?? []}
      timeConfig={timeConfig}
      isLoading={isLoading(getActionInstancesList)}
      labels={labels}
      snapshotHostFqdn={snapshotHostFqdn}
    />
  );
}

type GetActionInstanceListTuple = [TimeConfig, number, string?, string?];

function GetActionInstanceListData([
  timeConfig,
  granularity,
  applicationId = '',
  actionInstancesEntityType
]: GetActionInstanceListTuple) {
  const result = getApplicationActionInstancesForCluster({
    timeConfig,
    targetSnapshotId: applicationId,
    granularity,
    entityType: actionInstancesEntityType
  }).startWith(pendingResult);

  return result;
}
