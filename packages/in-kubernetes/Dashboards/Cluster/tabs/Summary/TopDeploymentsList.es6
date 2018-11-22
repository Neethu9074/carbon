import React from 'react';

import { getDeploymentDashboard, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';

export default function TopDeploymentsList({ clusterId, timeConfig }) {
  return (
    <KubernetesTopList
      title="Top Deployments"
      clusterId={clusterId}
      timeConfig={timeConfig}
      getItems={getKubernetesDeployments}
      getItemHref$={item => getDeploymentDashboard(item.deployment.id, { clusterId })}
      allItemsHref$={getClusterDashboard(clusterId, {
        tab: '/deployments'
      })}
      getItemLabel={item => item.deployment.name}
    />
  );
}
