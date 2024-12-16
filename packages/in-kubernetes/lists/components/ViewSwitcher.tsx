/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import {
  useKubernetesClustersConfigs,
  useKubernetesNamespacesConfigs
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Platforms/hooks';
import {
  clusterListFullyQualified,
  namespaceListFullyQualified,
  exploreFullyQualified
} from 'in-kubernetes/navigation/paths';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { kubernetesExploreEnabled, playwithEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function KubernetesViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const [clusters] = useKubernetesClustersConfigs();
  const [namespaces] = useKubernetesNamespacesConfigs();
  const clusterLabel = `${t('in-kubernetes:clusters')} (${clusters?.length ?? 0})`;
  const namespacesLabel = `${t('in-kubernetes:namespaces')} (${namespaces?.length ?? 0})`;

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
            label={clusterLabel}
            isActive={matchLocation(clusterListFullyQualified)}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(namespaceListFullyQualified)}
            icon="lib_kubernetes_namespace"
            label={namespacesLabel}
            isActive={matchLocation(namespaceListFullyQualified)}
          />
          {kubernetesExploreEnabled && !playwithEnabled && (
            <SecondLevelNavigationItem
              href={createHrefToPath(exploreFullyQualified)}
              icon="lib_kubernetes"
              label={t('in-kubernetes:explore')}
              isActive={matchLocation(exploreFullyQualified)}
            />
          )}
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
