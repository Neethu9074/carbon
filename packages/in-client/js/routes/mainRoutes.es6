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
  previewTwoZeroWithoutHybrid,
  twoZeroModeEnabled,
  instanaInternalFeaturesEnabled
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
    <Route path={cockpitPath} component={Cockpit} />
    {!twoZeroModeEnabled && <Route path={asciiPhysicalPath} component={AsciiMap} />}
    {!twoZeroModeEnabled && <Route path={asciiLogicalPath} component={AsciiMap} />}
    {!twoZeroModeEnabled && <Route path={asciiContainerPath} component={AsciiMap} />}
    {!twoZeroModeEnabled && <Route path={physicalPath} component={Map} />}
    {!twoZeroModeEnabled && <Route path={logicalPath} component={Map} />}
    {!twoZeroModeEnabled && <Route path={containerPath} component={Map} />}

    {!previewTwoZeroWithoutHybrid && <Route component={createAsyncViewComponent(EventView)} path={eventsPath} />}
    {!twoZeroModeEnabled && <Route component={createAsyncViewComponent(TableView)} path={tablePath} />}
    <Route component={createAsyncViewComponent(NewWebsite)} path={newWebsitePath} />
    <Route component={createAsyncViewComponent(EumView)} path={websitePath} />
    {!twoZeroModeEnabled && <Route component={GraphView} path={graphPath} />}
    <Route component={createAsyncViewComponent(ConfigurationView)} path={settingsPath} />
    {!twoZeroModeEnabled && <Route component={createAsyncViewComponent(TraceView)} path={tracesPath} />}
    {role.canConfigureAgents && (
      <Route path={agentsPath} component={createAsyncViewComponent(AgentView)} windowTitle="Instana Agents" />
    )}

    {instanaInternalFeaturesEnabled && !twoZeroModeEnabled ? (
      <Route path="/internal" component={createAsyncViewComponent(InternalViews)} windowTitle="Internal" />
    ) : null}

    {twoZeroModeEnabled && applicationRoutes}
    {twoZeroModeEnabled && analyzeRoutes}

    {/* landing page */}
    {!twoZeroModeEnabled && <RedirectWithHash from="/" to={physicalPath} />}
    {twoZeroModeEnabled && <RedirectWithHash from="/" to={applicationsList} />}
  </FragmentSupportingSwitch>
);
