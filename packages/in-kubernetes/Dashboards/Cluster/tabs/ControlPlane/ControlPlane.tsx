/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer } from '@instana/components';

// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { getKeyValueObjectAsArray } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/utils';
import { ControlPlaneProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/types';
import { Details, Etcd } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane';

export default function ControlPlane({ data: cluster, timeConfig }: ControlPlaneProps) {
  const { debuggingInfo } = cluster;
  const clusterInfos = getKeyValueObjectAsArray(debuggingInfo);

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={cluster.id} timeConfig={timeConfig} />
      <Details clusterId={cluster.id} clusterInfos={clusterInfos} timeConfig={timeConfig} />
      <Spacer vertical="large" />
      <Etcd clusterId={cluster.id} timeConfig={timeConfig} />
    </>
  );
}
