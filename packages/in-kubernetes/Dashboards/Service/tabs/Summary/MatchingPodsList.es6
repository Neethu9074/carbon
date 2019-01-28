import React from 'react';

import { getPodDashboard, getServiceDashboard } from 'in-kubernetes/navigation/paths';
import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import PodStatus from 'in-kubernetes/Dashboards/commonComponents/PodStatus';

export default function MatchingPodsList({ timeConfig, serviceId }) {
  return (
    <KubernetesTopList
      title="Matching Pods"
      serviceId={serviceId}
      timeConfig={timeConfig}
      metrics={['status']}
      metricOrderDirection="ASC"
      labels={['Status']}
      formatters={[phaseFormatter]}
      getItems={getKubernetesPods}
      getItemHref$={item => getPodDashboard(item.pod.id, { serviceId })}
      allItemsHref$={getServiceDashboard(serviceId, {
        tab: '/pods'
      })}
      getItemLabel={item => item.pod.label}
      renderMetric={props => <PodStatus status={props.item.pod.phase} />}
    />
  );
}

function phaseFormatter(phase) {
  return phase;
}
