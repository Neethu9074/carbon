/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

// eslint-disable-next-line
import { getView, mutateUrl } from 'in-stores/navigation';
import { settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const settingsBasePath = settingsPath;

export const userSettings = `${settingsBasePath}/user`;

export const userSettingsGeneral = `${userSettings}/general`;
export const userSettingsAdvanced = `${userSettings}/advanced`;
export const userSettingsPrivacy = `${userSettings}/privacy`;
export const userSettingsCommunication = `${userSettings}/communications`;
export const userSettingsPersonalApiTokens = `${userSettings}/personal-api-tokens`;
export const userSettingsPasswordChange = `${userSettings}/password/change`;
export const userSettingsTwoFactor = `${userSettings}/2fa`;
export const userSettingsProfile = `${userSettings}/profile`;

export const globalSettings = `${settingsPath}/global`;

export const securityAndAccessSettings = `${settingsPath}/securityAndAccess`;
export const accessControl = `${securityAndAccessSettings}/accessControl`;
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
export const teamSettingsAccessControlApiTokenDuplicate = `${accessControl}/apiTokens/new/:duplicateFrom`;
export const teamSettingsAccessControlApiTokenNew = `${accessControl}/apiTokens/new`;
export const teamSettingsAccessControlApiTokens = `${accessControl}/apiTokens`;

export const googleSSO = `${securityAndAccessSettings}/googleSingleSignOn`;
export const saml = `${securityAndAccessSettings}/saml`;
export const oidc = `${securityAndAccessSettings}/oidc`;
export const ldap = `${securityAndAccessSettings}/ldap`;
export const groupMapping = `${securityAndAccessSettings}/groupMapping`;

const session = `${securityAndAccessSettings}/session`;
export const timeouts = `${session}/timeouts`;

export const alerting = `${globalSettings}/alerting`;
const channels = `/channels`;

// amp
export const ampSettings = `${settingsPath}/amp`;
export const ampAccountSettings = `${ampSettings}/account`;
export const ampUsage = `${ampSettings}/usage`;
export const ampTechnologies = `${ampSettings}/technologies`;
export const ampActivationAdoption = `${ampSettings}/activationAdoption`;

// current events & alerting configuration paths (after unification of alerting configuration in 2019-02)
export const events = `/events`;
export const teamSettingsAlertingEventBuiltIn = `${alerting}${events}/builtIn`;
export const teamSettingsAlertingEventBuiltInEdit = `${alerting}${events}/builtIn/:id`;
export const teamSettingsAlertingEventCustom = `${alerting}${events}/custom`;
export const teamSettingsAlertingEventCustomEdit = `${alerting}${events}/custom/:id`;
export const teamSettingsAlertingEventCustomNew = `${alerting}${events}/custom/new`;
export const teamSettingsAlertingEvents = `${alerting}${events}`;
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

// legacy knowledge management paths (prior to unification of alerting configuration in 2019-02)
const knowledgeManagement = `${globalSettings}/knowledgeManagement`;
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

// legacy logging integration paths (until 2024-07)
export const logManagement = `${globalSettings}/logManagement`;
const legacyIntegrations = '/integrations';
export const teamSettingsLogManagementRetentionPeriod = `${logManagement}/retentionPeriod`;
export const teamSettingsLogManagementIntegrations = `${logManagement}${legacyIntegrations}`;
export const teamSettingsLogManagementCoralogix = `${logManagement}${legacyIntegrations}/coralogixConfiguration`;
export const teamSettingsLogManagementDeleteLogs = `${logManagement}/deleteLogs`;
export const teamSettingsLogManagementLogVolume = `${logManagement}/logVolume`;
export const teamSettingsLogManagementMezmo = `${logManagement}/mezmoConfiguration`;
export const teamSettingsLogManagementSplunk = `${logManagement}/splunkConfiguration`;
export const teamSettingsLogManagementHumio = `${logManagement}/humioConfiguration`;
export const teamSettingsLogManagementElk = `${logManagement}/elkConfiguration`;

export const teamSettingsAudit = `${securityAndAccessSettings}/audit`;
export const teamSettingsActionLog = `${teamSettingsAudit}/actionlog`;
export const teamSettingsActionLogRetention = `${teamSettingsAudit}/actionlog/retention`;
export const teamSettingsAccessLog = `${teamSettingsAudit}/accessLog`;

// integrations
const integrations = `${globalSettings}/integrations`;
// database integrations
export const teamSettingsIntegrationsDatabase = `${integrations}/database`;
export const teamSettingsIntegrationsDatabaseDbMarlin = `${teamSettingsIntegrationsDatabase}/dbMarlinConfiguration`;
// logging integrations (from 2024-07)
export const teamSettingsIntegrationsLogging = `${integrations}/logging`;
export const teamSettingsIntegrationsLoggingCoralogix = `${teamSettingsIntegrationsLogging}/coralogixConfiguration`;
export const teamSettingsIntegrationsLoggingMezmo = `${teamSettingsIntegrationsLogging}/mezmoConfiguration`;
export const teamSettingsIntegrationsLoggingSplunk = `${teamSettingsIntegrationsLogging}/splunkConfiguration`;
export const teamSettingsIntegrationsLoggingHumio = `${teamSettingsIntegrationsLogging}/humioConfiguration`;
export const teamSettingsIntegrationsLoggingElk = `${teamSettingsIntegrationsLogging}/elkConfiguration`;

// config migration
export const migSettings = `${settingsPath}/migration`;
export const migExportSettings = `${migSettings}/export`;
export const migImportSettings = `${migSettings}/import`;

export function getEntityHref(path: string, id: string): string {
  if (id) {
    return `${path}/${encodeURIComponent(id)}`;
  }
  return path;
}

export function getEntityIdView(path: string, id: string): Observable<string> {
  if (id) {
    path = `${path}/${encodeURIComponent(id)}`;
  }
  // eslint-disable-next-line
  return getView(path);
}

export function goToIntegrationView(kind: string): void {
  // eslint-disable-next-line
  mutateUrl(location => {
    location.pathname = teamSettingsAlertingIntegrationNew;
    setOrDeleteMatrixKey(location, '/integrations', 'kind', kind);
  });
}

export function goToAlertChannelView(kind: string): void {
  // eslint-disable-next-line
  mutateUrl(location => {
    location.pathname = teamSettingsAlertingAlertChannelNew;
    setOrDeleteMatrixKey(location, '/channels', 'kind', kind);
  });
}

export function getModifyAlertChannelUrl(kind: string, entityId: string): string {
  return `#${alerting}${channels};kind=${kind}/detail/${encodeURIComponent(entityId)}`;
}
