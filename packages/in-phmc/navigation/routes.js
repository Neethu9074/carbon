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
import React from 'react';

import {
  phmcDashboardFullyQualified,
  systemDashboardFullyQualified,
  viosDashboardFullyQualified,
  lparDashboardFullyQualified,
  ibmp
} from 'in-phmc/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route key="phmcDashboard" path={phmcDashboardFullyQualified} children={renderAsyncRouteChildren(PhmcDashboard)} />,
  <Route
    key="systemDashboard"
    path={systemDashboardFullyQualified}
    children={renderAsyncRouteChildren(SystemDashboard)}
  />,
  <Route key="viosDashboard" path={viosDashboardFullyQualified} children={renderAsyncRouteChildren(ViosDashboard)} />,
  <Route key="lparDashboard" path={lparDashboardFullyQualified} children={renderAsyncRouteChildren(LparDashboard)} />,
  <Route key="phmcMainView" path={ibmp} children={renderAsyncRouteChildren(PhmcMainView)} />
];
