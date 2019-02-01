import { settingsPath } from 'in-stores/navigation/paths/mainPaths';
import * as paths from 'in-views/configurationView/navigation/paths';

// The routes of the settings pages change due to the rework in early 2019. This array contains redirects for all old
// settings routes, so old bookmarks do not break.
export default [
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
    to: paths.teamSettingsKnowledgeManagementCustomDynamicRuleEdit,
    params: { ruleId: 'id' }
  },
  { from: `${settingsPath}/dynamicRules`, to: paths.teamSettingsKnowledgeManagementCustomDynamicRules },
  { from: `${settingsPath}/builtInRules`, to: paths.teamSettingsKnowledgeManagementBuiltInRules },
  {
    from: `${settingsPath}/builtInRule/:ruleId`,
    to: paths.teamSettingsKnowledgeManagementBuiltInRuleEdit,
    params: { ruleId: 'id' }
  },
  { from: `${settingsPath}/rules`, to: paths.teamSettingsKnowledgeManagementCustomRules },
  {
    from: `${settingsPath}/rule/:ruleId`,
    to: paths.teamSettingsKnowledgeManagementCustomRuleEdit,
    params: { ruleId: 'id' }
  },
  { from: `${settingsPath}/bindings`, to: paths.teamSettingsKnowledgeManagementCustomIssues },
  {
    from: `${settingsPath}/binding/:ruleBindingId`,
    to: paths.teamSettingsKnowledgeManagementCustomIssueEdit,
    params: { ruleBindingId: 'id' }
  },
  { from: `${settingsPath}/alertingConfigurations`, to: paths.teamSettingsAlertingConfigurations },
  { from: `${settingsPath}/alertingConfiguration/:id`, to: paths.teamSettingsAlertingConfigurationEdit },
  { from: `${settingsPath}/integrations`, to: paths.teamSettingsAlertingIntegrations },
  { from: `${settingsPath}/integration/:id`, to: paths.teamSettingsAlertingIntegrationEdit },
  { from: `${settingsPath}/maintenanceConfigurations`, to: paths.teamSettingsAlertingMaintenanceConfigurations },
  { from: `${settingsPath}/maintenanceConfiguration/:id`, to: paths.teamSettingsAlertingMaintenanceConfigurationEdit },
  { from: `${settingsPath}/auditlog`, to: paths.teamSettingsAuditLog }
];
