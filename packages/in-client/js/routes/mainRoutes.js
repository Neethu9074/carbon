import { Route, Redirect } from 'react-router-dom';
import React from 'react';

import { hasApplicationsAccess, hasWebsitesAccess, hasKubernetesAccess, hasAnalyzeAccess } from 'in-stores/permission';
import { agentsPath, containerPath, graphPath, physicalPath, tablePath } from 'in-stores/navigation/paths/mainPaths';
import GraphView from 'promise-loader?global,graph-view!in-components/graphView/GraphView';
import AgentView from 'promise-loader?global,infrastructure!in-views/agentView/AgentView';
import TableView from 'promise-loader?global,infrastructure!in-views/tableView/TableView';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import FragmentSupportingSwitch from 'in-components/FragmentSupportingSwitch';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import InternalViews from 'promise-loader?global,internal!in-internal';
import Map from 'promise-loader?global,infrastructure!in-map/index';

import { pcfEnabled, customDashboardsEnabled } from 'in-services/featureFlags';
import customDashboardRoutes from 'in-custom-dashboards/navigation/routes';
import websiteMonitoringRoutes from 'in-websites/navigation/routes';
import cloudfoundryRoutes from 'in-cloudfoundry/navigation/routes';
import applicationRoutes from 'in-applications/navigation/routes';
import configurationRoutes from 'in-settings/navigation/routes';
import kubernetesRoutes from 'in-kubernetes/navigation/routes';
import analyzeRoutes from 'in-analyze/navigation/routes';
import { role, isInstanaEmail } from 'in-stores/user';
import eventRoutes from 'in-events/navigation/routes';

export default (
  <FragmentSupportingSwitch>
    <Route path={physicalPath} component={createAsyncViewComponent(Map)} />
    <Route path={containerPath} component={createAsyncViewComponent(Map)} />

    <Route component={createAsyncViewComponent(TableView)} path={tablePath} />
    <Route component={createAsyncViewComponent(GraphView)} path={graphPath} />
    {configurationRoutes}
    {role.canConfigureAgents && (
      <Route path={agentsPath} component={createAsyncViewComponent(AgentView)} windowTitle="Instana Agents" />
    )}
    {isInstanaEmail && (
      <Route path="/internal" component={createAsyncViewComponent(InternalViews)} windowTitle="Internal" />
    )}

    {eventRoutes}

    {hasApplicationsAccess && applicationRoutes}
    {hasAnalyzeAccess && analyzeRoutes}
    {hasKubernetesAccess && kubernetesRoutes}
    {pcfEnabled && cloudfoundryRoutes}
    {hasWebsitesAccess && websiteMonitoringRoutes}
    {customDashboardsEnabled && customDashboardRoutes}
    <Redirect path="/cockpit" to="/internal/thisUnit/entityStatistics" />
    {/* landing page */}
    <RedirectWithHash from="/" to={physicalPath} />
  </FragmentSupportingSwitch>
);
