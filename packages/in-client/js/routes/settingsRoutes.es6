import MessageBrokerServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/MessageBrokerServiceExtractionConfiguration';
import ElasticServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/ElasticServiceExtractionConfiguration';
import GeneralServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/GeneralServiceExtractionConfiguration';
import BatchServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/BatchServiceExtractionConfiguration';
import HttpServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/HttpServiceExtractionConfiguration';
import EjbServiceExtractionConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtraction/configs/EjbServiceExtractionConfiguration';
import ServiceExtractionRuleConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/ServiceExtractionRuleConfig/ServiceExtractionRuleConfig';
import UserManagement from 'promise-loader?global,configView!in-views/configurationView/subview/UserManagement/UserManagement';
import RolesConfig from 'promise-loader?global,configView!in-views/configurationView/subview/RolesConfig/RolesConfig';
import RoleConfig from 'promise-loader?global,configView!in-views/configurationView/subview/RoleConfig/RoleConfig';
import ApiTokens from 'promise-loader?global,configView!in-views/configurationView/subview/ApiTokens/ApiTokens';
import ApiToken from 'promise-loader?global,configView!in-views/configurationView/subview/ApiTokens/ApiToken';
import { Route } from 'react-router-dom';

import RuleBindings from 'promise-loader?global,configView!in-views/configurationView/subview/RuleBindings/RuleBindings';
import DynamicRules from 'promise-loader?global,configView!in-views/configurationView/subview/DynamicRules/DynamicRules';
import RuleBinding from 'promise-loader?global,configView!in-views/configurationView/subview/RuleBinding/RuleBinding';
import DynamicRule from 'promise-loader?global,configView!in-views/configurationView/subview/DynamicRule/DynamicRule';
import Rules from 'promise-loader?global,configView!in-views/configurationView/subview/Rules/Rules';
import Rule from 'promise-loader?global,configView!in-views/configurationView/subview/Rule/Rule';

import AlertingConfigurations from 'promise-loader?global,configView!in-views/configurationView/subview/AlertingConfigurations/AlertingConfigurations';
import AlertingConfiguration from 'promise-loader?global,configView!in-views/configurationView/subview/AlertingConfiguration/AlertingConfiguration';
import Integrations from 'promise-loader?global,configView!in-views/configurationView/subview/Integrations/Integrations';
import Integration from 'promise-loader?global,configView!in-views/configurationView/subview/Integration/Integration';

import AuditLogView from 'promise-loader?global,configView!in-views/configurationView/subview/AuditLog';
import UiConfig from 'promise-loader?global,configView!in-views/configurationView/subview/UiConfig';
import EumKeys from 'promise-loader?global,configView!in-views/configurationView/subview/EumKeys';

import { alertingEnabled } from 'in-services/featureFlags';

import { Switch } from 'react-router-dom';
import React from 'react';

import { createAsyncFullscreenOverlayViewComponent } from 'in-components/routing/createAsyncComponent';

//these routes now needs ro be rendered within the parent component
export default (
  <Switch>
    <Route
      component={createAsyncFullscreenOverlayViewComponent(ServiceExtractionRuleConfiguration)}
      path="/config/:ruleType/serviceExtraction/:ruleId"
    />

    <Route
      component={createAsyncFullscreenOverlayViewComponent(ServiceExtractionRuleConfiguration)}
      path="/config/:ruleType/serviceExtraction"
    />

    <Route
      component={createAsyncFullscreenOverlayViewComponent(GeneralServiceExtractionConfiguration)}
      path="/config/generalServiceExtraction"
    />
    <Route
      component={createAsyncFullscreenOverlayViewComponent(HttpServiceExtractionConfiguration)}
      path="/config/httpServiceExtraction"
    />
    <Route
      component={createAsyncFullscreenOverlayViewComponent(BatchServiceExtractionConfiguration)}
      path="/config/batchServiceExtraction"
    />
    <Route
      component={createAsyncFullscreenOverlayViewComponent(EjbServiceExtractionConfiguration)}
      path="/config/ejbServiceExtraction"
    />
    <Route
      component={createAsyncFullscreenOverlayViewComponent(ElasticServiceExtractionConfiguration)}
      path="/config/elasticsearchServiceExtraction"
    />
    <Route
      component={createAsyncFullscreenOverlayViewComponent(MessageBrokerServiceExtractionConfiguration)}
      path="/config/messageBrokerServiceExtraction"
    />
    <Route component={createAsyncFullscreenOverlayViewComponent(UiConfig)} path="/config/userInterface" />
    <Route component={createAsyncFullscreenOverlayViewComponent(EumKeys)} path="/config/eumKeys" />

    <Route component={createAsyncFullscreenOverlayViewComponent(RolesConfig)} path="/config/rolesConfigs" />
    <Route component={createAsyncFullscreenOverlayViewComponent(RoleConfig)} path="/config/rolesConfig/:roleId" />
    <Route component={createAsyncFullscreenOverlayViewComponent(RoleConfig)} path="/config/rolesConfig" />

    <Route component={createAsyncFullscreenOverlayViewComponent(UserManagement)} path="/config/users" />

    <Route component={createAsyncFullscreenOverlayViewComponent(ApiToken)} path="/config/apiTokens/:apiTokenId" />

    <Route component={createAsyncFullscreenOverlayViewComponent(ApiTokens)} path="/config/apiTokens" />

    <Route component={createAsyncFullscreenOverlayViewComponent(Rule)} path="/config/rule/:ruleId" />

    <Route component={createAsyncFullscreenOverlayViewComponent(DynamicRule)} path="/config/dynamicRule/:ruleId" />
    <Route component={createAsyncFullscreenOverlayViewComponent(DynamicRules)} path="/config/dynamicRules" />
    <Route component={createAsyncFullscreenOverlayViewComponent(DynamicRule)} path="/config/dynamicRule" />

    <Route component={createAsyncFullscreenOverlayViewComponent(Rules)} path="/config/rules" />
    <Route component={createAsyncFullscreenOverlayViewComponent(Rule)} path="/config/rule" />

    <Route component={createAsyncFullscreenOverlayViewComponent(RuleBinding)} path="/config/binding/:ruleBindingId" />
    <Route component={createAsyncFullscreenOverlayViewComponent(RuleBindings)} path="/config/bindings" />
    <Route component={createAsyncFullscreenOverlayViewComponent(RuleBinding)} path="/config/binding" />

    {alertingEnabled ? (
      <Route
        component={createAsyncFullscreenOverlayViewComponent(AlertingConfiguration)}
        path="/config/alertingConfiguration/:id"
      />
    ) : null}
    {alertingEnabled ? (
      <Route
        component={createAsyncFullscreenOverlayViewComponent(AlertingConfiguration)}
        path="/config/alertingConfiguration"
      />
    ) : null}
    {alertingEnabled ? (
      <Route
        component={createAsyncFullscreenOverlayViewComponent(AlertingConfigurations)}
        path="/config/alertingConfigurations"
      />
    ) : null}

    {alertingEnabled ? (
      <Route component={createAsyncFullscreenOverlayViewComponent(Integration)} path="/config/integration/:id" />
    ) : null}
    {alertingEnabled ? (
      <Route component={createAsyncFullscreenOverlayViewComponent(Integration)} path="/config/integration" />
    ) : null}
    {alertingEnabled ? (
      <Route component={createAsyncFullscreenOverlayViewComponent(Integrations)} path="/config/integrations" />
    ) : null}

    <Route component={createAsyncFullscreenOverlayViewComponent(AuditLogView)} path="/config/auditlog" />
  </Switch>
);
