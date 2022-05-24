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
  teamSettingsActionCatalog
} from 'in-settings/navigation/paths';
import { productOwnerPermissions } from 'in-stores/permission';
import { automationEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

export function roleHasAnyTeamPermissions() {
  return (
    role.canConfigureUsers ||
    role.canConfigureTeams ||
    role.canConfigureApiTokens ||
    role.canConfigureCustomAlerts ||
    role.canConfigureIntegrations ||
    role.canViewAuditLog ||
    role.canConfigureLogManagement ||
    automationEnabled
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
    return teamSettingsActionLog;
  }
  if (role.canConfigureLogManagement) {
    return teamSettingsLogManagementHumio;
  }
  if (automationEnabled) {
    return teamSettingsActionCatalog;
  }
}

export function hasOwnerPermission() {
  return productOwnerPermissions && productOwnerPermissions.length > 0;
}
