import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import { getServiceDashboard, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import getKubernetesServices from 'in-subscription/kubernetes/getKubernetesServices';

export default function TopServicesList({ clusterId, timeConfig }) {
  return (
    <KubernetesTopList
      title="Top Services"
      clusterId={clusterId}
      timeConfig={timeConfig}
      getItems={getKubernetesServices}
      getItemHref$={item => getServiceDashboard(item.id, { clusterId })}
      allItemsHref$={getClusterDashboard(clusterId, {
        tab: '/services'
      })}
      getItemLabel={item => item.name}
    />
  );
}
