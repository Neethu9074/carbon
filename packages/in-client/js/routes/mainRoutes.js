/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AgentView from 'promise-loader?global,infrastructure!in-infrastructure/agentView/AgentView';
import InternalViews from 'promise-loader?global,internal!in-internal';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  hasApplicationsAccess,
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
  hasEventsAccess
} from 'in-stores/permission';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import FragmentSupportingSwitch from 'in-components/FragmentSupportingSwitch';
import customDashboardsRoutes from 'in-custom-dashboards/navigation/routes';
import mobileAppMonitoringRoutes from 'in-mobile-apps/navigation/routes';
import infrastructureRoutes from 'in-infrastructure/navigation/routes';
import websiteMonitoringRoutes from 'in-websites/navigation/routes';
import cloudfoundryRoutes from 'in-cloudfoundry/navigation/routes';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
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
    {hasInfrastructureAccess && infrastructureRoutes}
    {configurationRoutes}
    {role.canConfigureAgents && (
      <Route path={agentsPath} children={renderAsyncRouteChildren(AgentView)} windowTitle="Instana Agents" />
    )}
    {(isInstanaEmail || internalMonitoringUnit) && (
      <Route path="/internal" children={renderAsyncRouteChildren(InternalViews)} windowTitle="Internal" />
    )}

    {hasEventsAccess && eventRoutes}

    {hasSyntheticsAccess && syntheticsRoutes}
    {hasApplicationsAccess && applicationRoutes}
    {hasKubernetesAccess && kubernetesRoutes}
    {hasPCFAccess && cloudfoundryRoutes}
    {hasPHMCAccess && phmcRoutes}
    {hasVSphereAccess && vsphereRoutes}
    {hasOpenStackAccess && openstackRoutes}
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
  </FragmentSupportingSwitch>
);
