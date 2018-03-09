import { Route } from 'react-router-dom';
import React from 'react';

import {
  agentsPath,
  asciiContainerPath,
  asciiLogicalPath,
  asciiPhysicalPath,
  cockpitPath,
  settingsPath,
  containerPath,
  eventsPath,
  graphPath,
  logicalPath,
  physicalPath,
  tablePath,
  tracesPath,
  websitePath,
  newWebsitePath
} from 'in-stores/navigation/paths/mainPaths';
import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';
import {
  newApplicationMonitoringEnabled,
  instanaInternalFeaturesEnabled,
  withoutInstana1Features,
  analyzeEnabled
} from 'in-services/featureFlags';
import NewWebsite from 'promise-loader?global,eumView!in-views/eumView/components/NewWebsite';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import FragmentSupportingSwitch from 'in-components/FragmentSupportingSwitch';
import EumView from 'promise-loader?global,eumView!in-views/eumView/EumView';
import TableView from 'promise-loader?global!in-views/tableView/TableView';
import AgentView from 'promise-loader?global!in-views/agentView/AgentView';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import TraceView from 'promise-loader?global!in-views/traceView/TraceView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import InternalViews from 'promise-loader?global,internal!in-internal';
import { applicationsList } from 'in-applications/navigation/paths';
import applicationRoutes from 'in-applications/navigation/routes';
import GraphView from 'in-components/graphView/GraphView';
import analyzeRoutes from 'in-analyze/navigation/routes';
import Cockpit from 'in-views/cockpit/Cockpit';
import AsciiMap from 'in-map/AsciiMap';
import { role } from 'in-stores/user';
import Map from 'in-map/index';

export default (
  <FragmentSupportingSwitch>
    {!withoutInstana1Features && <Route path={cockpitPath} component={Cockpit} />}
    {!withoutInstana1Features && <Route path={asciiPhysicalPath} component={AsciiMap} />}
    {!withoutInstana1Features && <Route path={asciiLogicalPath} component={AsciiMap} />}
    {!withoutInstana1Features && <Route path={asciiContainerPath} component={AsciiMap} />}
    {!withoutInstana1Features && <Route path={physicalPath} component={Map} />}
    {!withoutInstana1Features && <Route path={logicalPath} component={Map} />}
    {!withoutInstana1Features && <Route path={containerPath} component={Map} />}

    {!withoutInstana1Features && <Route component={createAsyncViewComponent(EventView)} path={eventsPath} />}
    {!withoutInstana1Features && <Route component={createAsyncViewComponent(TableView)} path={tablePath} />}
    {!withoutInstana1Features && <Route component={createAsyncViewComponent(NewWebsite)} path={newWebsitePath} />}
    {!withoutInstana1Features && <Route component={createAsyncViewComponent(EumView)} path={websitePath} />}
    <Route component={GraphView} path={graphPath} />
    <Route component={createAsyncViewComponent(ConfigurationView)} path={settingsPath} />
    {!withoutInstana1Features && <Route component={createAsyncViewComponent(TraceView)} path={tracesPath} />}
    {!withoutInstana1Features && role.canConfigureAgents ? (
      <Route path={agentsPath} component={createAsyncViewComponent(AgentView)} windowTitle="Instana Agents" />
    ) : null}

    {instanaInternalFeaturesEnabled ? (
      <Route path="/internal" component={createAsyncViewComponent(InternalViews)} windowTitle="Internal" />
    ) : null}

    {newApplicationMonitoringEnabled && applicationRoutes}
    {analyzeEnabled && analyzeRoutes}

    {/* landing page */}
    {!withoutInstana1Features && <RedirectWithHash from="/" to={physicalPath} />}
    {withoutInstana1Features && <RedirectWithHash from="/" to={applicationsList} />}
  </FragmentSupportingSwitch>
);
