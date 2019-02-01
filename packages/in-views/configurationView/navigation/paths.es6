import { settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl, getView } from 'in-stores/navigation';

export const settingsBasePath = settingsPath;

export const userSettings = `${settingsBasePath}/user`;

export const userSettingsGeneral = `${userSettings}/general`;
export const userSettingsAdvanced = `${userSettings}/advanced`;

export const teamSettings = `${settingsPath}/team`;

const accessControl = `${teamSettings}/accessControl`;
export const teamSettingsAccessControlUsers = `${accessControl}/users`;
export const teamSettingsAccessControlInvites = `${accessControl}/invites`;
export const teamSettingsAccessControlRoles = `${accessControl}/roles`;
export const teamSettingsAccessControlRoleEdit = `${accessControl}/roles/:id`;
export const teamSettingsAccessControlRoleNew = `${accessControl}/roles/new`;
export const teamSettingsAccessControlApiTokenEdit = `${accessControl}/apiTokens/:id`;
export const teamSettingsAccessControlApiTokens = `${accessControl}/apiTokens`;

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

const alerting = `${teamSettings}/alerting`;
export const teamSettingsAlertingConfigurationEdit = `${alerting}/configurations/:id`;
export const teamSettingsAlertingConfigurationNew = `${alerting}/configurations/new`;
export const teamSettingsAlertingConfigurations = `${alerting}/configurations`;
export const teamSettingsAlertingIntegrationEdit = `${alerting}/integrations/:id`;
export const teamSettingsAlertingIntegrationNew = `${alerting}/integrations/new`;
export const teamSettingsAlertingIntegrations = `${alerting}/integrations`;
export const teamSettingsAlertingMaintenanceConfigurations = `${alerting}/maintenanceConfigurations`;
export const teamSettingsAlertingMaintenanceConfigurationEdit = `${alerting}/maintenanceConfigurations/:id`;
export const teamSettingsAlertingMaintenanceConfigurationNew = `${alerting}/maintenanceConfigurations/new`;

const audit = `${teamSettings}/audit`;
export const teamSettingsAuditLog = `${audit}/log`;

const legacyServiceExtraction = `${teamSettings}/legacyServiceExtraction`;
export const newServiceExtractionPath = `${legacyServiceExtraction}/:ruleType/serviceExtraction/:ruleId`;
export const serviceExtractionPath = `${legacyServiceExtraction}/:ruleType/serviceExtraction`;
export const generalServiceExtractionPath = `${legacyServiceExtraction}/generalServiceExtraction`;
export const httpServiceExtractionPath = `${legacyServiceExtraction}/httpServiceExtraction`;
export const batchServiceExtractionPath = `${legacyServiceExtraction}/batchServiceExtraction`;
export const ejbServiceExtractionPath = `${legacyServiceExtraction}/ejbServiceExtraction`;
export const elasticsearchServiceExtractionPath = `${legacyServiceExtraction}/elasticsearchServiceExtraction`;
export const messageBrokerServiceExtractionPath = `${legacyServiceExtraction}/messageBrokerServiceExtraction`;

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

export function getServiceExtractionRuleConfigPath(ruleId, ruleType) {
  return ruleId
    ? `${legacyServiceExtraction}/${encodeURIComponent(ruleType)}/serviceExtraction/${encodeURIComponent(ruleId)}`
    : `${legacyServiceExtraction}/${encodeURIComponent(ruleType)}/serviceExtraction`;
}
