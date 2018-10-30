import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { clusterList, serviceList, namespaceList } from 'in-kubernetes/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isClusterViewActive: isView(clusterList),
    isNamespaceViewActive: isView(namespaceList)
  },
  function KubernetesViewSwitcher({ isClusterViewActive, isNamespaceViewActive }) {
    return (
      <SecondLevelNavigation>
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = serviceList))}
          icon="lib_kubernetes_service"
          label="Services"
          isActive={!isClusterViewActive && !isNamespaceViewActive}
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = clusterList))}
          icon="lib_kubernetes_cluster"
          label="Clusters"
          isActive={isClusterViewActive}
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = namespaceList))}
          icon="lib_kubernetes_namespace"
          label="Namespaces"
          isActive={isNamespaceViewActive}
        />
      </SecondLevelNavigation>
    );
  }
);
