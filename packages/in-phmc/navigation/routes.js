/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { phmcDashboardFullyQualified, systemDashboardFullyQualified } from 'in-phmc/navigation/paths';
import SystemDashboard from 'promise-loader?global,phmc!in-phmc/Dashboards/Systems/SystemDashboard';
import PhmcDashboard from 'promise-loader?global,phmc!in-phmc/Dashboards/Phmc/PhmcDashboard';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import PhmcMainView from 'promise-loader?global,phmc!in-phmc/PhmcMainView';
import { ibmp } from 'in-phmc/navigation/paths';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';


export default (
  <Fragment>
    <Route path={phmcDashboardFullyQualified} component={createAsyncViewComponent(PhmcDashboard)} />
    <Route path={systemDashboardFullyQualified} component={createAsyncViewComponent(SystemDashboard)} />
    <Route path={ibmp} component={createAsyncViewComponent(PhmcMainView)} />
  </Fragment>
);
