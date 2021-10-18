/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import SystemDashboard from 'promise-loader?global,phmc!in-phmc/Dashboards/Systems/SystemDashboard';
import PhmcDashboard from 'promise-loader?global,phmc!in-phmc/Dashboards/Phmc/PhmcDashboard';
import PhmcMainView from 'promise-loader?global,phmc!in-phmc/PhmcMainView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { phmcDashboardFullyQualified, systemDashboardFullyQualified } from 'in-phmc/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { ibmp } from 'in-phmc/navigation/paths';

export default (
  <Fragment>
    <Route path={phmcDashboardFullyQualified} component={createAsyncViewComponent(PhmcDashboard)} />
    <Route path={systemDashboardFullyQualified} component={createAsyncViewComponent(SystemDashboard)} />
    <Route path={ibmp} component={createAsyncViewComponent(PhmcMainView)} />
  </Fragment>
);
