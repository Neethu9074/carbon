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

import { Switch } from 'react-router-dom';
import React from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

//these routes now needs ro be rendered within the parent component
export default (
  <Switch>
    <Route
      component={createAsyncViewComponent(ServiceExtractionRuleConfiguration)}
      path="/config/:ruleType/serviceExtraction/:ruleId"
    />

    <Route
      component={createAsyncViewComponent(ServiceExtractionRuleConfiguration)}
      path="/config/:ruleType/serviceExtraction"
    />

    <Route
      component={createAsyncViewComponent(GeneralServiceExtractionConfiguration)}
      path="/config/generalServiceExtraction"
    />
    <Route
      component={createAsyncViewComponent(HttpServiceExtractionConfiguration)}
      path="/config/httpServiceExtraction"
    />
    <Route
      component={createAsyncViewComponent(BatchServiceExtractionConfiguration)}
      path="/config/batchServiceExtraction"
    />
    <Route
      component={createAsyncViewComponent(EjbServiceExtractionConfiguration)}
      path="/config/ejbServiceExtraction"
    />
    <Route
      component={createAsyncViewComponent(ElasticServiceExtractionConfiguration)}
      path="/config/elasticsearchServiceExtraction"
    />
    <Route
      component={createAsyncViewComponent(MessageBrokerServiceExtractionConfiguration)}
      path="/config/messageBrokerServiceExtraction"
    />
    <Route component={createAsyncViewComponent(UiConfig)} path="/config/userInterface" />
    <Route component={createAsyncViewComponent(EumKeys)} path="/config/eumKeys" />

    <Route component={createAsyncViewComponent(RolesConfig)} path="/config/rolesConfigs" />
    <Route component={createAsyncViewComponent(RoleConfig)} path="/config/rolesConfig/:roleId" />
    <Route component={createAsyncViewComponent(RoleConfig)} path="/config/rolesConfig" />

    <Route component={createAsyncViewComponent(UserManagement)} path="/config/users" />

    <Route component={createAsyncViewComponent(ApiToken)} path="/config/apiTokens/:apiTokenId" />

    <Route component={createAsyncViewComponent(ApiTokens)} path="/config/apiTokens" />

    <Route component={createAsyncViewComponent(Rule)} path="/config/rule/:ruleId" />

    <Route component={createAsyncViewComponent(DynamicRule)} path="/config/dynamicRule/:ruleId" />
    <Route component={createAsyncViewComponent(DynamicRules)} path="/config/dynamicRules" />
    <Route component={createAsyncViewComponent(DynamicRule)} path="/config/dynamicRule" />

    <Route component={createAsyncViewComponent(Rules)} path="/config/rules" />
    <Route component={createAsyncViewComponent(Rule)} path="/config/rule" />

    <Route component={createAsyncViewComponent(RuleBinding)} path="/config/binding/:ruleBindingId" />
    <Route component={createAsyncViewComponent(RuleBindings)} path="/config/bindings" />
    <Route component={createAsyncViewComponent(RuleBinding)} path="/config/binding" />

    <Route component={createAsyncViewComponent(AlertingConfiguration)} path="/config/alertingConfiguration/:id" />

    <Route component={createAsyncViewComponent(AlertingConfiguration)} path="/config/alertingConfiguration" />

    <Route component={createAsyncViewComponent(AlertingConfigurations)} path="/config/alertingConfigurations" />

    <Route component={createAsyncViewComponent(Integration)} path="/config/integration/:id" />
    <Route component={createAsyncViewComponent(Integration)} path="/config/integration" />
    <Route component={createAsyncViewComponent(Integrations)} path="/config/integrations" />

    <Route component={createAsyncViewComponent(AuditLogView)} path="/config/auditlog" />
  </Switch>
);
