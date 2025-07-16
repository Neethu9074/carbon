/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  cronJobsDashboard,
  deploymentsDashboard,
  useGetClusterDashboard,
  nodesDashboard,
  podsDashboard,
  servicesDashboard,
  clusterList,
  clusterListFullyQualified,
  namespaceList
} from 'in-kubernetes/navigation/paths';
import { getKubernetesClustersWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import ResourceCardList from 'in-kubernetes/lists/ResourceCardList/ResourceCardList';
import { CardProps, urlStateDefinition } from 'in-kubernetes/lists/utils';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

export default function ClusterCardView() {
  const getHref = useGetClusterDashboard('cluster');

  const cardDefinitions: CardProps[] = [
    {
      cardId: 'unhealthyNodes',
      path: nodesDashboard,
      cardTitle: t('in-kubernetes:cloudNative.unhealthyNodes')
    },
    {
      cardId: 'unhealthyDeployments',
      path: deploymentsDashboard,
      cardTitle: t('in-kubernetes:cloudNative.unhealthyDeployments')
    },
    {
      cardId: 'runningPods',
      path: `${podsDashboard};pod.phase=Running~`,
      cardTitle: t('in-kubernetes:cloudNative.runningPods')
    },
    {
      cardId: 'namespaces',
      path: namespaceList,
      cardTitle: t('in-kubernetes:cloudNative.namespaces'),
      displaySubtitle: false
    },
    {
      cardId: 'services',
      path: servicesDashboard,
      cardTitle: t('in-kubernetes:cloudNative.services'),
      displaySubtitle: false
    },
    {
      cardId: 'cronJobs',
      path: cronJobsDashboard,
      cardTitle: t('in-kubernetes:cloudNative.cronJobs'),
      displaySubtitle: false
    }
  ];

  return (
    <ResourceCardList
      pageTitle={t(`in-kubernetes:clusters`)}
      pageRootName={pageNames.kubernetes_clusters}
      cardDefinitions={cardDefinitions}
      urlStateDefinition={urlStateDefinition(clusterList)}
      pathname={`${clusterListFullyQualified}/table`}
      subscription={getKubernetesClustersWithDefaults}
      getHref={getHref}
    />
  );
}
