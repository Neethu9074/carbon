/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { KubernetesCluster, TimeConfig } from '@instana/types';
import { Spacer } from '@instana/components';

// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { getKeyValueObjectAsArray } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/utils';
import { Details } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details';
import Etcd from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Etcd/Etcd';

export interface ControlPlaneProps {
  data: KubernetesCluster;
  timeConfig: TimeConfig;
}

export default function ControlPlane({ data: cluster, timeConfig }: ControlPlaneProps) {
  const { debuggingInfo } = cluster;
  const clusterInfos = getKeyValueObjectAsArray(debuggingInfo);

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={cluster.id} timeConfig={timeConfig} />
      <Details clusterId={cluster.id} clusterInfos={clusterInfos} timeConfig={timeConfig} />
      <Spacer vertical="large" />
      <Etcd clusterId={cluster.id} timeConfig={timeConfig} />
      <Spacer vertical="xxlarge" />
    </>
  );
}
