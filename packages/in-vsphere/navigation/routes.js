/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import DatacenterDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Datacenter/DatacenterDashboard';
import HostDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Host/HostDashboard';
import VmDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Vm/VmDashboard';
import VSphereMainView from 'promise-loader?global,vsphere!in-vsphere/VSphereMainView';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  datacenterDashboardFullyQualified,
  hostDashboardFullyQualified,
  vmDashboardFullyQualified
} from 'in-vsphere/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { vsphere } from 'in-vsphere/navigation/paths';

export default [
  <Route
    key="vsphereDatacenterDashboard"
    path={datacenterDashboardFullyQualified}
    children={renderAsyncRouteChildren(DatacenterDashboard)}
  />,
  <Route
    key="vsphereHostDashboard"
    path={hostDashboardFullyQualified}
    children={renderAsyncRouteChildren(HostDashboard)}
  />,
  <Route key="vsphereVmDashboard" path={vmDashboardFullyQualified} children={renderAsyncRouteChildren(VmDashboard)} />,
  <Route key="vsphereMainView" path={vsphere} children={renderAsyncRouteChildren(VSphereMainView)} />
];
