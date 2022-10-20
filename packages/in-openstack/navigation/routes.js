/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import HypervisorDashboard from 'promise-loader?global,openstack!in-openstack/Dashboards/Hypervisors/HypervisorDashboard';
import InstanceDashboard from 'promise-loader?global,openstack!in-openstack/Dashboards/Instances/InstanceDashboard';
import RegionDashboard from 'promise-loader?global,openstack!in-openstack/Dashboards/Regions/RegionDashboard';
import OpenstackMainView from 'promise-loader?global,openstack!in-openstack/OpenstackMainView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  regionDashboardFullyQualified,
  hypervisorDashboardFullyQualified,
  instanceDashboardFullyQualified
} from 'in-openstack/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { openstack } from 'in-openstack/navigation/paths';

export default (
  <Fragment>
    <Route path={regionDashboardFullyQualified} children={renderAsyncRouteChildren(RegionDashboard)} />
    <Route path={hypervisorDashboardFullyQualified} children={renderAsyncRouteChildren(HypervisorDashboard)} />
    <Route path={instanceDashboardFullyQualified} children={renderAsyncRouteChildren(InstanceDashboard)} />
    <Route path={openstack} children={renderAsyncRouteChildren(OpenstackMainView)} />
  </Fragment>
);
