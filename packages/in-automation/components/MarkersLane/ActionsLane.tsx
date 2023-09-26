/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

//@ts-expect-error TS migration
import { useGetLabels } from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLane';
import getApplicationActionInstancesForCluster from 'in-automation/subscriptions/getApplicationActionInstancesCluster';
import ActionsLanePresenter from 'in-automation/components/MarkersLane/ActionsLanePresenter';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { ApplicationBoundaryScope } from 'in-types';
import { TimeConfig } from 'in-types';

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
  const getActionInstancesList =
    useObservable(GetActionInstanceListData, [timeConfig, clusterSizeMillis, appId]) ?? pendingResult;

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

type GetActionInstanceListTuple = [TimeConfig, number, string?];

function GetActionInstanceListData([timeConfig, granularity, applicationId = '']: GetActionInstanceListTuple) {
  return getApplicationActionInstancesForCluster({
    timeConfig,
    targetSnapshotId: applicationId,
    granularity
  }).startWith(pendingResult);
}
