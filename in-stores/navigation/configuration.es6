import {
  buildUrlStream,
  buildPathStartsWithStream,
  getModifiedUrlStream,
  mutateUrl
} from 'in-stores/navigation/navigation';

export const configurationViewLink$ = buildUrlStream({ path: '/config' });

export const httpServiceExtractionConfigViewPath = '/config/httpServiceExtraction';
export const httpServiceExtractionConfigurationViewLink$ = buildUrlStream({
  path: httpServiceExtractionConfigViewPath
});
export const isHttpServiceExtractionConfigurationView$ = buildPathStartsWithStream(httpServiceExtractionConfigViewPath);

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

export const eumServiceExtractionConfigViewPath = '/config/eumServiceExtraction';
export const eumServiceExtractionConfigurationViewLink$ = buildUrlStream({
  path: eumServiceExtractionConfigViewPath
});
export const isEumServiceExtractionConfigurationView$ = buildPathStartsWithStream(eumServiceExtractionConfigViewPath);

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

function getObjectiveConfigPath(objectiveId) {
  return `/config/objectives/${encodeURIComponent(objectiveId)}`;
}

export function getObjectivesConfigLink(id) {
  return getModifiedUrlStream(params => (params.pathname = getObjectiveConfigPath(id)));
}

export function openObjectiveConfig(objectiveId) {
  mutateUrl(params => (params.pathname = getObjectiveConfigPath(objectiveId)));
}

function getObjectivesConfigPath() {
  return `/config/objectives`;
}

export function openObjectivesConfig() {
  mutateUrl(params => (params.pathname = getObjectivesConfigPath()));
}

const objectiveViewPath = '/config/objectives';
export const objectiveViewLink$ = buildUrlStream({ path: objectiveViewPath });
export const isObjectivesView$ = buildPathStartsWithStream(objectiveViewPath);

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

// binding
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
