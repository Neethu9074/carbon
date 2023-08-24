/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// the following components are all part of the same bundle (kubernetes)
import SapMainView from 'promise-loader?global,sap!in-sap/SapMainView';
import AbapCentralInstanceDashboard from 'promise-loader?global,sap!in-sap/Dashboards/AbapCentralInstance/AbapCentralInstanceDashboard';
import SapJavaCentralInstanceDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapJavaCentralInstance/SapJavaCentralInstanceDashboard';
import SapJavaInstanceDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapJavaInstance/SapJavaInstanceDashboard';
import SapJavaSystemDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapJavaSystem/SapJavaSystemDashboard';
import SapHanaSystemDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapHanaSystem/SapHanaSystemDashboard';
import SapWebDispatcherDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapWebDispatcher/SapWebDispatcherDashboard';
import SapDbInstanceDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapDbInstance/SapDbInstanceDashboard';
import AbapInstanceDashboard from 'promise-loader?global,sap!in-sap/Dashboards/AbapInstance/AbapInstanceDashboard';
import SapDbTenantDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapDbTenant/SapDbTenantDashboard';
import AbapSystemDashboard from 'promise-loader?global,sap!in-sap/Dashboards/AbapSystem/AbapSystemDashboard';
import SapDbmsDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapDbms/SapDbmsDashboard';
import SapHanaDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapHana/SapHanaDashboard';
import SapAbapSensorDashboard from 'promise-loader?global,sap!in-sap/Dashboards/SapAbapSensor/SapAbapSensorDashboard';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  sap,
  abapInstanceDashboardFullyQualified,
  abapCentralInstanceDashboardFullyQualified,
  abapSystemDashboardFullyQualified,
  sapDbmsDashboardFullyQualified,
  sapHanaDashboardFullyQualified,
  sapJavaSystemDashboardFullyQualified,
  sapHanaSystemDashboardFullyQualified,
  sapWebDispatcherDashboardFullyQualified,
  sapJavaInstanceDashboardFullyQualified,
  sapJavaCentralInstanceDashboardFullyQualified,
  sapDbTenantDashboardFullyQualified,
  sapDbInstanceDashboardFullyQualified,
  sapAbapSensorDashboardFullyQualified
} from 'in-sap/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

export default [
  <Route
    key="abapSystemDashboard"
    path={abapSystemDashboardFullyQualified}
    component={createAsyncViewComponent(AbapSystemDashboard)}
  />,
  <Route
    key="AbapInstanceDashboard"
    path={abapInstanceDashboardFullyQualified}
    component={createAsyncViewComponent(AbapInstanceDashboard)}
  />,
  <Route
    key="abapCentralInstanceDashboard"
    path={abapCentralInstanceDashboardFullyQualified}
    component={createAsyncViewComponent(AbapCentralInstanceDashboard)}
  />,
  <Route
    key="sapDbmsDashboard"
    path={sapDbmsDashboardFullyQualified}
    component={createAsyncViewComponent(SapDbmsDashboard)}
  />,
  <Route
    key="sapHanaDashboard"
    path={sapHanaDashboardFullyQualified}
    component={createAsyncViewComponent(SapHanaDashboard)}
  />,
  <Route
    key="sapJavaSystemDashboard"
    path={sapJavaSystemDashboardFullyQualified}
    component={createAsyncViewComponent(SapJavaSystemDashboard)}
  />,
  <Route
    key="sapHanaSystemDashboard"
    path={sapHanaSystemDashboardFullyQualified}
    component={createAsyncViewComponent(SapHanaSystemDashboard)}
  />,
    <Route
      key="sapWebDispatcherDashboard"
      path={sapWebDispatcherDashboardFullyQualified}
      component={createAsyncViewComponent(SapWebDispatcherDashboard)}
    />,
  <Route
    key="sapJavaInstanceDashboard"
    path={sapJavaInstanceDashboardFullyQualified}
    component={createAsyncViewComponent(SapJavaInstanceDashboard)}
  />,
    <Route
      key="sapJavaCentralInstanceDashboard"
      path={sapJavaCentralInstanceDashboardFullyQualified}
      component={createAsyncViewComponent(SapJavaCentralInstanceDashboard)}
    />,
  <Route
    key="SapDbTenantDashboard"
    path={sapDbTenantDashboardFullyQualified}
    component={createAsyncViewComponent(SapDbTenantDashboard)}
  />,
  <Route
    key="sapDbInstanceDashboard"
    path={sapDbInstanceDashboardFullyQualified}
    component={createAsyncViewComponent(SapDbInstanceDashboard)}
  />,
    <Route
      key="sapAbapSensorDashboard"
      path={sapAbapSensorDashboardFullyQualified}
      component={createAsyncViewComponent(SapAbapSensorDashboard)}
    />,
  <Route key="sapMainView" path={sap} component={createAsyncViewComponent(SapMainView)} />
];
