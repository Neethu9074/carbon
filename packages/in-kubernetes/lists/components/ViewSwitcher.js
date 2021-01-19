/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import { clusterListFullyQualified, namespaceListFullyQualified } from 'in-kubernetes/navigation/paths';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import UseBeeInstantToggle from 'in-infrastructure/Dashboard/components/UseBeeInstantToggle';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import DashboardHeader from 'in-new-components/DashboardHeader';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isClusterViewActive: isView(clusterListFullyQualified),
    isNamespaceViewActive: isView(namespaceListFullyQualified)
  },
  function KubernetesViewSwitcher({ isClusterViewActive, isNamespaceViewActive }) {
    return (
      <>
        <DashboardHeader
          icon="lib_kubernetes_inverted"
          label="Kubernetes"
          title="Kubernetes"
          renderTopLevelButtonLine={UseBeeInstantToggle}
        />
        <DashboardHeaderModule theme={themes.light}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = clusterListFullyQualified))}
              icon="lib_kubernetes_cluster"
              label="Clusters"
              isActive={isClusterViewActive}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = namespaceListFullyQualified))}
              icon="lib_kubernetes_namespace"
              label="Namespaces"
              isActive={isNamespaceViewActive}
            />
          </SecondLevelNavigation>
        </DashboardHeaderModule>
        <DashboardHeaderShadowModule />
      </>
    );
  }
);
