import React from 'react';

import { getPodDashboard, getServiceDashboard } from 'in-kubernetes/navigation/paths';
import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';

export default function TopPodsList({ timeConfig, serviceId }) {
  return (
    <KubernetesTopList
      title="Matching Pods"
      serviceId={serviceId}
      timeConfig={timeConfig}
      metrics={['pod.phase']}
      labels={['Status']}
      formatters={[phaseFormatter]}
      getItems={getKubernetesPods}
      getItemHref$={item => getPodDashboard(item.pod.id, { serviceId })}
      allItemsHref$={getServiceDashboard(serviceId, {
        tab: '/pods'
      })}
      getItemLabel={item => item.pod.label}
    />
  );
}

function phaseFormatter(phase) {
  return phase;
}
