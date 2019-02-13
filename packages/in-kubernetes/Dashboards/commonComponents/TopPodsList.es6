import { get } from 'lodash';
import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import PodPhase from 'in-kubernetes/Dashboards/commonComponents/PodPhase';
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
      renderMetric={props => <PodPhase status={get(props.item.pod, ['status', 'phase'])} />}
    />
  );
}
