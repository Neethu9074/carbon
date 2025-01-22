/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { settingsPath } from 'in-stores/navigation/paths/mainPaths';
import * as paths from 'in-settings/navigation/paths';

// The routes of the settings pages changed due to the rework in January 2019. This array contains redirects for all old
// settings routes, so old bookmarks do not break. Furthermore, the areas "knowledge management" and "alerting" were
// merged into "events & alerting" in February 2019, changing even more routes, leading to more legacy redirects.

const redirects = [
  { from: `${settingsPath}/userInterface`, to: paths.userSettings },
  { from: `${settingsPath}/rolesConfigs`, to: paths.teamSettingsAccessControlRoles },
  {
    from: `${settingsPath}/rolesConfig/:roleId`,
    to: paths.teamSettingsAccessControlRoleEdit,
    params: { roleId: 'id' }
  },
  { from: `${settingsPath}/users`, to: paths.teamSettingsAccessControlUsers },
  { from: `${settingsPath}/users/:id`, to: paths.teamSettingsAccessControlUserEdit, params: { userId: 'id' } },
  { from: `${settingsPath}/apiTokens`, to: paths.teamSettingsAccessControlApiTokens },
  {
    from: `${settingsPath}/apiTokens/:apiTokenId`,
    to: paths.teamSettingsAccessControlApiTokenEdit,
    params: { apiTokenId: 'id' }
  },
  {
    from: `${settingsPath}/dynamicRule/:ruleId`,
    to: paths.teamSettingsAlertingEvents,
    params: { ruleId: 'id' }
  },
  {
    from: `${settingsPath}/dynamicRules`,
    to: paths.teamSettingsAlertingEvents
  },
  {
    from: `${settingsPath}/builtInRules`,
    to: paths.teamSettingsAlertingEvents
  },
  {
    from: `${settingsPath}/builtInRule/:ruleId`,
    to: paths.teamSettingsAlertingEvents,
    params: { ruleId: 'id' }
  },
  {
    from: `${settingsPath}/rules`,
    to: paths.teamSettingsAlertingEvents
  },
  {
    from: `${settingsPath}/rule/:ruleId`,
    to: paths.teamSettingsAlertingEvents,
    params: { ruleId: 'id' }
  },
  {
    from: `${settingsPath}/bindings`,
    to: paths.teamSettingsAlertingEvents
  },
  {
    from: `${settingsPath}/binding/:ruleBindingId`,
    to: paths.teamSettingsAlertingEvents,
    params: { ruleBindingId: 'id' }
  },
  {
    from: `${settingsPath}/alertingConfigurations`,
    to: paths.teamSettingsAlertingAlerts
  },
  {
    from: `${settingsPath}/alertingConfiguration/:id`,
    to: paths.teamSettingsAlertingAlertEdit,
    params: { id: 'id' }
  },
  {
    from: `${settingsPath}/integrations`,
    to: paths.teamSettingsAlertingAlertChannels
  },
  {
    from: `${settingsPath}/integration/:id`,
    to: paths.teamSettingsAlertingAlertChannelEdit,
    params: { id: 'id' }
  },
  { from: `${settingsPath}/maintenanceConfigurations`, to: paths.teamSettingsAlertingMaintenanceConfigurations },
  {
    from: `${settingsPath}/maintenanceConfiguration/:id`,
    to: paths.teamSettingsAlertingMaintenanceConfigurationEdit,
    params: { id: 'id' }
  },
  {
    from: `${settingsPath}/loggingIntegrations`,
    to: paths.teamSettingsIntegrationsLoggingFalconLogScale
  },
  // additional redirects for merger of "knowledge management" and "alerting" into "events & alerting"
  // we keep this re-directs for a while, so that e.g. existing bookmarks are still working
  { from: `${settingsPath}/auditlog`, to: paths.teamSettingsActionLog },
  { from: paths.teamSettingsKnowledgeManagementBuiltInRules, to: paths.teamSettingsAlertingEvents },
  { from: paths.teamSettingsKnowledgeManagementBuiltInRuleEdit, to: paths.teamSettingsAlertingEvents },
  { from: paths.teamSettingsKnowledgeManagementCustomRules, to: paths.teamSettingsAlertingEvents },
  { from: paths.teamSettingsKnowledgeManagementCustomRuleEdit, to: paths.teamSettingsAlertingEvents },
  { from: paths.teamSettingsKnowledgeManagementCustomIssues, to: paths.teamSettingsAlertingEvents },
  { from: paths.teamSettingsKnowledgeManagementCustomIssueEdit, to: paths.teamSettingsAlertingEvents },
  { from: paths.teamSettingsKnowledgeManagementCustomDynamicRules, to: paths.teamSettingsAlertingEvents },
  { from: paths.teamSettingsKnowledgeManagementCustomDynamicRuleEdit, to: paths.teamSettingsAlertingEvents },
  { from: paths.teamSettingsAlertingConfigurations, to: paths.teamSettingsAlertingAlerts },
  { from: paths.teamSettingsAlertingConfigurationEdit, to: paths.teamSettingsAlertingAlertEdit },
  { from: paths.teamSettingsAlertingIntegrations, to: paths.teamSettingsAlertingAlertChannels },
  { from: paths.teamSettingsAlertingIntegrationEdit, to: paths.teamSettingsAlertingAlertChannelEdit },
  // logging config redirects after moving "logmanagement/integrations" to "integrations/logging"
  { from: paths.teamSettingsLogManagementIntegrations, to: paths.teamSettingsIntegrationsLogging },
  { from: paths.teamSettingsLogManagementCoralogix, to: paths.teamSettingsIntegrationsLoggingCoralogix },
  { from: paths.teamSettingsLogManagementElk, to: paths.teamSettingsIntegrationsLoggingElk },
  { from: paths.teamSettingsLogManagementFalconLogScale, to: paths.teamSettingsIntegrationsLoggingFalconLogScale },
  { from: paths.teamSettingsLogManagementMezmo, to: paths.teamSettingsIntegrationsLoggingMezmo },
  { from: paths.teamSettingsLogManagementSplunk, to: paths.teamSettingsIntegrationsLoggingSplunk },

  // redirects as we moved access control sections inside security & access tab from teamSettings tab (after unification of access control permissions in 2024)
  { from: paths.teamSettingsAccessControlUsers, to: paths.securityAndAccessAccessControlUsers },
  { from: paths.teamSettingsAccessControlUserEdit, to: paths.securityAndAccessAccessControlUserEdit },
  { from: paths.teamSettingsAccessControlInvites, to: paths.securityAndAccessAccessControlInvites },
  { from: paths.teamSettingsAccessControlRoleEdit, to: paths.securityAndAccessAccessControlRoleEdit },
  { from: paths.teamSettingsAccessControlRoleNew, to: paths.securityAndAccessAccessControlRoleNew },
  { from: paths.teamSettingsAccessControlRoles, to: paths.securityAndAccessAccessControlRoles },
  { from: paths.teamSettingsAccessControlGroupEdit, to: paths.securityAndAccessAccessControlGroupEdit },
  { from: paths.teamSettingsAccessControlGroupNew, to: paths.securityAndAccessAccessControlGroupNew },
  { from: paths.teamSettingsAccessControlGroups, to: paths.securityAndAccessAccessControlGroups },
  { from: paths.teamSettingsAccessControlApiTokenEdit, to: paths.securityAndAccessAccessControlApiTokenEdit },
  {
    from: paths.teamSettingsAccessControlApiTokenDuplicate,
    to: paths.securityAndAccessAccessControlApiTokenDuplicate
  },
  { from: paths.teamSettingsAccessControlApiTokenNew, to: paths.securityAndAccessAccessControlApiTokenNew },
  { from: paths.teamSettingsAccessControlApiTokens, to: paths.securityAndAccessAccessControlApiTokens },

  // redirects as we moved audit trail sections inside security & access tab from teamSettings tab (after unification of access control permissions in 2024)

  { from: paths.teamSettingsActionLog, to: paths.securityAndAccessActionLog },
  { from: paths.teamSettingsActionLogRetention, to: paths.securityAndAccessActionLogRetention },
  { from: paths.teamSettingsAccessLog, to: paths.securityAndAccessAccessLog },

  // redirects as we moved auth settings paths under security & access tab (after unification of access control permissions in 2024)
  {
    from: paths.googleSSO,
    to: paths.securityAndAccessGoogleSSO
  },
  { from: paths.saml, to: paths.securityAndAccessSaml },
  { from: paths.oidc, to: paths.securityAndAccessOidc },
  { from: paths.ldap, to: paths.securityAndAccessLdap },
  { from: paths.groupMapping, to: paths.securityAndAccessGroupMapping },

  { from: paths.timeouts, to: paths.securityAndAccessTimeouts },

  // redirects events & alerting settings paths as we renamed team settings to global settings in 2024
  { from: paths.teamSettingsAlertingEventBuiltIn, to: paths.globalSettingsAlertingEventBuiltIn },
  { from: paths.teamSettingsAlertingEventBuiltInEdit, to: paths.globalSettingsAlertingEventBuiltInEdit },
  { from: paths.teamSettingsAlertingEventCustom, to: paths.globalSettingsAlertingEventCustom },
  { from: paths.teamSettingsAlertingEventCustomEdit, to: paths.globalSettingsAlertingEventCustomEdit },

  { from: paths.teamSettingsAlertingEventCustomNew, to: paths.globalSettingsAlertingEventCustomNew },
  { from: paths.teamSettingsAlertingEvents, to: paths.globalSettingsAlertingEvents },
  { from: paths.teamSettingsAlertingAlertEdit, to: paths.globalSettingsAlertingAlertEdit },
  { from: paths.teamSettingsAlertingAlertNew, to: paths.globalSettingsAlertingAlertNew },

  { from: paths.teamSettingsAlertingAlerts, to: paths.globalSettingsAlertingAlerts },
  { from: paths.teamSettingsAlertingAlertChannelEdit, to: paths.globalSettingsAlertingAlertChannelEdit },
  { from: paths.teamSettingsAlertingAlertChannelEditDetails, to: paths.globalSettingsAlertingAlertChannelEditDetails },
  { from: paths.teamSettingsAlertingAlertChannelNew, to: paths.globalSettingsAlertingAlertChannelNew },

  { from: paths.teamSettingsAlertingAlertChannels, to: paths.globalSettingsAlertingAlertChannels },
  {
    from: paths.teamSettingsAlertingMaintenanceConfigurationEdit,
    to: paths.globalSettingsAlertingMaintenanceConfigurationEdit
  },
  {
    from: paths.teamSettingsAlertingMaintenanceConfigurationNew,
    to: paths.globalSettingsAlertingMaintenanceConfigurationNew
  },
  {
    from: paths.teamSettingsAlertingMaintenanceConfigurations,
    to: paths.globalSettingsAlertingMaintenanceConfigurations
  },
  {
    from: paths.teamSettingsAlertingCustomPayloadConfiguration,
    to: paths.globalSettingsAlertingCustomPayloadConfiguration
  },

  { from: paths.teamSettingsAlertingConfigurationEdit, to: paths.globalSettingsAlertingConfigurationEdit },
  { from: paths.teamSettingsAlertingConfigurationNew, to: paths.globalSettingsAlertingConfigurationNew },
  { from: paths.teamSettingsAlertingConfigurations, to: paths.globalSettingsAlertingConfigurations },
  { from: paths.teamSettingsAlertingIntegrationEdit, to: paths.globalSettingsAlertingIntegrationEdit },
  { from: paths.teamSettingsAlertingIntegrationNew, to: paths.globalSettingsAlertingIntegrationNew },
  { from: paths.teamSettingsAlertingIntegrations, to: paths.globalSettingsAlertingIntegrations },

  { from: paths.teamSettingsAlertingAlerts, to: paths.globalSettingsAlertingAlerts },
  { from: paths.teamSettingsAlertingAlertChannelEdit, to: paths.globalSettingsAlertingAlertChannelEdit },
  { from: paths.teamSettingsAlertingAlertChannelEditDetails, to: paths.globalSettingsAlertingAlertChannelEditDetails },
  { from: paths.teamSettingsAlertingAlertChannelNew, to: paths.globalSettingsAlertingAlertChannelNew },

  // redirects for Log Management as we renamed team settings to global settings in 2024
  { from: paths.teamSettingsLogManagementRetentionPeriod, to: paths.globalSettingsLogManagementRetentionPeriod },
  { from: paths.teamSettingsLogManagementIntegrations, to: paths.globalSettingsLogManagementIntegrations },
  { from: paths.teamSettingsLogManagementCoralogix, to: paths.globalSettingsLogManagementCoralogix },
  { from: paths.teamSettingsLogManagementDeleteLogs, to: paths.globalSettingsLogManagementDeleteLogs },
  { from: paths.teamSettingsLogManagementLogVolume, to: paths.globalSettingsLogManagementLogVolume },
  { from: paths.teamSettingsLogManagementMezmo, to: paths.globalSettingsLogManagementMezmo },
  { from: paths.teamSettingsLogManagementSplunk, to: paths.globalSettingsLogManagementSplunk },
  { from: paths.teamSettingsLogManagementFalconLogScale, to: paths.globalSettingsLogManagementFalconLogScale },
  { from: paths.teamSettingsLogManagementElk, to: paths.globalSettingsLogManagementElk },

  // redirects for database integrations as we renamed team settings to global settings in 2024
  { from: paths.teamSettingsIntegrationsDatabase, to: paths.globalSettingsIntegrationsDatabase },
  { from: paths.teamSettingsIntegrationsDatabaseDbMarlin, to: paths.globalSettingsIntegrationsDatabaseDbMarlin },

  // redirects for logging integrations as we renamed team settings to global settings in 2024
  { from: paths.teamSettingsIntegrationsLoggingCoralogix, to: paths.globalSettingsIntegrationsLoggingCoralogix },
  { from: paths.teamSettingsIntegrationsLoggingMezmo, to: paths.globalSettingsIntegrationsLoggingMezmo },
  { from: paths.teamSettingsIntegrationsLoggingSplunk, to: paths.globalSettingsIntegrationsLoggingSplunk },
  {
    from: paths.teamSettingsIntegrationsLoggingFalconLogScale,
    to: paths.globalSettingsIntegrationsLoggingFalconLogScale
  },
  { from: paths.teamSettingsIntegrationsLoggingElk, to: paths.globalSettingsIntegrationsLoggingElk }
];

export default redirects;
