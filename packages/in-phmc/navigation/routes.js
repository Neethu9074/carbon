/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const SharedProcessorPoolDashboard = () =>
  import(/* webpackChunkName: "phmc" */ 'in-phmc/Dashboards/SharedProcessorPool/SharedProcessorPoolDashboard');
const SystemDashboard = () => import(/* webpackChunkName: "phmc" */ 'in-phmc/Dashboards/Systems/SystemDashboard');
const PhmcDashboard = () => import(/* webpackChunkName: "phmc" */ 'in-phmc/Dashboards/Phmc/PhmcDashboard');
const ViosDashboard = () => import(/* webpackChunkName: "phmc" */ 'in-phmc/Dashboards/Vios/ViosDashboard');
const LparDashboard = () => import(/* webpackChunkName: "phmc" */ 'in-phmc/Dashboards/Lpar/LparDashboard');
const PhmcMainView = () => import(/* webpackChunkName: "phmc" */ 'in-phmc/PhmcMainView');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  phmcDashboardFullyQualified,
  systemDashboardFullyQualified,
  viosDashboardFullyQualified,
  lparDashboardFullyQualified,
  sppDashboardFullyQualified,
  ibmp
} from 'in-phmc/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route key="phmcDashboard" path={phmcDashboardFullyQualified} children={renderAsyncRouteChildren(PhmcDashboard)} />,
  <Route
    key="phmcSystemDashboard"
    path={systemDashboardFullyQualified}
    children={renderAsyncRouteChildren(SystemDashboard)}
  />,
  <Route
    key="phmcViosDashboard"
    path={viosDashboardFullyQualified}
    children={renderAsyncRouteChildren(ViosDashboard)}
  />,
  <Route
    key="phmcLparDashboard"
    path={lparDashboardFullyQualified}
    children={renderAsyncRouteChildren(LparDashboard)}
  />,
  <Route
    key="phmcSppDashboard"
    path={sppDashboardFullyQualified}
    children={renderAsyncRouteChildren(SharedProcessorPoolDashboard)}
  />,
  <Route key="phmcMainView" path={ibmp} children={renderAsyncRouteChildren(PhmcMainView)} />
];
