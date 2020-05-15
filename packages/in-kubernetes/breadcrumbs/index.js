import React from 'react';

import { getNamespaceDashboard, getClusterDashboard, getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import WorkloadControllerBreadcrumb from 'in-kubernetes/breadcrumbs/WorkloadControllerBreadcrumb';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import NamespaceBreadcrumb from 'in-kubernetes/breadcrumbs/NamespaceBreadcrumb';
import HomeViewBreadcrumb from 'in-kubernetes/breadcrumbs/HomeViewBreadcrumb';
import ClusterBreadcrumb from 'in-kubernetes/breadcrumbs/ClusterBreadcrumb';
import ServiceBreadcrumb from 'in-kubernetes/breadcrumbs/ServiceBreadcrumb';
import NodeBreadcrumb from 'in-kubernetes/breadcrumbs/NodeBreadcrumb';
import PodBreadcrumb from 'in-kubernetes/breadcrumbs/PodBreadcrumb';

export function ClusterBreadcrumbs(props) {
  const { clusterId } = props;
  return [<HomeViewBreadcrumb />, clusterId && <ClusterBreadcrumb {...props} />];
}

export function NamespaceBreadcrumbs(props) {
  const { namespaceId, clusterId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} />
  ];
}

export function ServiceBreadcrumbs(props) {
  const { serviceId, namespaceId, clusterId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    serviceId && <ServiceBreadcrumb {...props} />
  ];
}

export function NodeBreadcrumbs(props) {
  const { nodeId, clusterId, namespaceId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    nodeId && <NodeBreadcrumb {...props} />
  ];
}

export function PodBreadcrumbs(props) {
  const { podId, clusterId, namespaceId, deploymentId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    deploymentId && (
      <WorkloadControllerBreadcrumb
        {...props}
        href$={getDeploymentDashboard(deploymentId)}
        workloadControllerId={deploymentId}
        workloadControllerSubscriptionName={getKubernetesDeployment}
      />
    ),
    podId && <PodBreadcrumb {...props} />
  ];
}

export function WorkloadControllerBreadcrumbs(props) {
  const { workloadControllerId, clusterId, namespaceId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    workloadControllerId && <WorkloadControllerBreadcrumb {...props} />
  ];
}
