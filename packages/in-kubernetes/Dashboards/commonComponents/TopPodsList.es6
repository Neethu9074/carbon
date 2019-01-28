import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import PodStatus from 'in-kubernetes/Dashboards/commonComponents/PodStatus';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';

export default function TopPodsList(props) {
  return (
    <KubernetesTopList
      title="Top Pods"
      viewAllEntityName="pods"
      {...props}
      metrics={['status']}
      metricOrderDirection="ASC"
      labels={['Status']}
      getItems={getKubernetesPods}
      getItemHref$={item =>
        getPodDashboard(item.pod.id, {
          clusterId: props.clusterId,
          namespaceId: props.namespaceId
        })
      }
      allItemsHref$={props.allItemsHref$}
      getItemLabel={item => item.pod.label}
      renderMetric={props => <PodStatus status={props.item.pod.phase} />}
    />
  );
}
