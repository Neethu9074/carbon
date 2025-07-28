/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import HostBreadcrumb, { HostBreadcrumbProps } from 'in-linux-kvm-hypervisor/breadcrumbs/HostBreadcrumb';
import VMBreadcrumb, { VMBreadcrumbProps } from 'in-linux-kvm-hypervisor/breadcrumbs/VMBreadcrumb';
import HomeViewBreadcrumb from 'in-linux-kvm-hypervisor/breadcrumbs/HomeViewBreadcrumb';

export function HostBreadcrumbs(props: HostBreadcrumbProps) {
  const { hostId } = props;
  return [<HomeViewBreadcrumb />, hostId && <HostBreadcrumb {...props} />];
}

export function VMBreadcrumbs(props: VMBreadcrumbProps) {
  const { vmId, hostId } = props;
  return [<HomeViewBreadcrumb />, hostId && <HostBreadcrumb {...props} />, vmId && <VMBreadcrumb {...props} />];
}
