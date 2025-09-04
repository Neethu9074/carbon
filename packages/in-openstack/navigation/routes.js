/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

const HypervisorDashboard = () =>
  import(/* webpackChunkName: "openstack" */ 'in-openstack/Dashboards/Hypervisors/HypervisorDashboard');
const InstanceDashboard = () =>
  import(/* webpackChunkName: "openstack" */ 'in-openstack/Dashboards/Instances/InstanceDashboard');
const RegionDashboard = () =>
  import(/* webpackChunkName: "openstack" */ 'in-openstack/Dashboards/Regions/RegionDashboard');
const OpenstackMainView = () => import(/* webpackChunkName: "openstack" */ 'in-openstack/OpenstackMainView');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  regionDashboardFullyQualified,
  hypervisorDashboardFullyQualified,
  instanceDashboardFullyQualified
} from 'in-openstack/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { openstack } from 'in-openstack/navigation/paths';

export default [
  <Route
    key="openStackRegionDashboard"
    path={regionDashboardFullyQualified}
    children={renderAsyncRouteChildren(RegionDashboard)}
  />,
  <Route
    key="openStackHypervisorDashboard"
    path={hypervisorDashboardFullyQualified}
    children={renderAsyncRouteChildren(HypervisorDashboard)}
  />,
  <Route
    key="openStackInstanceDashboard"
    path={instanceDashboardFullyQualified}
    children={renderAsyncRouteChildren(InstanceDashboard)}
  />,
  <Route key="openStackMainView" path={openstack} children={renderAsyncRouteChildren(OpenstackMainView)} />
];
