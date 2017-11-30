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

const rolesConfigViewPath = '/config/rolesConfig';
export const rolesConfigViewLink$ = buildUrlStream({ path: rolesConfigViewPath });
export const isRolesConfigView$ = buildPathStartsWithStream(rolesConfigViewPath);

export function getRoleConfigLink(roleId) {
  return getModifiedUrlStream(params => (params.pathname = getRoleConfigPath(roleId)));
}

export function openRoleConfig(roleId) {
  mutateUrl(params => (params.pathname = getRoleConfigPath(roleId)));
}

export function openRoles() {
  mutateUrl(params => (params.pathname = '/config/rolesConfig'));
}

function getRoleConfigPath(roleId) {
  return `/config/rolesConfig/${encodeURIComponent(roleId)}`;
}

const apiTokensViewPath = '/config/apiTokens';
export const apiTokensViewLink$ = buildUrlStream({ path: apiTokensViewPath });
export const isApiTokensView$ = buildPathStartsWithStream(apiTokensViewPath);

export function openApiTokenConfig(apiTokenId) {
  mutateUrl(params => (params.pathname = getApiTokenConfigPath(apiTokenId)));
}

export function openApiTokens() {
  mutateUrl(params => (params.pathname = apiTokensViewPath));
}

export function getApiTokenConfigLink(apiTokenId) {
  return getModifiedUrlStream(params => (params.pathname = getApiTokenConfigPath(apiTokenId)));
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
  return getModifiedUrlStream(params => (params.pathname = getRulePath(id)));
}

export function openRule(id) {
  mutateUrl(params => (params.pathname = getRulePath(id)));
}

function getRulesPath() {
  return rulesViewPath;
}

export function openRules() {
  mutateUrl(params => (params.pathname = getRulesPath()));
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
  mutateUrl(params => (params.pathname = alertingConfigPath));
}

export function openAlertingConfigurations() {
  mutateUrl(params => (params.pathname = alertingConfigsPath));
}

export function getAlertingConfigLink(id) {
  return getModifiedUrlStream(params => (params.pathname = getAlertingConfigPath(id)));
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
  mutateUrl(params => {
    params.pathname = integrationPath;
    params.matrix.kind = kind;
    return params;
  });
}

export function openIntegrations() {
  mutateUrl(params => {
    params.pathname = integrationsPath;
    delete params.matrix.kind;
    return params;
  });
}
export function getIntegrationLink(id) {
  return getModifiedUrlStream(params => (params.pathname = getIntegrationPath(id)));
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
  return getModifiedUrlStream(params => (params.pathname = getRuleBindingPath(id)));
}

export function openRuleBinding(id) {
  mutateUrl(params => (params.pathname = getRuleBindingPath(id)));
}

function getRuleBindingsPath() {
  return ruleBindingsViewPath;
}

export function openRuleBindings() {
  mutateUrl(params => (params.pathname = getRuleBindingsPath()));
}

// end custom alerting rules ------------------------------------

// service extraction ----------------------------------------
function getServiceExtractionRuleConfigPath(ruleId, ruleType) {
  return ruleId
    ? `/config/${encodeURIComponent(ruleType)}/serviceExtraction/${encodeURIComponent(ruleId)}`
    : `/config/${encodeURIComponent(ruleType)}/serviceExtraction`;
}

export function getServiceRuleConfigLink(id, ruleType) {
  return getModifiedUrlStream(params => (params.pathname = getServiceExtractionRuleConfigPath(id, ruleType)));
}

export function openServiceExtractionConfig(objectiveId, ruleType) {
  mutateUrl(params => (params.pathname = getServiceExtractionRuleConfigPath(objectiveId, ruleType)));
}

export function openServiceExtractionConfigByDefinition(definition) {
  mutateUrl(params => (params.pathname = definition.pathname));
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
  mutateUrl(params => (params.pathname = getDynamicRulesPath()));
}

export function openDynamicRule(id) {
  mutateUrl(params => (params.pathname = getDynamicRulePath(id)));
}

export function getDynamicRuleLink(id) {
  return getModifiedUrlStream(params => (params.pathname = getDynamicRulePath(id)));
}
// end dynamic rules ---------------------------------------------
