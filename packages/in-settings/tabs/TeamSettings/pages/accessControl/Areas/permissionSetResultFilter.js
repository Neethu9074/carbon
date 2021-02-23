/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const types = {
  APPLICATION: 'Application',
  K8S_CLUSTER: 'Kubernetes Cluster',
  K8S_NAMESPACE: 'Kubernetes Namespace',
  WEBSITE: 'Website',
  MOBILE_APP: 'Mobile App',
  INFRA_DFQ: 'Infrastructure DFQ'
};

export function mapApplications(applicationIds, getAdditionalProperties) {
  return applicationIds.map(({ scopeId, scopeRoleId }) => ({
    id: scopeId,
    scopeRoleId,
    type: types.APPLICATION,
    icon: 'lib_application',
    ...getAdditionalProperties(scopeId)
  }));
}

export function mapKubernetesClusters(kubernetesClusterUUIDs, getAdditionalProperties) {
  return kubernetesClusterUUIDs.map(({ scopeId, scopeRoleId }) => ({
    id: scopeId,
    scopeRoleId,
    type: types.K8S_CLUSTER,
    icon: 'lib_kubernetes_cluster',
    ...getAdditionalProperties(scopeId)
  }));
}

export function mapKubernetesNamespaces(kubernetesNamespaceUIDs, getAdditionalProperties) {
  return kubernetesNamespaceUIDs.map(({ scopeId, scopeRoleId }) => ({
    id: scopeId,
    scopeRoleId,
    type: types.K8S_NAMESPACE,
    icon: 'lib_kubernetes_namespace',
    ...getAdditionalProperties(scopeId)
  }));
}

export function mapWebsites(websiteIds, getAdditionalProperties) {
  return websiteIds.map(({ scopeId, scopeRoleId }) => ({
    id: scopeId,
    scopeRoleId,
    type: types.WEBSITE,
    icon: 'lib_website',
    ...getAdditionalProperties(scopeId)
  }));
}

export function mapMobileApps(mobileAppIds, getAdditionalProperties) {
  return mobileAppIds.map(({ scopeId, scopeRoleId }) => ({
    id: scopeId,
    scopeRoleId,
    type: types.MOBILE_APP,
    icon: 'lib_mobile_app',
    ...getAdditionalProperties(scopeId)
  }));
}

export function mapInfraDfq({ scopeId, scopeRoleId }, getAdditionalProperties) {
  return {
    id: 'infraDfq',
    label: scopeId,
    scopeRoleId,
    type: types.INFRA_DFQ,
    icon: 'lib_infrastructure_inverted',
    ...getAdditionalProperties()
  };
}
