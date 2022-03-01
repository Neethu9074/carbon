/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import RegionDashboard from 'promise-loader?global,openstack!in-openstack/Dashboards/Regions/RegionDashboard';
import OpenstackMainView from 'promise-loader?global,openstack!in-openstack/OpenstackMainView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { regionDashboardFullyQualified } from 'in-openstack/navigation/paths';
import { openstack } from 'in-openstack/navigation/paths';

export default (
  <Fragment>
    <Route path={regionDashboardFullyQualified} component={createAsyncViewComponent(RegionDashboard)} />
    <Route path={openstack} component={createAsyncViewComponent(OpenstackMainView)} />
  </Fragment>
);
