/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const LinuxKVMHypervisorMainView = () =>
  import(/* webpackChunkName: "linuxkvmhypervisor" */ 'in-linux-kvm-hypervisor/LinuxKVMHypervisorMainView');
const HostDashboard = () =>
  import(/* webpackChunkName: "linuxkvmhypervisor" */ 'in-linux-kvm-hypervisor/Dashboards/Host/HostDashboard');
const VMDashboard = () =>
  import(/* webpackChunkName: "linuxkvmhypervisor" */ 'in-linux-kvm-hypervisor/Dashboards/VM/VMDashboard');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  linuxkvmhypervisor,
  hostDashboardFullyQualified,
  vmDashboardFullyQualified
} from 'in-linux-kvm-hypervisor/navigation/paths';
// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route key="hostDashboard" path={hostDashboardFullyQualified}>
    {renderAsyncRouteChildren(HostDashboard)}
  </Route>,
  <Route key="vmDashboard" path={vmDashboardFullyQualified}>
    {renderAsyncRouteChildren(VMDashboard)}
  </Route>,
  <Route key="linuxkvmhypervisorMainView" path={linuxkvmhypervisor}>
    {renderAsyncRouteChildren(LinuxKVMHypervisorMainView)}
  </Route>
];
