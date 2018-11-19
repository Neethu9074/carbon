import React from 'react';

import { getNamespaceDashboard, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import DeploymentBreadcrumb from 'in-kubernetes/breadcrumbs/DeploymentBreadcrumb';
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
  const { nodeId, clusterId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    nodeId && <NodeBreadcrumb {...props} />
  ];
}

export function PodBreadcrumbs(props) {
  const { podId, clusterId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    podId && <PodBreadcrumb {...props} />
  ];
}

export function DeploymentBreadcrumbs(props) {
  const { deploymentId, clusterId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    deploymentId && <DeploymentBreadcrumb {...props} />
  ];
}
