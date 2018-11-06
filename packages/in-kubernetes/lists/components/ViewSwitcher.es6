import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { clusterList, namespaceList } from 'in-kubernetes/navigation/paths';
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
