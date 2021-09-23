/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import SystemDashboard from 'promise-loader?global,zhmc!in-zhmc/Dashboards/Systems/SystemDashboard';
import ZhmcDashboard from 'promise-loader?global,zhmc!in-zhmc/Dashboards/Zhmc/ZhmcDashboard';
import ZhmcMainView from 'promise-loader?global,zhmc!in-zhmc/ZhmcMainView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { zhmcDashboardFullyQualified, cpcDashboardFullyQualified } from 'in-zhmc/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { ibmz } from 'in-zhmc/navigation/paths';

export default (
  <Fragment>
    <Route path={zhmcDashboardFullyQualified} component={createAsyncViewComponent(ZhmcDashboard)} />
    <Route path={cpcDashboardFullyQualified} component={createAsyncViewComponent(SystemDashboard)} />
    <Route path={ibmz} component={createAsyncViewComponent(ZhmcMainView)} />
  </Fragment>
);
