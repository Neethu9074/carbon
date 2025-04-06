/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { getKubernetesClustersWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import ResourceCardList from 'in-kubernetes/lists/ResourceCardList/ResourceCardList';
import { useGetClusterDashboard } from 'in-kubernetes/navigation/paths';

export default function ClusterCardView() {
  const getClusterHrefs = useGetClusterDashboard();
  const workloads = ['unhealthyNodes', 'unhealthyDeployments', 'runningPods', 'namespaces', 'services', 'cronJobs'];

  return (
    <ResourceCardList
      type="cluster"
      hasSortingEnabled
      subscription={getKubernetesClustersWithDefaults}
      getHrefs={getClusterHrefs}
      workloads={workloads}
    />
  );
}
