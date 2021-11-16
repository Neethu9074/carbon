/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import SystemDashboard from 'promise-loader?global,phmc!in-phmc/Dashboards/Systems/SystemDashboard';
import PhmcDashboard from 'promise-loader?global,phmc!in-phmc/Dashboards/Phmc/PhmcDashboard';
import ViosDashboard from 'promise-loader?global,phmc!in-phmc/Dashboards/Vios/ViosDashboard';
import LparDashboard from 'promise-loader?global,phmc!in-phmc/Dashboards/Lpar/LparDashboard';
import PhmcMainView from 'promise-loader?global,phmc!in-phmc/PhmcMainView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  phmcDashboardFullyQualified,
  systemDashboardFullyQualified,
  viosDashboardFullyQualified,
  lparDashboardFullyQualified
} from 'in-phmc/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { ibmp } from 'in-phmc/navigation/paths';

export default (
  <Fragment>
    <Route path={phmcDashboardFullyQualified} component={createAsyncViewComponent(PhmcDashboard)} />
    <Route path={systemDashboardFullyQualified} component={createAsyncViewComponent(SystemDashboard)} />
    <Route path={viosDashboardFullyQualified} component={createAsyncViewComponent(ViosDashboard)} />
    <Route path={lparDashboardFullyQualified} component={createAsyncViewComponent(LparDashboard)} />

    <Route path={ibmp} component={createAsyncViewComponent(PhmcMainView)} />
  </Fragment>
);
