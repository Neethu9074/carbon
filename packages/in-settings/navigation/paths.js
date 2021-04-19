/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getView, mutateUrl } from 'in-stores/navigation';

export const settingsBasePath = settingsPath;

export const userSettings = `${settingsBasePath}/user`;

export const userSettingsGeneral = `${userSettings}/general`;
export const userSettingsAdvanced = `${userSettings}/advanced`;
export const userSettingsPrivacy = `${userSettings}/privacy`;
export const userSettingsCommunication = `${userSettings}/communications`;

export const teamSettings = `${settingsPath}/team`;

const accessControl = `${teamSettings}/accessControl`;
export const teamSettingsAccessControlUsers = `${accessControl}/users`;
export const teamSettingsAccessControlUserEdit = `${accessControl}/users/:id`;
export const teamSettingsAccessControlInvites = `${accessControl}/invites`;
export const teamSettingsAccessControlRoleEdit = `${accessControl}/roles/:id`;
export const teamSettingsAccessControlRoleNew = `${accessControl}/roles/new`;
export const teamSettingsAccessControlRoles = `${accessControl}/roles`;
export const teamSettingsAccessControlGroupEdit = `${accessControl}/groups/:id`;
export const teamSettingsAccessControlGroupNew = `${accessControl}/groups/new`;
export const teamSettingsAccessControlGroups = `${accessControl}/groups`;
export const teamSettingsAccessControlApiTokenEdit = `${accessControl}/apiTokens/:id`;
export const teamSettingsAccessControlApiTokens = `${accessControl}/apiTokens`;

export const authSettings = `${settingsPath}/auth`;

export const changePassword = `${authSettings}/password/change`;

export const googleSSO = `${authSettings}/googleSingleSignOn`;
export const saml = `${authSettings}/saml`;
export const oidc = `${authSettings}/oidc`;
export const ldap = `${authSettings}/ldap`;

export const twoFactorAuth = `${authSettings}/2fa`;
export const twoFaUsers = `${twoFactorAuth}/users`;

const session = `${authSettings}/session`;
export const timeouts = `${session}/timeouts`;

const mapping = `${authSettings}/mapping`;
export const samlMapping = `${mapping}/saml`;
export const ldapMapping = `${mapping}/ldap`;

export const alerting = `${teamSettings}/alerting`;
const channels = `/channels`;

// amp
export const ampSettings = `${settingsPath}/amp`;
export const ampAccountSettings = `${ampSettings}/account`;
export const ampUsage = `${ampSettings}/usage`;
export const ampTechnologies = `${ampSettings}/technologies`;

// current events & alerting configuration paths (after unification of alerting configuration in 2019-02)
export const teamSettingsAlertingEventBuiltIn = `${alerting}/events/builtIn`;
export const teamSettingsAlertingEventBuiltInEdit = `${alerting}/events/builtIn/:id`;
export const teamSettingsAlertingEventCustom = `${alerting}/events/custom`;
export const teamSettingsAlertingEventCustomEdit = `${alerting}/events/custom/:id`;
export const teamSettingsAlertingEventCustomNew = `${alerting}/events/custom/new`;
export const teamSettingsAlertingEvents = `${alerting}/events`;
export const teamSettingsAlertingAlertEdit = `${alerting}/alerts/:id`;
export const teamSettingsAlertingAlertNew = `${alerting}/alerts/new`;
export const teamSettingsAlertingAlerts = `${alerting}/alerts`;
export const teamSettingsAlertingAlertChannelEdit = `${alerting}${channels}/:id`;
export const teamSettingsAlertingAlertChannelEditDetails = `${alerting}${channels}/detail/:id`;
export const teamSettingsAlertingAlertChannelNew = `${alerting}${channels}/new`;
export const teamSettingsAlertingAlertChannels = `${alerting}${channels}`;
export const teamSettingsAlertingMaintenanceConfigurationEdit = `${alerting}/maintenanceConfigurations/:id`;
export const teamSettingsAlertingMaintenanceConfigurationNew = `${alerting}/maintenanceConfigurations/new`;
export const teamSettingsAlertingMaintenanceConfigurations = `${alerting}/maintenanceConfigurations`;
export const teamSettingsAlertingCustomPayloadConfiguration = `${alerting}/customPayload`;
export const teamSettingsAlertingHub = `${alerting}/hub`;

// legacy knowledge management paths (prior to unification of alerting configuration in 2019-02)
const knowledgeManagement = `${teamSettings}/knowledgeManagement`;
export const teamSettingsKnowledgeManagementBuiltInRuleEdit = `${knowledgeManagement}/builtInRules/:id`;
export const teamSettingsKnowledgeManagementBuiltInRules = `${knowledgeManagement}/builtInRules`;
export const teamSettingsKnowledgeManagementCustomRuleEdit = `${knowledgeManagement}/customRules/:id`;
export const teamSettingsKnowledgeManagementCustomRuleNew = `${knowledgeManagement}/customRules/new`;
export const teamSettingsKnowledgeManagementCustomRules = `${knowledgeManagement}/customRules`;
export const teamSettingsKnowledgeManagementCustomIssues = `${knowledgeManagement}/customIssues`;
export const teamSettingsKnowledgeManagementCustomIssueEdit = `${knowledgeManagement}/customIssues/:id`;
export const teamSettingsKnowledgeManagementCustomIssueNew = `${knowledgeManagement}/customIssues/new`;
export const teamSettingsKnowledgeManagementCustomDynamicRuleEdit = `${knowledgeManagement}/customDynamicRules/:id`;
export const teamSettingsKnowledgeManagementCustomDynamicRuleNew = `${knowledgeManagement}/customDynamicRules/new`;
export const teamSettingsKnowledgeManagementCustomDynamicRules = `${knowledgeManagement}/customDynamicRules`;

// legacy alerting paths (prior to unification of alerting configuration in 2019-02)
export const teamSettingsAlertingConfigurationEdit = `${alerting}/configurations/:id`;
export const teamSettingsAlertingConfigurationNew = `${alerting}/configurations/new`;
export const teamSettingsAlertingConfigurations = `${alerting}/configurations`;
export const teamSettingsAlertingIntegrationEdit = `${alerting}/integrations/:id`;
export const teamSettingsAlertingIntegrationNew = `${alerting}/integrations/new`;
export const teamSettingsAlertingIntegrations = `${alerting}/integrations`;

const logManagement = `${teamSettings}/logManagement`;
export const teamSettingsLogManagementCoralogix = `${logManagement}/coralogixConfiguration`;
export const teamSettingsLogManagementLogDna = `${logManagement}/logdnaConfiguration`;
export const teamSettingsLogManagementSplunk = `${logManagement}/splunkConfiguration`;
export const teamSettingsLogManagementHumio = `${logManagement}/humioConfiguration`;
export const teamSettingsLogManagementElk = `${logManagement}/elkConfiguration`;

const audit = `${teamSettings}/audit`;
export const teamSettingsAuditLog = `${audit}/log`;

export function getEntityHref(path, id) {
  if (id) {
    return `${path}/${encodeURIComponent(id)}`;
  }
  return path;
}

export function getEntityIdView(path, id) {
  if (id) {
    path = `${path}/${encodeURIComponent(id)}`;
  }
  return getView(path);
}

export function goToIntegrationView(kind) {
  mutateUrl(location => {
    location.pathname = teamSettingsAlertingIntegrationNew;
    setOrDeleteMatrixKey(location, '/integrations', 'kind', kind);
  });
}

export function goToAlertChannelView(kind) {
  mutateUrl(location => {
    location.pathname = teamSettingsAlertingAlertChannelNew;
    setOrDeleteMatrixKey(location, '/channels', 'kind', kind);
  });
}

export function getModifyAlertChannelUrl(kind, entityId) {
  return `#${alerting}${channels};kind=${kind}/detail/${encodeURIComponent(entityId)}`;
}
