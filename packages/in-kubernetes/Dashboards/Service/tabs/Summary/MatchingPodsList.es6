import React from 'react';

import { getPodDashboard, getServiceDashboard } from 'in-kubernetes/navigation/paths';
import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import PodPhase from 'in-kubernetes/Dashboards/commonComponents/PodPhase';

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
      renderMetric={props => <PodPhase status={props.item.pod.status.phase} />}
    />
  );
}

function phaseFormatter(phase) {
  return phase;
}
