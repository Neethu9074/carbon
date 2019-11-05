import React from 'react';

import DatacenterBreadcrumb from 'in-vsphere/breadcrumbs/DatacenterBreadcrumb';
import HomeViewBreadcrumb from 'in-vsphere/breadcrumbs/HomeViewBreadcrumb';

export function DatacenterBreadcrumbs(props) {
  const { datacenterId } = props;
  return [<HomeViewBreadcrumb />, datacenterId && <DatacenterBreadcrumb {...props} />];
}
