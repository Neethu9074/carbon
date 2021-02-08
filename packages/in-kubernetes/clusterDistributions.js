/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export function isOpenshift(clusterDistribution) {
  return clusterDistribution === 'openshift';
}

export function clusterBadgeName(clusterDistribution) {
  switch (clusterDistribution) {
    case 'openshift':
      return t('in-kubernetes:clusterBadgeNameOpenShift');
    case 'kubernetes':
      return t('in-kubernetes:clusterBadgeNameK8s');
    default:
      return clusterDistribution.toUpperCase();
  }
}
