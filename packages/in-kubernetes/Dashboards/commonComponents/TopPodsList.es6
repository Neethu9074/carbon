import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';

export default function TopPodsList(props) {
  return (
    <KubernetesTopList
      title="Top Pods"
      {...props}
      metrics={['phase']}
      getItems={getKubernetesPods}
      getItemHref$={item =>
        getPodDashboard(item.pod.id, {
          clusterId: props.clusterId,
          namespaceId: props.namespaceId
        })
      }
      allItemsHref$={props.allItemsHref$}
      getItemLabel={item => item.pod.label}
      renderMetric={props => props.item.pod.phase}
    />
  );
}
