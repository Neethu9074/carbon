/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  clusterOtelListFullyQualified,
  nodesDashboard,
  podsDashboard,
  containersDashboard,
  useGetClusterDashboard,
  clusterList
} from 'in-kubernetes/navigation/paths';
import { getOtelKubernetesClustersWithDefaults } from 'in-kubernetes/subscriptions/getOtelKubernetesClusters';
import ResourceCardList from 'in-kubernetes/lists/ResourceCardList/ResourceCardList';
import { CardProps, urlStateDefinition } from 'in-kubernetes/lists/utils';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

export default function OtelCluster() {
  const getHref = useGetClusterDashboard('otelcluster');

  const cardDefinitions: CardProps[] = [
    {
      cardId: 'otelNodes',
      path: nodesDashboard,
      cardTitle: t('in-kubernetes:cloudNative.nodes'),
      displaySubtitle: false
    },
    {
      cardId: 'otelPods',
      path: `${podsDashboard};pod.phase=Running~`,
      cardTitle: t('in-kubernetes:cloudNative.pods'),
      displaySubtitle: false
    },
    {
      cardId: 'otelContainers',
      path: containersDashboard,
      cardTitle: t('in-kubernetes:cloudNative.containers'),
      displaySubtitle: false
    }
  ];

  return (
    <ResourceCardList
      pageTitle={t(`in-kubernetes:clusters`)}
      pageRootName={pageNames.kubernetes_clusters}
      cardDefinitions={cardDefinitions}
      urlStateDefinition={urlStateDefinition(clusterList)}
      pathname={`${clusterOtelListFullyQualified}/table`}
      subscription={getOtelKubernetesClustersWithDefaults}
      getHref={getHref}
    />
  );
}
