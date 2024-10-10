/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { plugins } from 'in-forge/constants';

export function getContainerIconByPlugin(plugin: string) {
  if (plugin === plugins.containerd) {
    return 'lib_container_containerd';
  } else if (plugin === plugins.crio) {
    return 'lib_container_crio';
  }
  return 'lib_container_docker';
}

export function getIcon(workloadType: string) {
  if (!workloadType) {
    return 'lib_kubernetes_workload';
  }

  if (workloadType.includes('deployment')) {
    return 'lib_infra_kubernetesDeployment';
  }

  if (workloadType.includes('daemonset')) {
    return 'lib_infra_kubernetesDaemonSet';
  }

  if (workloadType.includes('statefulset')) {
    return 'lib_infra_kubernetesStatefulSet';
  }

  return 'lib_kubernetes_workload';
}
