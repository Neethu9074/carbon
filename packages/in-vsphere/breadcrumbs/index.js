import React from 'react';

import DatacenterBreadcrumb from 'in-vsphere/breadcrumbs/DatacenterBreadcrumb';
import HomeViewBreadcrumb from 'in-vsphere/breadcrumbs/HomeViewBreadcrumb';

export function DatacenterBreadcrumbs(props) {
  const { applicationId } = props;
  return [<HomeViewBreadcrumb />, applicationId && <DatacenterBreadcrumb {...props} />];
}
