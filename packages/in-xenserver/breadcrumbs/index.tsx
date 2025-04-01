/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import HostBreadcrumb, { HostBreadcrumbProps } from 'in-xenserver/breadcrumbs/HostBreadcrumb';
import HomeViewBreadcrumb from 'in-xenserver/breadcrumbs/HomeViewBreadcrumb';

export function HostBreadcrumbs(props: HostBreadcrumbProps) {
  const { hostId } = props;
  return [<HomeViewBreadcrumb />, hostId && <HostBreadcrumb {...props} />];
}
