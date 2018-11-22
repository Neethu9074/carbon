import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import { getNamespaceDashboard, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';

export default function TopNamespacesList({ clusterId, timeConfig }) {
  return (
    <KubernetesTopList
      title="Top Namespaces"
      clusterId={clusterId}
      timeConfig={timeConfig}
      getItems={getKubernetesNamespaces}
      getItemHref$={item => getNamespaceDashboard(item.namespace.id, { clusterId })}
      allItemsHref$={getClusterDashboard(clusterId, {
        tab: '/namespaces'
      })}
      getItemLabel={item => item.namespace.label}
    />
  );
}
