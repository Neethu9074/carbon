import React, { Fragment } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { clusterListFullyQualified, namespaceListFullyQualified } from 'in-kubernetes/navigation/paths';
import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isClusterViewActive: isView(clusterListFullyQualified),
    isNamespaceViewActive: isView(namespaceListFullyQualified)
  },
  function KubernetesViewSwitcher({ isClusterViewActive, isNamespaceViewActive }) {
    return (
      <Fragment>
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
        <TimeSelection />
      </Fragment>
    );
  }
);
