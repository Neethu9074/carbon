/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { capitalize } from 'in-services/formatters/string';

interface Props {
  managedBy?: string;
  version?: string;
  clusterDistribution: string;
}

export default function getKubernetesIconAndLabel({ managedBy, version, clusterDistribution }: Props): {
  entityLabel?: string;
  iconType: string;
} {
  if (!managedBy && !version) {
    return {
      entityLabel: '',
      iconType: ''
    };
  }

  if (managedBy?.toLowerCase() === 'helm') {
    return {
      iconType: 'lib_helm',
      entityLabel: version
    };
  }

  if (managedBy?.toLowerCase() === 'kustomize') {
    return {
      iconType: 'lib_kustomize',
      entityLabel: version
    };
  }

  return {
    iconType: `lib_${clusterDistribution}`,
    entityLabel: capitalize(clusterDistribution)
  };
}
