import {
  buildUrlStream,
  buildPathStartsWithStream,
  getModifiedUrlStream,
  mutateUrl
} from 'in-stores/navigation/navigation';

export const configurationViewLink$ = buildUrlStream({path: '/config'});

const httpServiceExtractionConfigViewPath = '/config/httpServiceExtraction';
export const httpServiceExtractionConfigurationViewLink$ = buildUrlStream({path: httpServiceExtractionConfigViewPath});
export const isHttpServiceExtractionConfigurationView$ = buildPathStartsWithStream(httpServiceExtractionConfigViewPath);

const ejbServiceExtractionConfigViewPath = '/config/ejbServiceExtraction';
export const ejbServiceExtractionConfigurationViewLink$ = buildUrlStream({path: ejbServiceExtractionConfigViewPath});
export const isEjbServiceExtractionConfigurationView$ = buildPathStartsWithStream(ejbServiceExtractionConfigViewPath);

const elasticsearchServiceExtractionConfigViewPath = '/config/elasticsearchServiceExtraction';
export const elasticsearchServiceExtractionConfigurationViewLink$ = buildUrlStream({path: elasticsearchServiceExtractionConfigViewPath});
export const isElasticsearchServiceExtractionConfigurationView$ = buildPathStartsWithStream(elasticsearchServiceExtractionConfigViewPath);

const userInterfaceConfigViewPath = '/config/userInterface';
export const userInterfaceConfigViewLink$ = buildUrlStream({path: userInterfaceConfigViewPath});
export const isUserInterfaceConfigView$ = buildPathStartsWithStream(userInterfaceConfigViewPath);

const eumKeysViewPath = '/config/eumKeys';
export const eumKeysViewLink$ = buildUrlStream({path: eumKeysViewPath});
export const isEumKeysView$ = buildPathStartsWithStream(eumKeysViewPath);

const userManagementViewPath = '/config/users';
export const userManagementViewLink$ = buildUrlStream({path: userManagementViewPath});
export const isUserManagementView$ = buildPathStartsWithStream(userManagementViewPath);

const rolesConfigViewPath = '/config/rolesConfig';
export const rolesConfigViewLink$ = buildUrlStream({path: rolesConfigViewPath});
export const isRolesConfigView$ = buildPathStartsWithStream(rolesConfigViewPath);

export function getRoleConfigLink(roleId) {
  return getModifiedUrlStream(params => params.pathname = getRoleConfigPath(roleId));
}

export function openRoleConfig(roleId) {
  mutateUrl(params => params.pathname = getRoleConfigPath(roleId));
}

export function openRoles() {
  mutateUrl(params => params.pathname = '/config/rolesConfig');
}

function getRoleConfigPath(roleId) {
  return `/config/rolesConfig/${encodeURIComponent(roleId)}`;
}

const apiTokensViewPath = '/config/apiTokens';
export const apiTokensViewLink$ = buildUrlStream({path: apiTokensViewPath});
export const isApiTokensView$ = buildPathStartsWithStream(apiTokensViewPath);

export function openApiTokenConfig(apiTokenId) {
  mutateUrl(params => params.pathname = getApiTokenConfigPath(apiTokenId));
}

export function openApiTokens() {
  mutateUrl(params => params.pathname = apiTokensViewPath);
}

export function getApiTokenConfigLink(apiTokenId) {
  return getModifiedUrlStream(params => params.pathname = getApiTokenConfigPath(apiTokenId));
}

function getApiTokenConfigPath(apiTokenId) {
  return `/config/apiTokens/${encodeURIComponent(apiTokenId)}`;
}


const alertsViewPath = '/config/alerts';
export const alertsViewLink$ = buildUrlStream({path: alertsViewPath});
export const isAlertsViewLink$ = buildPathStartsWithStream(alertsViewPath);

function getAlertConfigPath(alertId) {
  return `/config/alerts/${encodeURIComponent(alertId)}`;
}

export function getAlertsConfigLink(id) {
  return getModifiedUrlStream(params => params.pathname = getAlertConfigPath(id));
}

export function openAlertConfig(alertId) {
  mutateUrl(params => params.pathname = getAlertConfigPath(alertId));
}

function getAlertsConfigPath() {
  return `/config/alerts`;
}

export function openAlertsConfig() {
  mutateUrl(params => params.pathname = getAlertsConfigPath());
}


const auditLogViewPath = '/config/auditlog';
export const auditLogViewLink$ = buildUrlStream({path: auditLogViewPath});
export const isAuditLogView$ = buildPathStartsWithStream(auditLogViewPath);



function getObjectiveConfigPath(objectiveId) {
  return `/config/objectives/${encodeURIComponent(objectiveId)}`;
}

export function getObjectivesConfigLink(id) {
  return getModifiedUrlStream(params => params.pathname = getObjectiveConfigPath(id));
}

export function openObjectiveConfig(objectiveId) {
  mutateUrl(params => params.pathname = getObjectiveConfigPath(objectiveId));
}

function getObjectivesConfigPath() {
  return `/config/objectives`;
}

export function openObjectivesConfig() {
  mutateUrl(params => params.pathname = getObjectivesConfigPath());
}

const objectiveViewPath = '/config/objectives';
export const objectiveViewLink$ = buildUrlStream({path: objectiveViewPath});
export const isObjectivesView$ = buildPathStartsWithStream(objectiveViewPath);
