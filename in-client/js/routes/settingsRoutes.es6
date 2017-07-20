import ServiceExtractionRuleConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtractionRuleConfig/ServiceExtractionRuleConfig';
import ElasticServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/ElasticServiceExtractionConfiguration';
import HttpServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/HttpServiceExtractionConfiguration';
import EjbServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/EjbServiceExtractionConfiguration';
import MessageBrokerServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/MessageBrokerServiceExtractionConfiguration';
import UserManagement from 'promise-loader?global,configView!in-views/configurationView/subview/UserManagement/UserManagement';
import RolesConfig from 'promise-loader?global,configView!in-views/configurationView/subview/RolesConfig/RolesConfig';
import ObjectivesConfig from 'promise-loader?global,configView!in-views/configurationView/subview/ObjectivesConfig';
import RoleConfig from 'promise-loader?global,configView!in-views/configurationView/subview/RoleConfig/RoleConfig';
import ObjectiveConfig from 'promise-loader?global,configView!in-views/configurationView/subview/ObjectiveConfig';
import ApiTokens from 'promise-loader?global,configView!in-views/configurationView/subview/ApiTokens/ApiTokens';
import ApiToken from 'promise-loader?global,configView!in-views/configurationView/subview/ApiTokens/ApiToken';

import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';

import RuleBindings from 'promise-loader?global,configView!in-views/configurationView/subview/RuleBindings/RuleBindings';
import RuleBinding from 'promise-loader?global,configView!in-views/configurationView/subview/RuleBinding/RuleBinding';
import Rules from 'promise-loader?global,configView!in-views/configurationView/subview/Rules/Rules';
import Rule from 'promise-loader?global,configView!in-views/configurationView/subview/Rule/Rule';

import AuditLogView from 'promise-loader?global,configView!in-views/configurationView/subview/AuditLog';
import UiConfig from 'promise-loader?global,configView!in-views/configurationView/subview/UiConfig';
import EumKeys from 'promise-loader?global,configView!in-views/configurationView/subview/EumKeys';

import { Switch } from 'react-router-dom';
import React from 'react';

import { createAsyncFullscreenOverlayViewComponent } from 'in-components/routing/createAsyncComponent';

//these routes now needs ro be rendered within the parent component
export default (
  <Switch>

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(ServiceExtractionRuleConfiguration)}
      path="/config/:ruleType/serviceExtraction/:ruleId"
      windowTitle="Service Extraction Rule"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(ServiceExtractionRuleConfiguration)}
      path="/config/:ruleType/serviceExtraction"
      windowTitle="Service Extraction Rule"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(HttpServiceExtractionConfiguration)}
      path="/config/httpServiceExtraction"
      windowTitle="HTTP Service Extraction"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(EjbServiceExtractionConfiguration)}
      path="/config/ejbServiceExtraction"
      windowTitle="EJB Service Extraction"
    />
    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(ElasticServiceExtractionConfiguration)}
      path="/config/elasticsearchServiceExtraction"
      windowTitle="Elasticsearch Service Extraction"
    />
    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(MessageBrokerServiceExtractionConfiguration)}
      path="/config/messageBrokerServiceExtraction"
      windowTitle="Message Broker Service Extraction"
    />
    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(UiConfig)}
      path="/config/userInterface"
      windowTitle="User Interface Settings"
    />
    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(EumKeys)}
      path="/config/eumKeys"
      windowTitle="EUM Keys"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(RoleConfig)}
      path="/config/rolesConfig/:roleId"
      windowTitle="Role Config"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(RolesConfig)}
      path="/config/rolesConfig"
      windowTitle="Role Config"
    />
    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(UserManagement)}
      path="/config/users"
      windowTitle="User Management"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(ApiToken)}
      path="/config/apiTokens/:apiTokenId"
      windowTitle="API Tokens"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(ApiTokens)}
      path="/config/apiTokens"
      windowTitle="API Tokens"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(Rule)}
      path="/config/rule/:ruleId"
      windowTitle="Custom Rule"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(Rules)}
      path="/config/rules"
      windowTitle="Custom Rules"
    />
    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(Rule)}
      path="/config/rule"
      windowTitle="Custom Rule"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(RuleBinding)}
      path="/config/binding/:ruleBindingId"
      windowTitle="Custom Issue"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(RuleBindings)}
      path="/config/bindings"
      windowTitle="Custom Issues"
    />
    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(RuleBinding)}
      path="/config/binding"
      windowTitle="Custom Issue"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(ObjectiveConfig)}
      path="/config/objectives/:objectiveId"
      windowTitle="Objectives"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(ObjectivesConfig)}
      path="/config/objectives"
      windowTitle="Objectives"
    />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(AuditLogView)}
      path="/config/auditlog"
      windowTitle="Audit Log"
    />
  </Switch>
);
