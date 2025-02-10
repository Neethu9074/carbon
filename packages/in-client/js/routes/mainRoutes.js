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
  hasPowerVcAccess,
  hasPHMCAccess,
  hasZHMCAccess,
  hasPCFAccess,
  hasOpenStackAccess,
  hasEventsAccess,
  hasSAPAccess,
  hasSloAccess,
  hasAutomationAccess,
  hasNutanixAccess
} from 'in-stores/permission';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import customDashboardsRoutes from 'in-custom-dashboards/navigation/routes';
import vulnerabilityRoutes from 'in-vulnerability-center/navigation/routes';
import mobileAppMonitoringRoutes from 'in-mobile-apps/navigation/routes';
import { role, canSeeExtendedInternalMonitoring } from 'in-stores/user';
import infrastructureRoutes from 'in-infrastructure/navigation/routes';
import websiteMonitoringRoutes from 'in-websites/navigation/routes';
import cloudfoundryRoutes from 'in-cloudfoundry/navigation/routes';
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
import vsphereRoutes from 'in-vsphere/navigation/routes';
import powervcRoutes from 'in-powervc/navigation/routes';
import welcomePageRoutes from 'in-plg/navigation/routes';
import nutanixRoutes from 'in-nutanix/navigation/routes';
import bizopsRoutes from 'in-bizops/navigation/routes';
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
      <Route path={agentsPath} windowTitle="Instana Agents">
        {renderAsyncRouteChildren(AgentView)}
      </Route>
    )}
    {(canSeeExtendedInternalMonitoring || internalMonitoringUnit) && (
      <Route path="/internal" windowTitle="Internal">
        {renderAsyncRouteChildren(InternalViews)}
      </Route>
    )}

    {hasEventsAccess && eventRoutes}
    {hasSloAccess && sloRoutes}
    {hasSyntheticsAccess && syntheticsRoutes}
    {hasApplicationsAccess && applicationRoutes()}
    {hasAutomationAccess && automationRoutes}
    {hasBizOpsAccess && bizopsRoutes}
    {hasKubernetesAccess && kubernetesRoutes}
    {hasPCFAccess && cloudfoundryRoutes}
    {hasPHMCAccess && phmcRoutes}
    {hasPowerVcAccess && powervcRoutes}
    {hasVSphereAccess && vsphereRoutes}
    {hasOpenStackAccess && openstackRoutes}
    {hasSAPAccess && sapRoutes}
    {hasZHMCAccess && zhmcRoutes}
    {hasWebsitesAccess && websiteMonitoringRoutes}
    {hasMobileAppsAccess && mobileAppMonitoringRoutes}
    {vulnerabilityRoutes}
    {integrationRoutes}
    {customDashboardsRoutes}
    {welcomePageRoutes}
    {profilingRoutes}
    {loggingRoutes}
    {deepLinkRoutes}
    {hasNutanixAccess && nutanixRoutes}

    {/* The landing page must be the very last item as it dynamically redirects */}
    <Route path="/" component={LandingPage} />
  </Switch>
);
