import React from 'react';

import { datacenterListFullyQualified } from 'in-vsphere/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';

export default function HomeViewBreadcrumb() {
  return <Breadcrumb href$={getView(datacenterListFullyQualified)}>vSphere Datacenters</Breadcrumb>;
}
