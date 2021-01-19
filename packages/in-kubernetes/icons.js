/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { plugins } from 'in-forge/constants';

export function getIconByPlugin(plugin) {
  switch (plugin) {
    case plugins.kubernetesCluster:
      return 'lib_kubernetes_cluster';
    case plugins.kubernetesPod:
      return 'lib_kubernetes_pod';
    case plugins.kubernetesReplicaSet:
      return 'lib_kubernetes_workload';
    case plugins.kubernetesNode:
      return 'lib_kubernetes_node';
    case plugins.kubernetesDeployment:
      return 'lib_kubernetes_workload';
    case plugins.openshiftDeploymentConfig:
      return 'lib_kubernetes_workload';
    case plugins.kubernetesDaemonSet:
      return 'lib_kubernetes_workload';
    case plugins.kubernetesStatefulSet:
      return 'lib_kubernetes_workload';
    case plugins.kubernetesNamespace:
      return 'lib_kubernetes_namespace';
    case 'kubernetesService':
      return 'lib_kubernetes_service';
  }
}

export function getContainerIconByPlugin(plugin) {
  if (plugin === plugins.containerd) {
    return 'lib_container_containerd';
  } else if (plugin === plugins.crio) {
    return 'lib_container_crio';
  }
  return 'lib_container_docker';
}
