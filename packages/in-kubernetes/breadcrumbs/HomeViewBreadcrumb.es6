import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { clusterListFullyQualified } from 'in-kubernetes/navigation/paths';
import { getView } from 'in-stores/navigation';

export default function HomeViewBreadcrumb() {
  return <Breadcrumb href$={getView(clusterListFullyQualified)}>Kubernetes</Breadcrumb>;
}
