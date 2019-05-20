import { plugins } from 'in-forge/constants';

export function getIconByPlugin(plugin) {
  switch (plugin) {
    case plugins.kubernetesCluster:
      return 'lib_kubernetes_cluster';
    case plugins.kubernetesPod:
      return 'lib_kubernetes_pod';
    case plugins.kubernetesNode:
      return 'lib_kubernetes_node';
    case plugins.kubernetesDeployment:
      return 'lib_kubernetes_workload';
    case plugins.kubernetesNamespace:
      return 'lib_kubernetes_namespace';
    case 'kubernetesService':
      return 'lib_kubernetes_service';
  }
}
