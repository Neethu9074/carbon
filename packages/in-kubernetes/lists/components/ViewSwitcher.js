/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  clusterListFullyQualified,
  namespaceListFullyQualified,
  exploreFullyQualified,
  k8sTeamFullyQualified
} from 'in-kubernetes/navigation/paths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { kubernetesExploreEnabled, kubernetesTeamEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function KubernetesViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();

  return (
    <>
      <DashboardHeader
        icon="lib_kubernetes_inverted"
        label={t('in-kubernetes:kubernetesHeader')}
        title={t('in-kubernetes:kubernetesHeader')}
      />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(clusterListFullyQualified)}
            icon="lib_kubernetes_cluster"
            label={t('in-kubernetes:clusters')}
            isActive={matchLocation(clusterListFullyQualified)}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(namespaceListFullyQualified)}
            icon="lib_kubernetes_namespace"
            label={t('in-kubernetes:namespaces')}
            isActive={matchLocation(namespaceListFullyQualified)}
          />
          {kubernetesExploreEnabled && (
            <SecondLevelNavigationItem
              href={createHrefToPath(exploreFullyQualified)}
              icon="lib_kubernetes"
              label={t('in-kubernetes:explore')}
              isActive={matchLocation(exploreFullyQualified)}
            />
          )}
          {kubernetesTeamEnabled && (
            <SecondLevelNavigationItem
              href={createHrefToPath(k8sTeamFullyQualified)}
              icon="lib_kubernetes"
              label={t('in-kubernetes:k8sTeam')}
              isActive={matchLocation(k8sTeamFullyQualified)}
            />
          )}
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
