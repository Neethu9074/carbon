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

const alertsViewPath = '/config/alerting';
export const alertsViewLink$ = buildUrlStream({path: alertsViewPath});
export const isAlertsViewLink$ = buildPathStartsWithStream(alertsViewPath);

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

function getAlertConfigPath(alertId) {
  return `/config/alertConfig/${encodeURIComponent(alertId)}`;
}

export function openAlertConfig(alertId) {
  mutateUrl(params => params.pathname = getAlertConfigPath(alertId));
}

function getAlertsConfigPath() {
  return `/config/alerting`;
}

export function openAlertsConfig() {
  mutateUrl(params => params.pathname = getAlertsConfigPath());
}
