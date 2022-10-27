/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import InfraExploreView from 'promise-loader?global,infrastructure!in-infrastructure/Explore/Explore';
import AgentView from 'promise-loader?global,infrastructure!in-infrastructure/agentView/AgentView';
import TableView from 'promise-loader?global,infrastructure!in-infrastructure/tableView/TableView';
import GraphView from 'promise-loader?global,graph-view!in-components/graphView/GraphView';
import InternalViews from 'promise-loader?global,internal!in-internal';
import Map from 'promise-loader?global,infrastructure!in-map/index';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  pcfEnabled,
  vsphereEnabled,
  openstackEnabled,
  phmcEnabled,
  zhmcEnabled,
  internalMonitoringUnit,
  syntheticsTestEnabled
} from 'in-services/featureFlags';
import {
  hasApplicationsAccess,
  hasWebsitesAccess,
  hasKubernetesAccess,
  hasMobileAppsAccess
} from 'in-stores/permission';
import { agentsPath, containerPath, graphPath, physicalPath, tablePath } from 'in-stores/navigation/paths/mainPaths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import FragmentSupportingSwitch from 'in-components/FragmentSupportingSwitch';
import customDashboardsRoutes from 'in-custom-dashboards/navigation/routes';
import mobileAppMonitoringRoutes from 'in-mobile-apps/navigation/routes';
import { infraExplorePath } from 'in-infrastructure/navigation/paths';
import websiteMonitoringRoutes from 'in-websites/navigation/routes';
import { infraExploreDataEnabled } from 'in-services/featureFlags';
import cloudfoundryRoutes from 'in-cloudfoundry/navigation/routes';
import integrationRoutes from 'in-integrations/navigation/routes';
import applicationRoutes from 'in-applications/navigation/routes';
import configurationRoutes from 'in-settings/navigation/routes';
import syntheticsRoutes from 'in-synthetics/navigation/routes';
import LandingPage from 'in-client/js/LandingPage/LandingPage';
import kubernetesRoutes from 'in-kubernetes/navigation/routes';
import profilingRoutes from 'in-profiling/navigation/routes';
import openstackRoutes from 'in-openstack/navigation/routes';
import loggingRoutes from 'in-logging/navigation/routes';
import cockpitRoutes from 'in-cockpit/navigation/routes';
import vsphereRoutes from 'in-vsphere/navigation/routes';
import { role, isInstanaEmail } from 'in-stores/user';
import eventRoutes from 'in-events/navigation/routes';
import deepLinkRoutes from 'in-client/js/deepLink';
import phmcRoutes from 'in-phmc/navigation/routes';
import zhmcRoutes from 'in-zhmc/navigation/routes';

export default (
  <FragmentSupportingSwitch>
    <Route path={physicalPath} children={renderAsyncRouteChildren(Map)} />
    <Route path={containerPath} children={renderAsyncRouteChildren(Map)} />
    <Route path={tablePath} children={renderAsyncRouteChildren(TableView)} />
    <Route path={graphPath} children={renderAsyncRouteChildren(GraphView)} />
    {infraExploreDataEnabled && <Route path={infraExplorePath} children={renderAsyncRouteChildren(InfraExploreView)} />}

    {configurationRoutes}
    {role.canConfigureAgents && (
      <Route path={agentsPath} children={renderAsyncRouteChildren(AgentView)} windowTitle="Instana Agents" />
    )}
    {(isInstanaEmail || internalMonitoringUnit) && (
      <Route path="/internal" children={renderAsyncRouteChildren(InternalViews)} windowTitle="Internal" />
    )}

    {eventRoutes}

    {syntheticsTestEnabled && syntheticsRoutes}
    {hasApplicationsAccess && applicationRoutes}
    {hasKubernetesAccess && kubernetesRoutes}
    {pcfEnabled && cloudfoundryRoutes}
    {phmcEnabled && phmcRoutes}
    {vsphereEnabled && vsphereRoutes}
    {openstackEnabled && openstackRoutes}
    {zhmcEnabled && zhmcRoutes}
    {hasWebsitesAccess && websiteMonitoringRoutes}
    {hasMobileAppsAccess && mobileAppMonitoringRoutes}
    {integrationRoutes}
    {customDashboardsRoutes}
    {cockpitRoutes}
    {profilingRoutes}
    {loggingRoutes}
    {deepLinkRoutes}

    {/* The landing page must be the very last item as it dynamically redirects */}
    <Route path="/" component={LandingPage} />
  </FragmentSupportingSwitch>
);
