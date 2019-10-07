import { Route, Redirect } from 'react-router-dom';
import React from 'react';

import {
  agentsPath,
  containerPath,
  eventsPath,
  graphPath,
  physicalPath,
  tablePath
} from 'in-stores/navigation/paths/mainPaths';
import { hasApplicationsAccess, hasWebsitesAccess, hasKubernetesAccess, hasAnalyzeAccess } from 'in-stores/permission';
import GraphView from 'promise-loader?global,graph-view!in-components/graphView/GraphView';
import AgentView from 'promise-loader?global,infrastructure!in-views/agentView/AgentView';
import TableView from 'promise-loader?global,infrastructure!in-views/tableView/TableView';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import EventView from 'promise-loader?global,events!in-views/eventView/EventView';
import FragmentSupportingSwitch from 'in-components/FragmentSupportingSwitch';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import InternalViews from 'promise-loader?global,internal!in-internal';
import Map from 'promise-loader?global,infrastructure!in-map/index';

import { pcfEnabled, customDashboardsEnabled, vsphereEnabled } from 'in-services/featureFlags';
import customDashboardRoutes from 'in-custom-dashboards/navigation/routes';
import websiteMonitoringRoutes from 'in-websites/navigation/routes';
import cloudfoundryRoutes from 'in-cloudfoundry/navigation/routes';
import vsphereRoutes from 'in-vsphere/navigation/routes';
import applicationRoutes from 'in-applications/navigation/routes';
import configurationRoutes from 'in-settings/navigation/routes';
import kubernetesRoutes from 'in-kubernetes/navigation/routes';
import analyzeRoutes from 'in-analyze/navigation/routes';
import { role, isInstanaEmail } from 'in-stores/user';

export default (
  <FragmentSupportingSwitch>
    <Route path={physicalPath} component={createAsyncViewComponent(Map)} />
    <Route path={containerPath} component={createAsyncViewComponent(Map)} />

    <Route component={createAsyncViewComponent(EventView)} path={eventsPath} />
    <Route component={createAsyncViewComponent(TableView)} path={tablePath} />
    <Route component={createAsyncViewComponent(GraphView)} path={graphPath} />

    {configurationRoutes}

    {role.canConfigureAgents && (
      <Route path={agentsPath} component={createAsyncViewComponent(AgentView)} windowTitle="Instana Agents" />
    )}

    {isInstanaEmail && (
      <Route path="/internal" component={createAsyncViewComponent(InternalViews)} windowTitle="Internal" />
    )}

    {hasApplicationsAccess && applicationRoutes}
    {hasAnalyzeAccess && analyzeRoutes}
    {hasKubernetesAccess && kubernetesRoutes}
    {pcfEnabled && cloudfoundryRoutes}
    {vsphereEnabled && vsphereRoutes}
    {hasWebsitesAccess && websiteMonitoringRoutes}
    {customDashboardsEnabled && customDashboardRoutes}

    <Redirect path="/cockpit" to="/internal/thisUnit/entityStatistics" />

    {/* landing page */}
    <RedirectWithHash from="/" to={physicalPath} />
  </FragmentSupportingSwitch>
);
