import React from 'react';

import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';

export default function AnalyzeCallsButton({
  clusterName,
  namespaceName,
  deploymentName,
  deploymentConfigName,
  serviceName,
  podName,
  groupByTag
}) {
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href$={getLinkToAnalyze({
        dataSource: 'calls',
        filters: getFilters(clusterName, namespaceName, deploymentName, deploymentConfigName, serviceName, podName),
        groupByTag: groupByTag ? groupByTag : {}
      })}
    >
      Analyze Calls
    </Button>
  );
}

export function getFilters(clusterName, namespaceName, deploymentName, deploymentConfigName, serviceName, podName) {
  const filters = [];

  if (clusterName) {
    const clusterNameSuffix = ' (cluster)';
    if (clusterName.endsWith(clusterNameSuffix)) {
      clusterName = clusterName.replace(clusterNameSuffix, '');
    }
    filters.push({ name: 'kubernetes.cluster.name', value: clusterName, operator: 'EQUALS', entity: 'DESTINATION' });
  }

  if (namespaceName) {
    filters.push({ name: 'kubernetes.namespace', value: namespaceName, operator: 'EQUALS', entity: 'DESTINATION' });
  }

  if (deploymentName) {
    filters.push({
      name: 'kubernetes.deployment.name',
      value: deploymentName,
      operator: 'EQUALS',
      entity: 'DESTINATION'
    });
  }

  if (deploymentConfigName) {
    filters.push({
      name: 'openshift.deploymentconfig.name',
      value: deploymentConfigName,
      operator: 'EQUALS',
      entity: 'DESTINATION'
    });
  }

  if (serviceName) {
    filters.push({ name: 'kubernetes.service.name', value: serviceName, operator: 'EQUALS', entity: 'DESTINATION' });
  }

  if (podName) {
    filters.push({ name: 'kubernetes.pod.name', value: podName, operator: 'EQUALS', entity: 'DESTINATION' });
  }

  return filters;
}
