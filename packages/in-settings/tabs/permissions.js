/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlApiTokens,
  teamSettingsAlertingEvents,
  teamSettingsAlertingAlertChannels,
  teamSettingsActionLog,
  teamSettingsLogManagementHumio,
  teamSettingsAccessControlGroups,
  teamSettingsAlertingCustomPayloadConfiguration,
  teamSettingsAlertingMaintenanceConfigurations
} from 'in-settings/navigation/paths';
import { productOwnerPermissions } from 'in-stores/permission';
import { role } from 'in-stores/user';

export function roleHasAnyTeamPermissions() {
  return (
    role.canConfigureUsers ||
    role.canConfigureTeams ||
    role.canConfigureApiTokens ||
    (role.canConfigureEventsAndAlerts ?? role.canConfigureCustomAlerts) ||
    role.canConfigureIntegrations ||
    role.canConfigureMaintenanceWindows ||
    role.canConfigureGlobalAlertPayload ||
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
  if (role.canConfigureEventsAndAlerts ?? role.canConfigureCustomAlerts) {
    return teamSettingsAlertingEvents;
  }
  if (role.canConfigureIntegrations) {
    return teamSettingsAlertingAlertChannels;
  }
  if (role.canConfigureMaintenanceWindows) {
    return teamSettingsAlertingMaintenanceConfigurations;
  }
  if (role.canConfigureGlobalAlertPayload) {
    return teamSettingsAlertingCustomPayloadConfiguration;
  }
  if (role.canViewAuditLog) {
    return teamSettingsActionLog;
  }
  if (role.canConfigureLogManagement) {
    return teamSettingsLogManagementHumio;
  }
}

export function hasOwnerPermission() {
  return productOwnerPermissions && productOwnerPermissions.length > 0;
}
