import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import ClusterDashboard from 'promise-loader?global,vsphere!in-vsphere/Dashboards/Application/ClusterDashboard';
import VSphereMainView from 'promise-loader?global,vsphere!in-vsphere/VSphereMainView';

import { clusterDashboardFullyQualified, vsphere } from 'in-vsphere/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

export default (
  <Fragment>
    <Route path={clusterDashboardFullyQualified} component={createAsyncViewComponent(ClusterDashboard)} />
    <Route path={vsphere} component={createAsyncViewComponent(VSphereMainView)} />
  </Fragment>
);
