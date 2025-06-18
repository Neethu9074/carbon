/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import {
  useKubernetesNamespacesConfigs,
  useCombinedKubernetesClustersConfigs
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Platforms/hooks';
import {
  clusterListFullyQualified,
  namespaceListFullyQualified,
  exploreFullyQualified,
  clusterOtelListFullyQualified
} from 'in-kubernetes/navigation/paths';
import {
  kubernetesExploreEnabled,
  playwithEnabled,
  openTelemetryKubernetesUnifiedViewEnabled
} from 'in-services/featureFlags';
import KubernetesSourceSelector from 'in-kubernetes/lists/components/KubernetesSourceSelector/KubernetesSourceSelector';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function KubernetesViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isOtelCluster = matchLocation(clusterOtelListFullyQualified);
  const { k8s, otel } = useCombinedKubernetesClustersConfigs();
  const [namespaces] = useKubernetesNamespacesConfigs();
  const namespacesLabel = `${t('in-kubernetes:namespaces')} (${namespaces?.length ?? 0})`;
  const clusterLength = isOtelCluster ? otel?.data?.length : k8s?.data?.length;
  const clusterLabel = `${t('in-kubernetes:clusters')} (${clusterLength ?? 0})`;

  return (
    <>
      <DashboardHeader
        icon="lib_kubernetes_inverted"
        label={t('in-kubernetes:kubernetesHeader')}
        title={t('in-kubernetes:kubernetesHeader')}
        renderButtonLineSecondary={openTelemetryKubernetesUnifiedViewEnabled ? KubernetesSourceSelector : undefined}
      />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(clusterListFullyQualified)}
            icon="lib_kubernetes_cluster"
            label={clusterLabel}
            isActive={matchLocation(clusterListFullyQualified)}
          />
          {!isOtelCluster && (
            <SecondLevelNavigationItem
              href={createHrefToPath(namespaceListFullyQualified)}
              icon="lib_kubernetes_namespace"
              label={namespacesLabel}
              isActive={matchLocation(namespaceListFullyQualified)}
            />
          )}
          {kubernetesExploreEnabled && !playwithEnabled && !isOtelCluster && (
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
