/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  datacenterDashboardFullyQualified,
  hostDashboardFullyQualified,
  vmDashboardFullyQualified
} from 'in-vsphere/navigation/paths';
import DatacenterDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Datacenter/DatacenterDashboard';
import HostDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Host/HostDashboard';
import VmDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Vm/VmDashboard';
import VSphereMainView from 'promise-loader?global,vsphere!in-vsphere/VSphereMainView';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { vsphere } from 'in-vsphere/navigation/paths';

export default (
  <Fragment>
    <Route path={datacenterDashboardFullyQualified} component={createAsyncViewComponent(DatacenterDashboard)} />
    <Route path={hostDashboardFullyQualified} component={createAsyncViewComponent(HostDashboard)} />
    <Route path={vmDashboardFullyQualified} component={createAsyncViewComponent(VmDashboard)} />
    <Route path={vsphere} component={createAsyncViewComponent(VSphereMainView)} />
  </Fragment>
);
