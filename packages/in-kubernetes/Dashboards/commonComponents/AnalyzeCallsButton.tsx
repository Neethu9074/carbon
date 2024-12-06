/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { type as typeTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { Group } from 'in-types';
import { t } from 'in-i18n';

interface AnalyzeCallsProps {
  clusterName: string;
  namespaceName: string;
  daemonSetName: string;
  deploymentName: string;
  deploymentConfigName: string;
  serviceName: string;
  statefulSetName: string;
  podName: string;
  groupBy: Partial<Group>;
}

export default function AnalyzeCallsButton({
  clusterName,
  namespaceName,
  daemonSetName,
  deploymentName,
  deploymentConfigName,
  serviceName,
  statefulSetName,
  podName,
  groupBy
}: AnalyzeCallsProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <Button
      kind="action"
      icon="lib_application_call"
      href={getLinkToApplicationAnalyze({
        dataSource: 'calls',
        formModel: getFormModel({
          clusterName,
          namespaceName,
          daemonSetName,
          deploymentName,
          deploymentConfigName,
          serviceName,
          statefulSetName,
          podName
        }),
        groupBy
      })}
      size="compact"
    >
      {t('in-kubernetes:dashboards.analyzeCalls')}
    </Button>
  );
}

function getFormModel(params: Omit<AnalyzeCallsProps, 'groupBy'>) {
  const tagFilters = getFilters(params).map(tagFilter => ({ type: typeTagFilter, ...tagFilter }));

  // @ts-expect-error
  return joinExpressions({ expressions: tagFilters });
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
}: Omit<AnalyzeCallsProps, 'groupBy'>) {
  const filters = [];

  if (clusterName) {
    const clusterNameSuffix = ' (cluster)';
    if (clusterName.endsWith(clusterNameSuffix)) {
      clusterName = clusterName.replace(clusterNameSuffix, '');
    }
    filters.push({ name: 'kubernetes.cluster.name', value: clusterName, operator: 'EQUALS', entity: 'DESTINATION' });
  }

  if (namespaceName) {
    filters.push({
      name: 'kubernetes.namespace.name',
      value: namespaceName,
      operator: 'EQUALS',
      entity: 'DESTINATION'
    });
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
