import React from 'react';

import NamespaceBreadcrumb from 'in-kubernetes/breadcrumbs/NamespaceBreadcrumb';
import HomeViewBreadcrumb from 'in-kubernetes/breadcrumbs/HomeViewBreadcrumb';
import ClusterBreadcrumb from 'in-kubernetes/breadcrumbs/ClusterBreadcrumb';
import ServiceBreadcrumb from 'in-kubernetes/breadcrumbs/ServiceBreadcrumb';

export function ClusterBreadcrumbs(props) {
  const { clusterId } = props;
  return [<HomeViewBreadcrumb />, clusterId && <ClusterBreadcrumb {...props} />];
}

export function NamespaceBreadcrumbs(props) {
  const { namespaceId } = props;
  return [<HomeViewBreadcrumb />, namespaceId && <NamespaceBreadcrumb {...props} />];
}

export function ServiceBreadcrumbs(props) {
  const { serviceId } = props;
  return [<HomeViewBreadcrumb />, serviceId && <ServiceBreadcrumb {...props} />];
}
