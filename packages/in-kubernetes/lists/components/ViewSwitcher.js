/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  clusterListFullyQualified,
  namespaceListFullyQualified,
  exploreFullyQualified
} from 'in-kubernetes/navigation/paths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { kubernetesExploreEnabled } from 'in-services/featureFlags';
import DashboardHeader from 'in-components/DashboardHeader';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    isClusterViewActive: isView(clusterListFullyQualified),
    isNamespaceViewActive: isView(namespaceListFullyQualified),
    isExploreViewActive: isView(exploreFullyQualified)
  },
  function KubernetesViewSwitcher({ isClusterViewActive, isNamespaceViewActive, isExploreViewActive }) {
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
              href$={getModifiedUrlStream(p => (p.pathname = clusterListFullyQualified))}
              icon="lib_kubernetes_cluster"
              label={t('in-kubernetes:clusters')}
              isActive={isClusterViewActive}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = namespaceListFullyQualified))}
              icon="lib_kubernetes_namespace"
              label={t('in-kubernetes:namespaces')}
              isActive={isNamespaceViewActive}
            />
            {kubernetesExploreEnabled && (
              <SecondLevelNavigationItem
                href$={getModifiedUrlStream(p => (p.pathname = exploreFullyQualified))}
                icon="lib_kubernetes"
                label={t('in-kubernetes:explore')}
                isActive={isExploreViewActive}
              />
            )}
          </SecondLevelNavigation>
        </DashboardHeaderModule>
        <DashboardHeaderShadowModule />
      </>
    );
  }
);
