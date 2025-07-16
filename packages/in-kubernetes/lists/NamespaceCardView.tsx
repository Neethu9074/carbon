/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  cronJobsDashboard,
  deploymentsDashboard,
  namespaceList,
  podsDashboard,
  servicesDashboard,
  namespaceListFullyQualified,
  useGetNamespaceDashboard
} from 'in-kubernetes/navigation/paths';
// @ts-expect-error needs ts migration
import { getKubernetesNamespacesSubscribeEvent } from 'in-kubernetes/lists/NamespaceTable/NamespaceTable';
import ResourceCardList from 'in-kubernetes/lists/ResourceCardList/ResourceCardList';
import { CardProps, urlStateDefinition } from 'in-kubernetes/lists/utils';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

export default function NamespaceCardView() {
  const getHref = useGetNamespaceDashboard();

  const cardDefinitions: CardProps[] = [
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
      cardId: 'services',
      path: servicesDashboard,
      cardTitle: t('in-kubernetes:cloudNative.services')
    },
    {
      cardId: 'cronJobs',
      path: cronJobsDashboard,
      cardTitle: t('in-kubernetes:cloudNative.cronJobs')
    }
  ];

  return (
    <ResourceCardList
      pageTitle={t(`in-kubernetes:namespaces`)}
      pageRootName={pageNames.kubernetes_namespaces}
      cardDefinitions={cardDefinitions}
      urlStateDefinition={urlStateDefinition(namespaceList)}
      pathname={`${namespaceListFullyQualified}/table`}
      subscription={getKubernetesNamespacesSubscribeEvent}
      getHref={getHref}
    />
  );
}
