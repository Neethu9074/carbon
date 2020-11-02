import { emptyArray } from 'in-services/fixedObjects';

export const types = {
  APPLICATION: 'Application',
  K8S_CLUSTER: 'Kubernetes Cluster',
  K8S_NAMESPACE: 'Kubernetes Namespace',
  WEBSITE: 'Website',
  MOBILE_APP: 'Mobile App',
  INFRA_DFQ: 'infra DFQ'
};

export function mapApplications(applicationIds, getAdditionalProperties) {
  return applicationIds.map(id => ({
    id,
    type: types.APPLICATION,
    icon: 'lib_application',
    ...getAdditionalProperties(id)
  }));
}

export function mapKubernetesClusters(kubernetesClusterUUIDs, getAdditionalProperties) {
  return kubernetesClusterUUIDs.map(id => ({
    id,
    type: types.K8S_CLUSTER,
    icon: 'lib_kubernetes_cluster',
    ...getAdditionalProperties(id)
  }));
}

export function mapKubernetesNamespaces(kubernetesNamespaceUIDs, getAdditionalProperties) {
  return kubernetesNamespaceUIDs.map(id => ({
    id,
    type: types.K8S_NAMESPACE,
    icon: 'lib_kubernetes_namespace',
    ...getAdditionalProperties(id)
  }));
}

export function mapWebsites(websiteIds, getAdditionalProperties) {
  return websiteIds.map(id => ({
    id,
    type: types.WEBSITE,
    icon: 'lib_website',
    ...getAdditionalProperties(id)
  }));
}

export function mapMobileApps(mobileAppIds, getAdditionalProperties) {
  return mobileAppIds.map(id => ({
    id,
    type: types.MOBILE_APP,
    icon: 'lib_mobile_app',
    ...getAdditionalProperties(id)
  }));
}

export function mapInfraDfq(infraDfqFilter, getAdditionalProperties) {
  if (!infraDfqFilter) {
    return emptyArray;
  }
  return {
    id: 'infraDfq',
    label: infraDfqFilter,
    type: types.INFRA_DFQ,
    icon: 'lib_infrastructure_inverted',
    ...getAdditionalProperties()
  };
}
