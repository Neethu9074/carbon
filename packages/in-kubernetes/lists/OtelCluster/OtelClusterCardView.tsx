/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { getOtelKubernetesClustersWithDefaults } from 'in-kubernetes/subscriptions/getOtelKubernetesClusters';
import ResourceCardList from 'in-kubernetes/lists/ResourceCardList/ResourceCardList';
import { useGetClusterDashboard } from 'in-kubernetes/navigation/paths';

export default function OtelCluster() {
  const getClusterHrefs = useGetClusterDashboard('otelcluster');
  const workloads = ['otelNodes', 'otelPods', 'otelContainers'];

  return (
    <ResourceCardList
      type="otelcluster"
      hasSortingEnabled
      subscription={getOtelKubernetesClustersWithDefaults}
      getHrefs={getClusterHrefs}
      workloads={workloads}
    />
  );
}
