import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';

export default function TopDeploymentsList(props) {
  return (
    <KubernetesTopList
      title="Top Deployments"
      viewAllEntityName="deployment"
      {...props}
      getItems={getKubernetesDeployments}
      getItemHref$={item =>
        getDeploymentDashboard(item.deployment.id, {
          clusterId: props.clusterId,
          namespaceId: props.namespaceId
        })
      }
      allItemsHref$={props.allItemsHref$}
      getItemLabel={item => item.deployment.name}
    />
  );
}
