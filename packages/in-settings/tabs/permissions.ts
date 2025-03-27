/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  securityAndAccessAccessControlUsers,
  securityAndAccessAccessControlApiTokens,
  globalSettingsAlertingEvents,
  globalSettingsAlertingAlertChannels,
  securityAndAccessActionLog,
  globalSettingsIntegrationsLoggingFalconLogScale,
  securityAndAccessAccessControlGroups,
  globalSettingsAlertingCustomPayloadConfiguration,
  globalSettingsAlertingMaintenanceConfigurations,
  globalSettingsIntegrationsDatabase,
  securityAndAccessGoogleSSO,
  securityAndAccessSaml,
  securityAndAccessLdap,
  securityAndAccessGroupMapping,
  securityAndAccessTimeouts,
  securityAndAccessIdentityProviders
} from 'in-settings/navigation/paths';
import { productOwnerPermissions } from 'in-stores/permission';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

export function roleHasAnyGlobalPermissions() {
  return (
    role.canConfigureEventsAndAlerts ||
    role.canConfigureIntegrations ||
    role.canConfigureMaintenanceWindows ||
    role.canConfigureGlobalAlertPayload ||
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
    role.canViewAuditLog ||
    role.canConfigureAuthenticationMethods ||
    role.canConfigureSessionSettings
  );
}

export function findFirstPermittedGlobalPage() {
  if (role.canConfigureEventsAndAlerts) {
    return globalSettingsAlertingEvents;
  }
  if (role.canConfigureIntegrations) {
    return globalSettingsAlertingAlertChannels;
  }
  if (role.canConfigureMaintenanceWindows) {
    return globalSettingsAlertingMaintenanceConfigurations;
  }
  if (role.canConfigureGlobalAlertPayload) {
    return globalSettingsAlertingCustomPayloadConfiguration;
  }
  if (role.canConfigureLogManagement) {
    return globalSettingsIntegrationsLoggingFalconLogScale;
  }
  if (role.canConfigureDatabaseManagement) {
    return globalSettingsIntegrationsDatabase;
  }
}

export function findFirstPermittedSecurityAndAccessPage(isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable) {
  if (role.canConfigureUsers) {
    return securityAndAccessAccessControlUsers;
  }
  if (role.canConfigureTeams) {
    return securityAndAccessAccessControlGroups;
  }
  if (role.canConfigureApiTokens) {
    return securityAndAccessAccessControlApiTokens;
  }
  if (role.canViewAuditLog) {
    return securityAndAccessActionLog;
  }
  if (role.canConfigureAuthenticationMethods) {
    if (idpConfigV2Enabled && (isGoogleSSOAvailable || isSamlAvailable || isLdapAvailable)) {
      return securityAndAccessIdentityProviders;
    } else {
      if (isGoogleSSOAvailable) {
        return securityAndAccessGoogleSSO;
      }

      if (isSamlAvailable) {
        return securityAndAccessSaml;
      }

      if (isLdapAvailable) {
        return securityAndAccessLdap;
      }
    }
  }
  if (role.canConfigureTeams) {
    return securityAndAccessGroupMapping;
  }
  if (role.canConfigureSessionSettings) {
    return securityAndAccessTimeouts;
  }
}

export function hasOwnerPermission() {
  return productOwnerPermissions && productOwnerPermissions.length > 0;
}
