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

export const teamSettings = `${settingsPath}/team`;
export const accessControl = `${teamSettings}/accessControl`;

export const globalSettings = `${settingsPath}/global`;

export const securityAndAccess = `${settingsPath}/securityAndAccess`;
export const securityAndAccessAccessControl = `${securityAndAccess}/accessControl`;

// current access control configuration paths (after unification of access control permissions in 2024)
export const securityAndAccessAccessControlUsers = `${securityAndAccessAccessControl}/users`;
export const securityAndAccessAccessControlUserEdit = `${securityAndAccessAccessControl}/users/:id`;
export const securityAndAccessAccessControlInvites = `${securityAndAccessAccessControl}/invites`;
export const securityAndAccessAccessControlRoleEdit = `${securityAndAccessAccessControl}/roles/:id`;
export const securityAndAccessAccessControlRoleNew = `${securityAndAccessAccessControl}/roles/new`;
export const securityAndAccessAccessControlRoles = `${securityAndAccessAccessControl}/roles`;
export const securityAndAccessAccessControlGroupEdit = `${securityAndAccessAccessControl}/groups/:id`;
export const securityAndAccessAccessControlGroupNew = `${securityAndAccessAccessControl}/groups/new`;
export const securityAndAccessAccessControlGroups = `${securityAndAccessAccessControl}/groups`;
export const securityAndAccessAccessControlApiTokenEdit = `${securityAndAccessAccessControl}/apiTokens/:id`;
export const securityAndAccessAccessControlApiTokenDuplicate = `${securityAndAccessAccessControl}/apiTokens/new/:duplicateFrom`;
export const securityAndAccessAccessControlApiTokenNew = `${securityAndAccessAccessControl}/apiTokens/new`;
export const securityAndAccessAccessControlApiTokens = `${securityAndAccessAccessControl}/apiTokens`;
export const securityAndAccessAccessControlTeams = `${securityAndAccessAccessControl}/teams`;
export const securityAndAccessAccessControlTeamEdit = `${securityAndAccessAccessControl}/teams/:id`;
export const securityAndAccessAccessControlTeamNew = `${securityAndAccessAccessControl}/teams/new`;

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

export const authSettings = `${settingsPath}/auth`;

export const googleSSO = `${authSettings}/googleSingleSignOn`;
export const saml = `${authSettings}/saml`;
export const oidc = `${authSettings}/oidc`;
export const ldap = `${authSettings}/ldap`;
export const groupMapping = `${authSettings}/groupMapping`;

// current auth settings paths (after unification of access control permissions in 2024)
export const securityAndAccessAuth = `${securityAndAccess}/auth`;
export const securityAndAccessIdentityProviders = `${securityAndAccessAuth}/identityProviders`;
export const securityAndAccessGoogleSSO = `${securityAndAccessAuth}/googleSingleSignOn`;
export const securityAndAccessSaml = `${securityAndAccessAuth}/saml`;
export const securityAndAccessOidc = `${securityAndAccessAuth}/oidc`;
export const securityAndAccessLdap = `${securityAndAccessAuth}/ldap`;
export const securityAndAccessGroupMapping = `${securityAndAccessAuth}/groupMapping`;
export const securityAndAccessRoleMapping = `${securityAndAccessAuth}/roleMapping`;

const session = `${authSettings}/session`;
export const timeouts = `${session}/timeouts`;

// current session settings paths (after unification of access control permissions in 2024)
const securityAndAccessSession = `${securityAndAccess}/session`;
export const securityAndAccessTimeouts = `${securityAndAccessSession}/timeouts`;

export const alerting = `${teamSettings}/alerting`;
const channels = `/channels`;

// amp
export const ampSettings = `${settingsPath}/amp`;
export const ampAccountSettings = `${ampSettings}/account`;
export const ampUsage = `${ampSettings}/usage`;
export const ampTechnologies = `${ampSettings}/technologies`;
export const ampActivationAdoption = `${ampSettings}/activationAdoption`;
export const ampLicense = `${ampSettings}/licenses`;

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

// current global settings paths for alerts (after renaming team settings to global settings in 2024)
export const globalAlerting = `${globalSettings}/alerting`;

export const globalSettingsAlertingEventBuiltIn = `${globalAlerting}${events}/builtIn`;
export const globalSettingsAlertingEventBuiltInEdit = `${globalAlerting}${events}/builtIn/:id`;
export const globalSettingsAlertingEventCustom = `${globalAlerting}${events}/custom`;
export const globalSettingsAlertingEventCustomEdit = `${globalAlerting}${events}/custom/:id`;
export const globalSettingsAlertingEventCustomNew = `${globalAlerting}${events}/custom/new`;
export const globalSettingsAlertingEvents = `${globalAlerting}${events}`;
export const globalSettingsAlertingAlertEdit = `${globalAlerting}/alerts/:id`;
export const globalSettingsAlertingAlertNew = `${globalAlerting}/alerts/new`;
export const globalSettingsAlertingAlerts = `${globalAlerting}/alerts`;
export const globalSettingsAlertingAlertChannelEdit = `${globalAlerting}${channels}/:id`;
export const globalSettingsAlertingAlertChannelEditDetails = `${globalAlerting}${channels}/detail/:id`;
export const globalSettingsAlertingAlertChannelNew = `${globalAlerting}${channels}/new`;
export const globalSettingsAlertingAlertChannels = `${globalAlerting}${channels}`;
export const globalSettingsAlertingMaintenanceConfigurationEdit = `${globalAlerting}/maintenanceConfigurations/:id`;
export const globalSettingsAlertingMaintenanceConfigurationNew = `${globalAlerting}/maintenanceConfigurations/new`;
export const globalSettingsAlertingMaintenanceConfigurations = `${globalAlerting}/maintenanceConfigurations`;
export const globalSettingsAlertingCustomPayloadConfiguration = `${globalAlerting}/customPayload`;

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

// current alerting paths (after renaming team settings to global settings in 2024)
export const globalSettingsAlertingConfigurationEdit = `${globalAlerting}/configurations/:id`;
export const globalSettingsAlertingConfigurationNew = `${globalAlerting}/configurations/new`;
export const globalSettingsAlertingConfigurations = `${globalAlerting}/configurations`;
export const globalSettingsAlertingIntegrationEdit = `${globalAlerting}/integrations/:id`;
export const globalSettingsAlertingIntegrationNew = `${globalAlerting}/integrations/new`;
export const globalSettingsAlertingIntegrations = `${globalAlerting}/integrations`;

// legacy logging integration paths (until 2024-07)
export const logManagement = `${teamSettings}/logManagement`;
const legacyIntegrations = '/integrations';
export const teamSettingsLogManagementRetentionPeriod = `${logManagement}/retentionPeriod`;
export const teamSettingsLogManagementIntegrations = `${logManagement}${legacyIntegrations}`;
export const teamSettingsLogManagementCoralogix = `${logManagement}${legacyIntegrations}/coralogixConfiguration`;
export const teamSettingsLogManagementDeleteLogs = `${logManagement}/deleteLogs`;
export const teamSettingsLogManagementLogVolume = `${logManagement}/logVolume`;
export const teamSettingsLogManagementMezmo = `${logManagement}/mezmoConfiguration`;
export const teamSettingsLogManagementSplunk = `${logManagement}/splunkConfiguration`;
export const teamSettingsLogManagementFalconLogScale = `${logManagement}/falconLogScaleConfiguration`;
export const teamSettingsLogManagementElk = `${logManagement}/elkConfiguration`;

export const teamSettingsAudit = `${teamSettings}/audit`;
export const teamSettingsActionLog = `${teamSettingsAudit}/actionlog`;
export const teamSettingsActionLogRetention = `${teamSettingsAudit}/actionlog/retention`;
export const teamSettingsAccessLog = `${teamSettingsAudit}/accessLog`;

// current global settings paths for logManagement (after renaming team settings to global settings in 2024)
export const globalLogManagement = `${globalSettings}/logManagement`;
export const globalSettingsLogManagementRetentionPeriod = `${globalLogManagement}/retentionPeriod`;
export const globalSettingsLogManagementIntegrations = `${globalLogManagement}${legacyIntegrations}`;
export const globalSettingsLogManagementCoralogix = `${globalLogManagement}${legacyIntegrations}/coralogixConfiguration`;
export const globalSettingsLogManagementDeleteLogs = `${globalLogManagement}/deleteLogs`;
export const globalSettingsLogManagementLogVolume = `${globalLogManagement}/logVolume`;
export const globalSettingsLogManagementMezmo = `${globalLogManagement}/mezmoConfiguration`;
export const globalSettingsLogManagementSplunk = `${globalLogManagement}/splunkConfiguration`;
export const globalSettingsLogManagementFalconLogScale = `${globalLogManagement}/falconLogScaleConfiguration`;
export const globalSettingsLogManagementElk = `${globalLogManagement}/elkConfiguration`;

// current audit trail paths (after unification of access control permissions in 2024)
export const securityAndAccessAudit = `${securityAndAccess}/audit`;
export const securityAndAccessActionLog = `${securityAndAccessAudit}/actionlog`;
export const securityAndAccessActionLogRetention = `${securityAndAccessAudit}/actionlog/retention`;
export const securityAndAccessAccessLog = `${securityAndAccessAudit}/accessLog`;

// integrations
const integrations = `${teamSettings}/integrations`;
// database integrations
export const teamSettingsIntegrationsDatabase = `${integrations}/database`;
export const teamSettingsIntegrationsDatabaseDbMarlin = `${teamSettingsIntegrationsDatabase}/dbMarlinConfiguration`;

// current global settings paths for integrations (after renaming team settings to global settings in 2024)
const globalIntegrations = `${globalSettings}/integrations`;
// database integrations
export const globalSettingsIntegrationsDatabase = `${globalIntegrations}/database`;
export const globalSettingsIntegrationsDatabaseDbMarlin = `${globalSettingsIntegrationsDatabase}/dbMarlinConfiguration`;
// logging integrations (from 2024-07)
export const teamSettingsIntegrationsLogging = `${integrations}/logging`;
export const teamSettingsIntegrationsLoggingCoralogix = `${teamSettingsIntegrationsLogging}/coralogixConfiguration`;
export const teamSettingsIntegrationsLoggingMezmo = `${teamSettingsIntegrationsLogging}/mezmoConfiguration`;
export const teamSettingsIntegrationsLoggingSplunk = `${teamSettingsIntegrationsLogging}/splunkConfiguration`;
export const teamSettingsIntegrationsLoggingFalconLogScale = `${teamSettingsIntegrationsLogging}/falconLogScaleConfiguration`;
export const teamSettingsIntegrationsLoggingElk = `${teamSettingsIntegrationsLogging}/elkConfiguration`;

// logging integrations (from 2024-07)
export const globalSettingsIntegrationsLogging = `${globalIntegrations}/logging`;
export const globalSettingsIntegrationsLoggingCoralogix = `${globalSettingsIntegrationsLogging}/coralogixConfiguration`;
export const globalSettingsIntegrationsLoggingMezmo = `${globalSettingsIntegrationsLogging}/mezmoConfiguration`;
export const globalSettingsIntegrationsLoggingSplunk = `${globalSettingsIntegrationsLogging}/splunkConfiguration`;
export const globalSettingsIntegrationsLoggingFalconLogScale = `${globalSettingsIntegrationsLogging}/falconLogScaleConfiguration`;
export const globalSettingsIntegrationsLoggingElk = `${globalSettingsIntegrationsLogging}/elkConfiguration`;

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
    location.pathname = globalSettingsAlertingAlertChannelNew;
    setOrDeleteMatrixKey(location, '/channels', 'kind', kind);
  });
}

export function getModifyAlertChannelUrl(kind: string, entityId: string): string {
  return `#${alerting}${channels};kind=${kind}/detail/${encodeURIComponent(entityId)}`;
}
