export const kubernetesPlugins = {
  cluster: 'com.instana.forge.infrastructure.paas.kubernetes.KubernetesCluster',
  node: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.node.KubernetesNode',
  namespace: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.namespace.KubernetesNamespace',
  deplpyment: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.deployment.KubernetesDeployment',
  replicaSet: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.replicaset.KubernetesReplicaSet',
  service: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.service.KubernetesService',
  endpoints: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.endpoints.KubernetesEndpoints',
  pod: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.pod.KubernetesPod'
};
