import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import DatacenterDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Datacenter/DatacenterDashboard';
import HostDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Host/HostDashboard';
import VSphereMainView from 'promise-loader?global,vsphere!in-vsphere/VSphereMainView';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { datacenterDashboardFullyQualified, hostDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import { vsphere } from 'in-vsphere/navigation/paths';

export default (
  <Fragment>
    <Route path={datacenterDashboardFullyQualified} component={createAsyncViewComponent(DatacenterDashboard)} />
    <Route path={hostDashboardFullyQualified} component={createAsyncViewComponent(HostDashboard)} />
    <Route path={vsphere} component={createAsyncViewComponent(VSphereMainView)} />
  </Fragment>
);
