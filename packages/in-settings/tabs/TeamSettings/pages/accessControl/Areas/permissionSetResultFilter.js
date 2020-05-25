export function mapApplications(applications, applicationIds, getAdditionalProperties) {
  const applicationsMap = getAsMap(applications);
  return applicationIds.map(id => ({
    id,
    label: getLabelIfPreset(applicationsMap, id),
    type: 'application',
    icon: 'lib_application',
    ...getAdditionalProperties(id)
  }));
}

export function mapKubernetesClusters(k8sClusters, kubernetesClusterUUIDs, getAdditionalProperties) {
  const clustersMap = getAsMap(k8sClusters);
  return kubernetesClusterUUIDs.map(id => ({
    id,
    label: getLabelIfPreset(clustersMap, id),
    type: 'Kubernetes Cluster',
    icon: 'lib_kubernetes_cluster',
    ...getAdditionalProperties(id)
  }));
}

export function mapKubernetesNamespaces(k8sNamespaces, kubernetesNamespaceUIDs, getAdditionalProperties) {
  const namespacesMap = getAsMap(k8sNamespaces);
  return kubernetesNamespaceUIDs.map(id => ({
    id,
    label: getLabelIfPreset(namespacesMap, id),
    type: 'Kubernetes Namespace',
    icon: 'lib_kubernetes_namespace',
    ...getAdditionalProperties(id)
  }));
}

export function mapWebsites(websites, websiteIds, getAdditionalProperties) {
  const websitesMap = getAsMap(websites);
  return websiteIds.map(id => ({
    id,
    label: getLabelIfPreset(websitesMap, id),
    type: 'Website',
    icon: 'lib_website',
    ...getAdditionalProperties(id)
  }));
}

export function mapMobileApps(mobileApps, mobileAppIds, getAdditionalProperties) {
  const mobileAppsMap = getAsMap(mobileApps);
  return mobileAppIds.map(id => ({
    id,
    label: getLabelIfPreset(mobileAppsMap, id),
    type: 'Mobile App',
    icon: 'lib_mobile_app',
    ...getAdditionalProperties(id)
  }));
}

export function mapInfraDfq(infraDfqFilter, getAdditionalProperties) {
  if (!infraDfqFilter) {
    return null;
  }
  return {
    id: 'infraDfq',
    label: infraDfqFilter,
    type: 'Infrastructure Dynamic Focus Query',
    icon: 'lib_actions_search',
    ...getAdditionalProperties()
  };
}

function getAsMap(items) {
  const map = new Map();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    map.set(item.id, item);
  }
  return map;
}

function getLabelIfPreset(map, id) {
  if (map.has(id)) {
    return map.get(id).label;
  }
}
