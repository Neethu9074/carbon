import {
  newServiceExtractionPath,
  serviceExtractionPath,
  generalServiceExtractionPath,
  httpServiceExtractionPath,
  batchServiceExtractionPath,
  ejbServiceExtractionPath,
  elasticsearchServiceExtractionPath,
  messageBrokerServiceExtractionPath,
  userInterfacePath,
  rolesConfigsPath,
  newRolesConfigPath,
  rolesConfigPath,
  usersPath,
  apiTokensPath,
  newApiTokenPath,
  newDynamicRulePath,
  dynamicRulesPath,
  dynamicRulePath,
  rulesPath,
  newRulePath,
  rulePath,
  bindingsPath,
  newBindingPath,
  bindingPath,
  alertingConfigurationsPath,
  newAlertingConfigurationPath,
  alertingConfigurationPath,
  integrationsPath,
  integrationPath,
  newIntegrationPath,
  auditlogPath
} from 'in-stores/navigation/paths/settingPaths';

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

import { Switch } from 'react-router-dom';
import React from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

//these routes now needs ro be rendered within the parent component
export default (
  <Switch>
    <Route component={createAsyncViewComponent(ServiceExtractionRuleConfiguration)} path={newServiceExtractionPath} />

    <Route component={createAsyncViewComponent(ServiceExtractionRuleConfiguration)} path={serviceExtractionPath} />

    <Route
      component={createAsyncViewComponent(GeneralServiceExtractionConfiguration)}
      path={generalServiceExtractionPath}
    />
    <Route component={createAsyncViewComponent(HttpServiceExtractionConfiguration)} path={httpServiceExtractionPath} />
    <Route
      component={createAsyncViewComponent(BatchServiceExtractionConfiguration)}
      path={batchServiceExtractionPath}
    />
    <Route component={createAsyncViewComponent(EjbServiceExtractionConfiguration)} path={ejbServiceExtractionPath} />
    <Route
      component={createAsyncViewComponent(ElasticServiceExtractionConfiguration)}
      path={elasticsearchServiceExtractionPath}
    />
    <Route
      component={createAsyncViewComponent(MessageBrokerServiceExtractionConfiguration)}
      path={messageBrokerServiceExtractionPath}
    />

    <Route component={createAsyncViewComponent(UiConfig)} path={userInterfacePath} />

    <Route component={createAsyncViewComponent(RoleConfig)} path={newRolesConfigPath} />
    <Route component={createAsyncViewComponent(RolesConfig)} path={rolesConfigsPath} />
    <Route component={createAsyncViewComponent(RoleConfig)} path={rolesConfigPath} />

    <Route component={createAsyncViewComponent(UserManagement)} path={usersPath} />

    <Route component={createAsyncViewComponent(ApiToken)} path={newApiTokenPath} />
    <Route component={createAsyncViewComponent(ApiTokens)} path={apiTokensPath} />

    <Route component={createAsyncViewComponent(DynamicRule)} path={newDynamicRulePath} />
    <Route component={createAsyncViewComponent(DynamicRules)} path={dynamicRulesPath} />
    <Route component={createAsyncViewComponent(DynamicRule)} path={dynamicRulePath} />

    <Route component={createAsyncViewComponent(Rule)} path={newRulePath} />
    <Route component={createAsyncViewComponent(Rules)} path={rulesPath} />
    <Route component={createAsyncViewComponent(Rule)} path={rulePath} />

    <Route component={createAsyncViewComponent(RuleBinding)} path={newBindingPath} />
    <Route component={createAsyncViewComponent(RuleBindings)} path={bindingsPath} />
    <Route component={createAsyncViewComponent(RuleBinding)} path={bindingPath} />

    <Route component={createAsyncViewComponent(AlertingConfiguration)} path={newAlertingConfigurationPath} />
    <Route component={createAsyncViewComponent(AlertingConfigurations)} path={alertingConfigurationsPath} />
    <Route component={createAsyncViewComponent(AlertingConfiguration)} path={alertingConfigurationPath} />

    <Route component={createAsyncViewComponent(Integration)} path={newIntegrationPath} />
    <Route component={createAsyncViewComponent(Integrations)} path={integrationsPath} />
    <Route component={createAsyncViewComponent(Integration)} path={integrationPath} />

    <Route component={createAsyncViewComponent(AuditLogView)} path={auditlogPath} />
  </Switch>
);
