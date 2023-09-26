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

  const appId = applicationId || serviceId || snapshotId;
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
