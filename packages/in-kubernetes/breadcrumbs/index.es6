import React from 'react';

import { getNamespaceDashboard, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import NamespaceBreadcrumb from 'in-kubernetes/breadcrumbs/NamespaceBreadcrumb';
import HomeViewBreadcrumb from 'in-kubernetes/breadcrumbs/HomeViewBreadcrumb';
import ClusterBreadcrumb from 'in-kubernetes/breadcrumbs/ClusterBreadcrumb';
import ServiceBreadcrumb from 'in-kubernetes/breadcrumbs/ServiceBreadcrumb';

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
