/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function isOpenshift(clusterDistribution) {
  return clusterDistribution === 'openshift';
}

export function clusterBadgeName(clusterDistribution) {
  switch (clusterDistribution) {
    case 'openshift':
      return 'OpenShift';
    case 'kubernetes':
      return 'K8s';
    default:
      return clusterDistribution.toUpperCase();
  }
}
