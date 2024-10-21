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
  teamSettingsIntegrationsLoggingHumio,
  teamSettingsAccessControlGroups,
  teamSettingsAlertingCustomPayloadConfiguration,
  teamSettingsAlertingMaintenanceConfigurations,
  teamSettingsIntegrationsDatabase,
  googleSSO,
  saml,
  ldap,
  groupMapping,
  timeouts
} from 'in-settings/navigation/paths';
import { productOwnerPermissions } from 'in-stores/permission';
import { role } from 'in-stores/user';

export function roleHasAnyGlobalPermissions() {
  return (
    role.canConfigureEventsAndAlerts ||
    role.canConfigureIntegrations ||
    role.canConfigureMaintenanceWindows ||
    role.canConfigureGlobalAlertPayload ||
    role.canViewAuditLog ||
    role.canConfigureLogRetentionPeriod ||
    role.canConfigureLogManagement ||
    role.canConfigureDatabaseManagement ||
    role.canViewLogVolume ||
    role.canDeleteLogs
  );
}

export function roleHasAnySecurityAccessPermissions() {
  return (
    role.canConfigureUsers ||
    role.canConfigureTeams ||
    role.canConfigureApiTokens ||
    role.canConfigureAuthenticationMethods ||
    role.canConfigureSessionSettings
  );
}

export function findFirstPermittedGlobalPage() {
  if (role.canConfigureEventsAndAlerts) {
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
  if (role.canConfigureLogManagement) {
    return teamSettingsIntegrationsLoggingHumio;
  }
  if (role.canConfigureDatabaseManagement) {
    return teamSettingsIntegrationsDatabase;
  }
}

export function findFirstPermittedSecurityAndAccessPage(isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable) {
  if (role.canConfigureUsers) {
    return teamSettingsAccessControlUsers;
  }
  if (role.canConfigureTeams) {
    return teamSettingsAccessControlGroups;
  }
  if (role.canConfigureApiTokens) {
    return teamSettingsAccessControlApiTokens;
  }
  if (role.canViewAuditLog) {
    return teamSettingsActionLog;
  }
  if (role.canConfigureAuthenticationMethods) {
    if (isGoogleSSOAvailable) {
      return googleSSO;
    }

    if (isSamlAvailable) {
      return saml;
    }

    if (isLdapAvailable) {
      return ldap;
    }
  }
  if (role.canConfigureTeams) {
    return groupMapping;
  }
  if (role.canConfigureSessionSettings) {
    return timeouts;
  }
}

export function hasOwnerPermission() {
  return productOwnerPermissions && productOwnerPermissions.length > 0;
}
