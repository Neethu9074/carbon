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
    to: paths.teamSettingsLogManagementHumio
  },
  // additional redirects for merger of "knowledge management" and "alerting" into "events & alerting"
  // we keep this re-directs for a while, so that e.g. existing bookmarks are still working
  { from: `${settingsPath}/auditlog`, to: paths.teamSettingsAuditLog },
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
  { from: paths.teamSettingsAlertingIntegrationEdit, to: paths.teamSettingsAlertingAlertChannelEdit }
];

export default redirects;
