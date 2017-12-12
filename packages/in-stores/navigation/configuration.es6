import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import {
  buildUrlStream,
  buildPathStartsWithStream,
  getModifiedUrlStream,
  mutateUrl
} from 'in-stores/navigation/navigation';

export const configurationViewLink$ = buildUrlStream({ path: '/config/userInterface' });

export const generalServiceExtractionConfigViewPath = '/config/generalServiceExtraction';
export const generalServiceExtractionConfigurationViewLink$ = buildUrlStream({
  path: generalServiceExtractionConfigViewPath
});
export const isGeneralServiceExtractionConfigurationView$ = buildPathStartsWithStream(
  generalServiceExtractionConfigViewPath
);

export const httpServiceExtractionConfigViewPath = '/config/httpServiceExtraction';
export const httpServiceExtractionConfigurationViewLink$ = buildUrlStream({
  path: httpServiceExtractionConfigViewPath
});
export const isHttpServiceExtractionConfigurationView$ = buildPathStartsWithStream(httpServiceExtractionConfigViewPath);

export const batchServiceExtractionConfigViewPath = '/config/batchServiceExtraction';
export const batchServiceExtractionConfigurationViewLink$ = buildUrlStream({
  path: batchServiceExtractionConfigViewPath
});
export const isBatchServiceExtractionConfigurationView$ = buildPathStartsWithStream(
  batchServiceExtractionConfigViewPath
);

export const ejbServiceExtractionConfigViewPath = '/config/ejbServiceExtraction';
export const ejbServiceExtractionConfigurationViewLink$ = buildUrlStream({ path: ejbServiceExtractionConfigViewPath });
export const isEjbServiceExtractionConfigurationView$ = buildPathStartsWithStream(ejbServiceExtractionConfigViewPath);

export const elasticsearchServiceExtractionConfigViewPath = '/config/elasticsearchServiceExtraction';
export const elasticsearchServiceExtractionConfigurationViewLink$ = buildUrlStream({
  path: elasticsearchServiceExtractionConfigViewPath
});
export const isElasticsearchServiceExtractionConfigurationView$ = buildPathStartsWithStream(
  elasticsearchServiceExtractionConfigViewPath
);

export const messageBrokerServiceExtractionConfigViewPath = '/config/messageBrokerServiceExtraction';
export const messageBrokerServiceExtractionConfigurationViewLink$ = buildUrlStream({
  path: messageBrokerServiceExtractionConfigViewPath
});
export const isMessageBrokerServiceExtractionConfigurationView$ = buildPathStartsWithStream(
  messageBrokerServiceExtractionConfigViewPath
);

const userInterfaceConfigViewPath = '/config/userInterface';
export const userInterfaceConfigViewLink$ = buildUrlStream({ path: userInterfaceConfigViewPath });
export const isUserInterfaceConfigView$ = buildPathStartsWithStream(userInterfaceConfigViewPath);

const eumKeysViewPath = '/config/eumKeys';
export const eumKeysViewLink$ = buildUrlStream({ path: eumKeysViewPath });
export const isEumKeysView$ = buildPathStartsWithStream(eumKeysViewPath);

const userManagementViewPath = '/config/users';
export const userManagementViewLink$ = buildUrlStream({ path: userManagementViewPath });
export const isUserManagementView$ = buildPathStartsWithStream(userManagementViewPath);

const rolesConfigViewPath = '/config/rolesConfigs';
const roleConfigViewPath = '/config/rolesConfig';
export const rolesConfigViewLink$ = buildUrlStream({ path: rolesConfigViewPath });
export const isRolesConfigView$ = buildPathStartsWithStream(roleConfigViewPath);

export function getRoleConfigLink(roleId) {
  return getModifiedUrlStream(location => (location.pathname = getRoleConfigPath(roleId)));
}

export function openRoleConfig(roleId) {
  mutateUrl(location => (location.pathname = getRoleConfigPath(roleId)));
}

export function openRoles() {
  mutateUrl(location => (location.pathname = '/config/rolesConfigs'));
}

function getRoleConfigPath(roleId) {
  return roleId ? `${roleConfigViewPath}/${encodeURIComponent(roleId)}` : roleConfigViewPath;
}

const apiTokensViewPath = '/config/apiTokens';
export const apiTokensViewLink$ = buildUrlStream({ path: apiTokensViewPath });
export const isApiTokensView$ = buildPathStartsWithStream(apiTokensViewPath);

export function openApiTokenConfig(apiTokenId) {
  mutateUrl(location => (location.pathname = getApiTokenConfigPath(apiTokenId)));
}

export function openApiTokens() {
  mutateUrl(location => (location.pathname = apiTokensViewPath));
}

export function getApiTokenConfigLink(apiTokenId) {
  return getModifiedUrlStream(location => (location.pathname = getApiTokenConfigPath(apiTokenId)));
}

function getApiTokenConfigPath(apiTokenId) {
  return `/config/apiTokens/${encodeURIComponent(apiTokenId)}`;
}

const auditLogViewPath = '/config/auditlog';
export const auditLogViewLink$ = buildUrlStream({ path: auditLogViewPath });
export const isAuditLogView$ = buildPathStartsWithStream(auditLogViewPath);

// custom alerting rules ------------------------------------
// rule
const ruleViewPath = '/config/rule';
const rulesViewPath = '/config/rules';
export const rulesViewLink$ = buildUrlStream({ path: rulesViewPath });
export const isRulesViewLink$ = buildPathStartsWithStream(ruleViewPath);

function getRulePath(id) {
  return id ? `${ruleViewPath}/${encodeURIComponent(id)}` : ruleViewPath;
}

export function getRuleLink(id) {
  return getModifiedUrlStream(location => (location.pathname = getRulePath(id)));
}

export function openRule(id) {
  mutateUrl(location => (location.pathname = getRulePath(id)));
}

function getRulesPath() {
  return rulesViewPath;
}

export function openRules() {
  mutateUrl(location => (location.pathname = getRulesPath()));
}

// alerting config ------------------------------------
const alertingConfigPath = '/config/alertingConfiguration';
const alertingConfigsPath = '/config/alertingConfigurations';
export const alertingConfigsViewLink$ = buildUrlStream({ path: alertingConfigsPath });
export const isAlertingConfigLink$ = buildPathStartsWithStream(alertingConfigPath);

function getAlertingConfigPath(id) {
  return id ? `${alertingConfigPath}/${encodeURIComponent(id)}` : alertingConfigPath;
}

export function openAlertingConfiguration() {
  mutateUrl(location => (location.pathname = alertingConfigPath));
}

export function openAlertingConfigurations() {
  mutateUrl(location => (location.pathname = alertingConfigsPath));
}

export function getAlertingConfigLink(id) {
  return getModifiedUrlStream(location => (location.pathname = getAlertingConfigPath(id)));
}

// integrations ------------------------------------
const integrationPath = '/config/integration';
const integrationsPath = '/config/integrations';
export const integrationsViewLink$ = buildUrlStream({ path: integrationsPath });
export const isIntegrationLink$ = buildPathStartsWithStream(integrationPath);

function getIntegrationPath(id) {
  return id ? `${integrationPath}/${encodeURIComponent(id)}` : integrationPath;
}

export function openIntegration(kind) {
  mutateUrl(location => {
    location.pathname = integrationPath;
    setOrDeleteMatrixKey(location, '/integration', 'kind', kind);
  });
}

export function openIntegrations() {
  mutateUrl(location => (location.pathname = integrationsPath));
}
export function getIntegrationLink(id) {
  return getModifiedUrlStream(location => (location.pathname = getIntegrationPath(id)));
}

// binding ------------------------------------
const ruleBindingViewPath = '/config/binding';
const ruleBindingsViewPath = '/config/bindings';
export const ruleBindingsViewLink$ = buildUrlStream({ path: ruleBindingsViewPath });
export const isRuleBindingsViewLink$ = buildPathStartsWithStream(ruleBindingViewPath);

function getRuleBindingPath(id) {
  return id ? `${ruleBindingViewPath}/${encodeURIComponent(id)}` : ruleBindingViewPath;
}

export function getRuleBindingLink(id) {
  return getModifiedUrlStream(location => (location.pathname = getRuleBindingPath(id)));
}

export function openRuleBinding(id) {
  mutateUrl(location => (location.pathname = getRuleBindingPath(id)));
}

function getRuleBindingsPath() {
  return ruleBindingsViewPath;
}

export function openRuleBindings() {
  mutateUrl(location => (location.pathname = getRuleBindingsPath()));
}

// end custom alerting rules ------------------------------------

// service extraction ----------------------------------------
function getServiceExtractionRuleConfigPath(ruleId, ruleType) {
  return ruleId
    ? `/config/${encodeURIComponent(ruleType)}/serviceExtraction/${encodeURIComponent(ruleId)}`
    : `/config/${encodeURIComponent(ruleType)}/serviceExtraction`;
}

export function getServiceRuleConfigLink(id, ruleType) {
  return getModifiedUrlStream(location => (location.pathname = getServiceExtractionRuleConfigPath(id, ruleType)));
}

export function openServiceExtractionConfig(objectiveId, ruleType) {
  mutateUrl(location => (location.pathname = getServiceExtractionRuleConfigPath(objectiveId, ruleType)));
}

export function openServiceExtractionConfigByDefinition(definition) {
  mutateUrl(location => (location.pathname = definition.pathname));
}
// end service extraction ------------------------------------

// dynamic rules ---------------------------------------------
const dynamicRulesViewPath = '/config/dynamicRules';
const dynamicRuleViewPath = '/config/dynamicRule';
export const dynamicRulesViewLink$ = buildUrlStream({ path: dynamicRulesViewPath });
export const isDynamicRulesView$ = buildPathStartsWithStream(dynamicRuleViewPath);

function getDynamicRulePath(id) {
  return id ? `${dynamicRuleViewPath}/${encodeURIComponent(id)}` : dynamicRuleViewPath;
}

function getDynamicRulesPath() {
  return dynamicRulesViewPath;
}

export function openDynamicRules() {
  mutateUrl(location => (location.pathname = getDynamicRulesPath()));
}

export function openDynamicRule(id) {
  mutateUrl(location => (location.pathname = getDynamicRulePath(id)));
}

export function getDynamicRuleLink(id) {
  return getModifiedUrlStream(location => (location.pathname = getDynamicRulePath(id)));
}
// end dynamic rules ---------------------------------------------
