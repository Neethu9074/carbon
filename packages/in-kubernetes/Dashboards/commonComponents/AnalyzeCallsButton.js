/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';

export default function AnalyzeCallsButton({
  clusterName,
  namespaceName,
  daemonSetName,
  deploymentName,
  deploymentConfigName,
  serviceName,
  statefulSetName,
  podName,
  groupByTag
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href$={
        tagCatalog &&
        getLinkToAnalyze({
          dataSource: 'calls',
          filters: getFilters({
            clusterName,
            namespaceName,
            daemonSetName,
            deploymentName,
            deploymentConfigName,
            serviceName,
            statefulSetName,
            podName
          }),
          tagCatalog,
          groupByTag: groupByTag ? groupByTag : {}
        })
      }
    >
      {t('in-kubernetes:dashboards.analyzeCalls')}
    </Button>
  );
}

export function getFilters({
  clusterName,
  namespaceName,
  daemonSetName,
  deploymentName,
  deploymentConfigName,
  serviceName,
  statefulSetName,
  podName
}) {
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

  if (daemonSetName) {
    filters.push({
      name: 'kubernetes.daemonset.name',
      value: daemonSetName,
      operator: 'EQUALS',
      entity: 'DESTINATION'
    });
  }

  if (statefulSetName) {
    filters.push({
      name: 'kubernetes.statefulset.name',
      value: statefulSetName,
      operator: 'EQUALS',
      entity: 'DESTINATION'
    });
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
    filters.push({
      name: 'kubernetes.service.name',
      value: serviceName,
      operator: 'EQUALS',
      entity: 'DESTINATION'
    });
  }

  if (podName) {
    filters.push({
      name: 'kubernetes.pod.name',
      value: podName,
      operator: 'EQUALS',
      entity: 'DESTINATION'
    });
  }

  return filters;
}
