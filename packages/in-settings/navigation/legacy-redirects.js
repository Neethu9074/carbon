import { settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { unifiedAlerting } from 'in-services/featureFlags';
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
  { from: `${settingsPath}/apiTokens`, to: paths.teamSettingsAccessControlApiTokens },
  {
    from: `${settingsPath}/apiTokens/:apiTokenId`,
    to: paths.teamSettingsAccessControlApiTokenEdit,
    params: { apiTokenId: 'id' }
  },
  {
    from: `${settingsPath}/dynamicRule/:ruleId`,
    to: unifiedAlerting ? paths.teamSettingsAlertingEvents : paths.teamSettingsKnowledgeManagementCustomDynamicRuleEdit,
    params: { ruleId: 'id' }
  },
  {
    from: `${settingsPath}/dynamicRules`,
    to: unifiedAlerting ? paths.teamSettingsAlertingEvents : paths.teamSettingsKnowledgeManagementCustomDynamicRules
  },
  {
    from: `${settingsPath}/builtInRules`,
    to: unifiedAlerting ? paths.teamSettingsAlertingEvents : paths.teamSettingsKnowledgeManagementBuiltInRules
  },
  {
    from: `${settingsPath}/builtInRule/:ruleId`,
    to: unifiedAlerting ? paths.teamSettingsAlertingEvents : paths.teamSettingsKnowledgeManagementBuiltInRuleEdit,
    params: { ruleId: 'id' }
  },
  {
    from: `${settingsPath}/rules`,
    to: unifiedAlerting ? paths.teamSettingsAlertingEvents : paths.teamSettingsKnowledgeManagementCustomRules
  },
  {
    from: `${settingsPath}/rule/:ruleId`,
    to: unifiedAlerting ? paths.teamSettingsAlertingEvents : paths.teamSettingsKnowledgeManagementCustomRuleEdit,
    params: { ruleId: 'id' }
  },
  {
    from: `${settingsPath}/bindings`,
    to: unifiedAlerting ? paths.teamSettingsAlertingEvents : paths.teamSettingsKnowledgeManagementCustomIssues
  },
  {
    from: `${settingsPath}/binding/:ruleBindingId`,
    to: unifiedAlerting ? paths.teamSettingsAlertingEvents : paths.teamSettingsKnowledgeManagementCustomIssueEdit,
    params: { ruleBindingId: 'id' }
  },
  {
    from: `${settingsPath}/alertingConfigurations`,
    to: unifiedAlerting ? paths.teamSettingsAlertingAlerts : paths.teamSettingsAlertingConfigurations
  },
  {
    from: `${settingsPath}/alertingConfiguration/:id`,
    to: unifiedAlerting ? paths.teamSettingsAlertingAlertEdit : paths.teamSettingsAlertingConfigurationEdit,
    params: { id: 'id' }
  },
  {
    from: `${settingsPath}/integrations`,
    to: unifiedAlerting ? paths.teamSettingsAlertingAlertChannels : paths.teamSettingsAlertingIntegrations
  },
  {
    from: `${settingsPath}/integration/:id`,
    to: unifiedAlerting ? paths.teamSettingsAlertingAlertChannelEdit : paths.teamSettingsAlertingIntegrationEdit,
    params: { id: 'id' }
  },
  { from: `${settingsPath}/maintenanceConfigurations`, to: paths.teamSettingsAlertingMaintenanceConfigurations },
  {
    from: `${settingsPath}/maintenanceConfiguration/:id`,
    to: paths.teamSettingsAlertingMaintenanceConfigurationEdit,
    params: { id: 'id' }
  },
  { from: `${settingsPath}/auditlog`, to: paths.teamSettingsAuditLog }
];

// additional redirects for merger of "knowledge management" and "alerting" into "events & alerting"
if (unifiedAlerting) {
  redirects.push(
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
  );
}

export default redirects;
