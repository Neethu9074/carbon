/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlApiTokens,
  teamSettingsAlertingEvents,
  teamSettingsAlertingAlertChannels,
  teamSettingsAuditLog,
  teamSettingsLogManagementHumio,
  teamSettingsAccessControlGroups
} from 'in-settings/navigation/paths';
import { role } from 'in-stores/user';

export function roleHasAnyTeamPermissions() {
  return (
    role.canConfigureUsers ||
    role.canConfigureTeams ||
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
  if (role.canConfigureTeams) {
    return teamSettingsAccessControlGroups;
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
