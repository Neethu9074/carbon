// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully functional
import ElasticServiceExtractionConfiguration from 'promise?global,configView!in-views/configurationView/subview/ElasticServiceExtractionConfiguration';
import HttpServiceExtractionConfiguration from 'promise?global,configView!in-views/configurationView/subview/HttpServiceExtractionConfiguration';
import EjbServiceExtractionConfiguration from 'promise?global,configView!in-views/configurationView/subview/EjbServiceExtractionConfiguration';
import JmsServiceExtractionConfiguration from 'promise?global,configView!in-views/configurationView/subview/JmsServiceExtractionConfiguration';
import UserManagement from 'promise?global,configView!in-views/configurationView/subview/UserManagement/UserManagement';
import RolesConfig from 'promise?global,configView!in-views/configurationView/subview/RolesConfig/RolesConfig';
import ObjectivesConfig from 'promise?global,configView!in-views/configurationView/subview/ObjectivesConfig';
import RoleConfig from 'promise?global,configView!in-views/configurationView/subview/RoleConfig/RoleConfig';
import ObjectiveConfig from 'promise?global,configView!in-views/configurationView/subview/ObjectiveConfig';
import ApiTokens from 'promise?global,configView!in-views/configurationView/subview/ApiTokens/ApiTokens';
import ApiToken from 'promise?global,configView!in-views/configurationView/subview/ApiTokens/ApiToken';
import ConfigurationView from 'promise?global,configView!in-views/configurationView/ConfigurationView';

import RuleBindings from 'promise?global,configView!in-views/configurationView/subview/RuleBindings/RuleBindings';
import RuleBinding from 'promise?global,configView!in-views/configurationView/subview/RuleBinding/RuleBinding';
import Rules from 'promise?global,configView!in-views/configurationView/subview/Rules/Rules';
import Rule from 'promise?global,configView!in-views/configurationView/subview/Rule/Rule';

import AuditLogView from 'promise?global,configView!in-views/configurationView/subview/AuditLog';
import UiConfig from 'promise?global,configView!in-views/configurationView/subview/UiConfig';
import EumKeys from 'promise?global,configView!in-views/configurationView/subview/EumKeys';
import TraceView from 'promise?global!in-views/traceView/TraceView';
import EventView from 'promise?global!in-views/eventView/EventView';
import TableView from 'promise?global!in-views/tableView/TableView';
import LogView from 'promise?global!in-views/logView/LogView';
import { cockpitEnabled } from 'in-services/featureFlags';
import { Route, IndexRedirect } from 'react-router';
import React from 'react';

import { createAsyncFullscreenOverlayViewComponent } from 'in-components/routing/createAsyncComponent';
import GraphView from 'in-components/graphView/GraphView';
import GlobeView from 'in-components/globeView/GlobeView';
import WebVRView from 'in-components/webVRView/WebVRView';
import Dashboard from 'in-components/Dashboard';
import Cockpit from 'in-views/cockpit/Cockpit';
import App from 'in-client/js/App';
import Map from 'in-map/index';

export default (
  <Route path="/" component={App}>
    <Route path="cockpit" component={Cockpit} windowTitle="Cockpit" />

    <Route path="physical" component={Map} windowTitle="Infrastructure Host Map">
      <Route path="dashboard" component={Dashboard} windowTitle="Dashboard" />
    </Route>

    <Route path="logical" component={Map} windowTitle="Application Map">
      <Route path="dashboard" component={Dashboard} windowTitle="Dashboard" />
    </Route>

    <Route path="container" component={Map} windowTitle="Infrastructure Container Map">
      <Route path="dashboard" component={Dashboard} windowTitle="Dashboard" />
    </Route>

    <Route component={createAsyncFullscreenOverlayViewComponent(TraceView)} path="traces" windowTitle="Traces">
      <Route path="dashboard" component={Dashboard} windowTitle="Dashboard" />
    </Route>

    <Route component={createAsyncFullscreenOverlayViewComponent(EventView)} path="events" windowTitle="Events">
      <Route component={Dashboard} path="dashboard" windowTitle="Dashboard" />
    </Route>

    <Route component={createAsyncFullscreenOverlayViewComponent(TableView)} path="table" windowTitle="Comparison Table">
      <Route component={Dashboard} path="dashboard" windowTitle="Dashboard" />
    </Route>

    <Route component={createAsyncFullscreenOverlayViewComponent(LogView)} path="logs" windowTitle="Logs">
      <Route component={Dashboard} path="dashboard" windowTitle="Dashboard" />
    </Route>
    <Route path='config'
           component={createAsyncFullscreenOverlayViewComponent(ConfigurationView)}
           windowTitle='Settings'>
      <Route component={createAsyncFullscreenOverlayViewComponent(HttpServiceExtractionConfiguration)}
             path='httpServiceExtraction'
             windowTitle='HTTP Service Extraction' />
      <Route component={createAsyncFullscreenOverlayViewComponent(EjbServiceExtractionConfiguration)}
             path='ejbServiceExtraction'
             windowTitle='EJB Service Extraction' />
      <Route component={createAsyncFullscreenOverlayViewComponent(ElasticServiceExtractionConfiguration)}
             path='elasticsearchServiceExtraction'
             windowTitle='Elasticsearch Service Extraction' />
      <Route component={createAsyncFullscreenOverlayViewComponent(JmsServiceExtractionConfiguration)}
             path='jmsServiceExtraction'
             windowTitle='JMS Service Extraction' />
      <Route component={createAsyncFullscreenOverlayViewComponent(UiConfig)}
             path='userInterface'
             windowTitle='User Interface Settings' />
      <Route component={createAsyncFullscreenOverlayViewComponent(EumKeys)}
             path='eumKeys'
             windowTitle='EUM Keys' />

      <Route component={createAsyncFullscreenOverlayViewComponent(RolesConfig)}
             path='rolesConfig'
             windowTitle='Role Config' />
      <Route component={createAsyncFullscreenOverlayViewComponent(RoleConfig)}
             path='rolesConfig/:roleId'
             windowTitle='Role Config' />
      <Route component={createAsyncFullscreenOverlayViewComponent(UserManagement)}
             path='users'
             windowTitle='User Management' />
      <Route component={createAsyncFullscreenOverlayViewComponent(ApiTokens)}
             path='apiTokens'
             windowTitle='API Tokens' />
      <Route component={createAsyncFullscreenOverlayViewComponent(ApiToken)}
             path='apiTokens/:apiTokenId'
             windowTitle='API Tokens' />

      <Route component={createAsyncFullscreenOverlayViewComponent(Rules)}
             path='rule'
             windowTitle='Custom Rules' />
      <Route component={createAsyncFullscreenOverlayViewComponent(Rule)}
             path='rule/:ruleId'
             windowTitle='Custom Rule' />
      <Route component={createAsyncFullscreenOverlayViewComponent(RuleBindings)}
             path='binding'
             windowTitle='Custom Issues' />
      <Route component={createAsyncFullscreenOverlayViewComponent(RuleBinding)}
             path='binding/:ruleBindingId'
             windowTitle='Custom Issue' />

      <Route component={createAsyncFullscreenOverlayViewComponent(ObjectivesConfig)}
             path='objectives'
             windowTitle='Objectives' />
      <Route component={createAsyncFullscreenOverlayViewComponent(ObjectiveConfig)}
             path='objectives/:objectiveId'
             windowTitle='Objectives' />

      <Route component={createAsyncFullscreenOverlayViewComponent(AuditLogView)}
             path='auditlog'
             windowTitle='Audit Log' />
    </Route>

    <Route component={GraphView} path="graph" windowTitle="Graph" />
    <Route component={GlobeView} path="globe" windowTitle="World Globe" />
    <Route component={WebVRView} path="webVR/physical" windowTitle="Physical WebVR View" />
    <Route component={WebVRView} path="webVR/logical" windowTitle="Logical WebVR View" />

    <IndexRedirect to={cockpitEnabled ? '/cockpit' : '/physical'} />
  </Route>
);
