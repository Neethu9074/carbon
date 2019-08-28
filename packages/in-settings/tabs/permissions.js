import {
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlRoles,
  teamSettingsAccessControlApiTokens,
  teamSettingsAlertingEvents,
  teamSettingsAlertingAlertChannels,
  teamSettingsAuditLog,
  teamSettingsLogManagementHumio
} from 'in-settings/navigation/paths';
import { role } from 'in-stores/user';

export function roleHasAnyTeamPermissions() {
  return (
    role.canConfigureUsers ||
    role.canConfigureRoles ||
    role.canConfigureApiTokens ||
    role.canConfigureCustomAlerts ||
    role.canConfigureIntegrations ||
    role.canViewAuditLog ||
    role.canConfigureLogManagement
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
  if (role.canConfigureCustomAlerts) {
    return teamSettingsAlertingEvents;
  }
  if (role.canConfigureIntegrations) {
    return teamSettingsAlertingAlertChannels;
  }
  if (role.canViewAuditLog) {
    return teamSettingsAuditLog;
  }
  if (role.canConfigureLogManagement) {
    return teamSettingsLogManagementHumio;
  }
}
