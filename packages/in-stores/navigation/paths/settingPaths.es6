import { mutateUrl, getView } from 'in-stores/navigation/navigation';
import { settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const newServiceExtractionPath = `${settingsPath}/:ruleType/serviceExtraction/:ruleId`;
export const serviceExtractionPath = `${settingsPath}/:ruleType/serviceExtraction`;
export const generalServiceExtractionPath = `${settingsPath}/generalServiceExtraction`;
export const httpServiceExtractionPath = `${settingsPath}/httpServiceExtraction`;
export const batchServiceExtractionPath = `${settingsPath}/batchServiceExtraction`;
export const ejbServiceExtractionPath = `${settingsPath}/ejbServiceExtraction`;
export const elasticsearchServiceExtractionPath = `${settingsPath}/elasticsearchServiceExtraction`;
export const messageBrokerServiceExtractionPath = `${settingsPath}/messageBrokerServiceExtraction`;
export const userInterfacePath = `${settingsPath}/userInterface`;
export const rolesConfigsPath = `${settingsPath}/rolesConfigs`;
export const newRolesConfigPath = `${settingsPath}/rolesConfig/:roleId`;
export const rolesConfigPath = `${settingsPath}/rolesConfig`;
export const usersPath = `${settingsPath}/users`;
export const apiTokensPath = `${settingsPath}/apiTokens`;
export const newApiTokenPath = `${settingsPath}/apiTokens/:apiTokenId`;
export const newDynamicRulePath = `${settingsPath}/dynamicRule/:ruleId`;
export const dynamicRulesPath = `${settingsPath}/dynamicRules`;
export const dynamicRulePath = `${settingsPath}/dynamicRule`;
export const rulesPath = `${settingsPath}/rules`;
export const newRulePath = `${settingsPath}/rule/:ruleId`;
export const rulePath = `${settingsPath}/rule`;
export const bindingsPath = `${settingsPath}/bindings`;
export const newBindingPath = `${settingsPath}/binding/:ruleBindingId`;
export const bindingPath = `${settingsPath}/binding`;
export const alertingConfigurationsPath = `${settingsPath}/alertingConfigurations`;
export const newAlertingConfigurationPath = `${settingsPath}/alertingConfiguration/:id`;
export const alertingConfigurationPath = `${settingsPath}/alertingConfiguration`;
export const integrationsPath = `${settingsPath}/integrations`;
export const integrationPath = `${settingsPath}/integration`;
export const newIntegrationPath = `${settingsPath}/integration/:id`;
export const maintenanceConfigurationsPath = `${settingsPath}/maintenanceConfigurations`;
export const newMaintenanceConfigurationPath = `${settingsPath}/maintenanceConfiguration/:id`;
export const maintenanceConfigurationPath = `${settingsPath}/maintenanceConfiguration`;
export const auditlogPath = `${settingsPath}/auditlog`;

export function getEntityIdPath(path, id) {
  if (id) {
    path = `${path}/${encodeURIComponent(id)}`;
  }
  return getView(path);
}

export function goToIntegrationView(kind) {
  mutateUrl(location => {
    location.pathname = integrationPath;
    setOrDeleteMatrixKey(location, '/integration', 'kind', kind);
  });
}

export function getServiceExtractionRuleConfigPath(ruleId, ruleType) {
  return ruleId
    ? `${settingsPath}/${encodeURIComponent(ruleType)}/serviceExtraction/${encodeURIComponent(ruleId)}`
    : `${settingsPath}/${encodeURIComponent(ruleType)}/serviceExtraction`;
}
