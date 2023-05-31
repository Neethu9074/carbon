/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AgentView from 'promise-loader?global,infrastructure!in-infrastructure/agentView/AgentView';
import InternalViews from 'promise-loader?global,internal!in-internal';
import { Route, Switch } from 'react-router-dom';
import React from 'react';

import {
  hasApplicationsAccess,
  hasBizOpsAccess,
  hasWebsitesAccess,
  hasKubernetesAccess,
  hasMobileAppsAccess,
  hasInfrastructureAccess,
  hasSyntheticsAccess,
  hasVSphereAccess,
  hasPHMCAccess,
  hasZHMCAccess,
  hasPCFAccess,
  hasOpenStackAccess,
  hasEventsAccess,
  hasSAPAccess,
  hasSloAccess
} from 'in-stores/permission';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import customDashboardsRoutes from 'in-custom-dashboards/navigation/routes';
import mobileAppMonitoringRoutes from 'in-mobile-apps/navigation/routes';
import infrastructureRoutes from 'in-infrastructure/navigation/routes';
import websiteMonitoringRoutes from 'in-websites/navigation/routes';
import cloudfoundryRoutes from 'in-cloudfoundry/navigation/routes';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import integrationRoutes from 'in-integrations/navigation/routes';
import applicationRoutes from 'in-applications/navigation/routes';
import configurationRoutes from 'in-settings/navigation/routes';
import automationRoutes from 'in-automation/navigation/routes';
import syntheticsRoutes from 'in-synthetics/navigation/routes';
import LandingPage from 'in-client/js/LandingPage/LandingPage';
import kubernetesRoutes from 'in-kubernetes/navigation/routes';
import profilingRoutes from 'in-profiling/navigation/routes';
import openstackRoutes from 'in-openstack/navigation/routes';
import sloRoutes from 'in-service-levels/navigation/routes';
import loggingRoutes from 'in-logging/navigation/routes';
import cockpitRoutes from 'in-cockpit/navigation/routes';
import vsphereRoutes from 'in-vsphere/navigation/routes';
import bizopsRoutes from 'in-bizops/navigation/routes';
import { role, isInstanaEmail } from 'in-stores/user';
import eventRoutes from 'in-events/navigation/routes';
import deepLinkRoutes from 'in-client/js/deepLink';
import phmcRoutes from 'in-phmc/navigation/routes';
import zhmcRoutes from 'in-zhmc/navigation/routes';
import sapRoutes from 'in-sap/navigation/routes';

export default (
  <Switch>
    {hasInfrastructureAccess && infrastructureRoutes}
    {configurationRoutes}
    {role.canConfigureAgents && (
      <Route path={agentsPath} children={renderAsyncRouteChildren(AgentView)} windowTitle="Instana Agents" />
    )}
    {(isInstanaEmail || internalMonitoringUnit) && (
      <Route path="/internal" children={renderAsyncRouteChildren(InternalViews)} windowTitle="Internal" />
    )}

    {hasEventsAccess && eventRoutes}
    {hasSloAccess && sloRoutes}
    {hasSyntheticsAccess && syntheticsRoutes}
    {hasApplicationsAccess && applicationRoutes()}
    {role.canConfigureAutomationActions && actionAutomationEnabled && automationRoutes}
    {hasBizOpsAccess && bizopsRoutes}
    {hasKubernetesAccess && kubernetesRoutes}
    {hasPCFAccess && cloudfoundryRoutes}
    {hasPHMCAccess && phmcRoutes}
    {hasVSphereAccess && vsphereRoutes}
    {hasOpenStackAccess && openstackRoutes}
    {hasSAPAccess && sapRoutes}
    {hasZHMCAccess && zhmcRoutes}
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
  </Switch>
);
