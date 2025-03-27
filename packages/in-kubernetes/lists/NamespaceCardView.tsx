/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs ts migration
import { getKubernetesNamespacesSubscribeEvent } from 'in-kubernetes/lists/NamespaceTable/NamespaceTable';
import ResourceCardList from 'in-kubernetes/lists/ResourceCardList/ResourceCardList';
import { useGetNamespaceDashboard } from 'in-kubernetes/navigation/paths';

export default function NamespaceCardView() {
  const getNamespaceHrefs = useGetNamespaceDashboard();
  const workloads = ['unhealthyDeployments', 'runningPods', 'services', 'cronJobs'];

  return (
    <ResourceCardList
      type="namespace"
      hasSortingEnabled={false}
      subscription={getKubernetesNamespacesSubscribeEvent}
      workloads={workloads}
      getHrefs={getNamespaceHrefs}
    />
  );
}
