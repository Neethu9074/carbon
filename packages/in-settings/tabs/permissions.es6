import {
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlRoles,
  teamSettingsAccessControlApiTokens,
  teamSettingsKnowledgeManagementBuiltInRules,
  teamSettingsAlertingEvents,
  teamSettingsAlertingAlertChannels,
  teamSettingsAlertingIntegrations,
  teamSettingsAuditLog,
  generalServiceExtractionPath
} from 'in-settings/navigation/paths';
import { twoZeroModeEnabled, unifiedAlerting } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

export function roleHasAnyTeamPermissions() {
  return (
    role.canConfigureUsers ||
    role.canConfigureRoles ||
    role.canConfigureApiTokens ||
    role.canConfigureCustomAlerts ||
    role.canConfigureIntegrations ||
    role.canViewAuditLog ||
    (!twoZeroModeEnabled && role.canConfigureServiceMapping)
  );
}

export function findFirstPermittedTeamPage() {
  if (role.canConfigureUsers) {
    return teamSettingsAccessControlUsers;
  }
  if (role.canConfigureRoles) {
    return teamSettingsAccessControlRoles;
  }
  if (role.canConfigureApiTokens) {
    return teamSettingsAccessControlApiTokens;
  }
  if (unifiedAlerting && role.canConfigureCustomAlerts) {
    return teamSettingsAlertingEvents;
  }
  if (unifiedAlerting && role.canConfigureIntegrations) {
    return teamSettingsAlertingAlertChannels;
  }
  if (!unifiedAlerting && role.canConfigureCustomAlerts) {
    return teamSettingsKnowledgeManagementBuiltInRules;
  }
  if (!unifiedAlerting && role.canConfigureIntegrations) {
    return teamSettingsAlertingIntegrations;
  }
  if (role.canViewAuditLog) {
    return teamSettingsAuditLog;
  }
  if (!twoZeroModeEnabled && role.canConfigureServiceMapping) {
    return generalServiceExtractionPath;
  }
}
