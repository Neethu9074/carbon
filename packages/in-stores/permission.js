/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export const RESTRICTED_ACCESS = 'RESTRICTED_ACCESS';

export const ACCESS_APPLICATIONS = 'ACCESS_APPLICATIONS';
export const ACCESS_KUBERNETES = 'ACCESS_KUBERNETES';
export const ACCESS_WEBSITES = 'ACCESS_WEBSITES';
export const ACCESS_MOBILE_APPS = 'ACCESS_MOBILE_APPS';

const permissions = window.instana.permissions;

export const hasRestrictedAccess = role.restrictedAccess;

function hasPermission(permission) {
  return !hasRestrictedAccess || permissions.indexOf(permission) > -1;
}

export const hasApplicationsAccess = hasPermission(ACCESS_APPLICATIONS);
export const hasKubernetesAccess = hasPermission(ACCESS_KUBERNETES);
export const hasWebsitesAccess = hasPermission(ACCESS_WEBSITES);
export const hasMobileAppsAccess = hasPermission(ACCESS_MOBILE_APPS);
export const hasAnalyzeAccess = hasApplicationsAccess || hasWebsitesAccess || hasMobileAppsAccess;

export const productAreaPermissions = getProductAreaPermissions();
export const productPermissions = getProductPermissions();
export const productOwnerPermissions = getProductPermissions().filter(permission => permission.isOwnerPermission);
export const productRestrictions = getProductRestrictions();

export const apiTokenPermissions = getProductPermissions().filter(permission => permission.keyForApiTokenApi != '');

function getProductAreaPermissions() {
  return [
    { value: ACCESS_WEBSITES, label: t('in-stores:permissionAccessWebsitesLabel') },
    { value: ACCESS_MOBILE_APPS, label: t('in-stores:permissionAccessMobileAppsLabel') },
    { value: ACCESS_APPLICATIONS, label: t('in-stores:permissionAccessApplicationsLabel') },
    { value: ACCESS_KUBERNETES, label: t('in-stores:permissionAccessKubernetesLabel') }
  ];
}

function getProductPermissions() {
  return [
    /* Websites & Mobile Apps */
    {
      keyForGroupApi: 'CAN_CONFIGURE_EUM_APPLICATIONS',
      keyForApiTokenApi: 'canConfigureEumApplications',
      label: t('in-stores:permissionCanConfigureEumApplicationsLabel'),
      description: t('in-stores:permissionCanConfigureEumApplicationsDescription'),
      category: t('in-stores:permissionCanConfigureEumApplicationsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_MOBILE_APP_MONITORING',
      keyForApiTokenApi: 'canConfigureMobileAppMonitoring',
      label: t('in-stores:permissionCanConfigureMobileAppMonitoringLabel'),
      description: t('in-stores:permissionCanConfigureMobileAppMonitoringDescription'),
      category: t('in-stores:permissionCanConfigureMobileAppMonitoringCategory'),
      isOwnerPermission: false
    },

    {
      keyForGroupApi: 'CAN_CONFIGURE_APPLICATIONS',
      keyForApiTokenApi: 'canConfigureApplications',
      label: t('in-stores:permissionCanConfigureApplicationsLabel'),
      description: t('in-stores:permissionCanConfigureApplicationsDescription'),
      category: t('in-stores:permissionCanConfigureApplicationsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_SERVICE_MAPPING',
      keyForApiTokenApi: 'canConfigureServiceMapping',
      label: t('in-stores:permissionCanConfigureServiceMappingLabel'),
      description: t('in-stores:permissionCanConfigureServiceMappingDescription'),
      category: t('in-stores:permissionCanConfigureServiceMappingCategory'),
      isOwnerPermission: false
    },
    /* Infrastructure */
    {
      keyForGroupApi: 'CAN_INSTALL_NEW_AGENTS',
      keyForApiTokenApi: 'canInstallNewAgents',
      label: t('in-stores:permissionCanInstallNewAgentsLabel'),
      description: t('in-stores:permissionCanInstallNewAgentsDescription'),
      category: t('in-stores:permissionCanInstallNewAgentsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_AGENTS',
      keyForApiTokenApi: 'canConfigureAgents',
      label: t('in-stores:permissionCanConfigureAgentsLabel'),
      description: t('in-stores:permissionCanConfigureAgentsDescription'),
      category: t('in-stores:permissionCanConfigureAgentsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_AGENT_RUN_MODE',
      keyForApiTokenApi: 'canConfigureAgentRunMode',
      label: t('in-stores:permissionCanConfigureAgentRunModeLabel'),
      description: t('in-stores:permissionCanConfigureAgentRunModeDescription'),
      category: t('in-stores:permissionCanConfigureAgentRunModeCategory'),
      isOwnerPermission: false
    },
    /* Events */
    {
      keyForGroupApi: 'CAN_CONFIGURE_INTEGRATIONS',
      keyForApiTokenApi: 'canConfigureIntegrations',
      label: t('in-stores:permissionCanConfigureIntegrationsLabel'),
      description: t('in-stores:permissionCanConfigureIntegrationsDescription'),
      category: t('in-stores:permissionCanConfigureIntegrationsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_CUSTOM_ALERTS',
      keyForApiTokenApi: 'canConfigureCustomAlerts',
      label: t('in-stores:permissionCanConfigureCustomAlertsLabel'),
      description: t('in-stores:permissionCanConfigureCustomAlertsDescription'),
      category: t('in-stores:permissionCanConfigureCustomAlertsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD',
      keyForApiTokenApi: 'canConfigureGlobalAlertPayload',
      label: t('in-stores:permissionCanConfigureGlobalAlertPayloadLabel'),
      description: t('in-stores:permissionCanConfigureGlobalAlertPayloadDescription'),
      category: t('in-stores:permissionCanConfigureGlobalAlertPayloadCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_GLOBAL_ALERT_CONFIGS',
      keyForApiTokenApi: 'canConfigureGlobalAlertConfigs',
      label: t('in-stores:permissionCanConfigureGlobalAlertConfigsLabel'),
      description: t('in-stores:permissionCanConfigureGlobalAlertConfigsDescription'),
      category: t('in-stores:permissionCanConfigureGlobalAlertConfigsCategory')
    },
    /* Custom Dashboards */
    {
      keyForGroupApi: 'CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS',
      keyForApiTokenApi: 'canCreatePublicCustomDashboards',
      label: t('in-stores:permissionCanCreatePublicCustomDashboardsLabel'),
      description: t('in-stores:permissionCanCreatePublicCustomDashboardsDescription'),
      category: t('in-stores:permissionCanCreatePublicCustomDashboardsCategory'),
      isOwnerPermission: true
    },
    {
      keyForGroupApi: 'CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS',
      keyForApiTokenApi: 'canEditAllAccessibleCustomDashboards',
      label: t('in-stores:permissionCanEditAllAccessibleCustomDashboardsLabel'),
      description: t('in-stores:permissionCanEditAllAccessibleCustomDashboardsDescription'),
      category: t('in-stores:permissionCanEditAllAccessibleCustomDashboardsCategory'),
      isOwnerPermission: false
    },
    /* Extensions */
    {
      keyForGroupApi: 'CAN_CONFIGURE_LOG_MANAGEMENT',
      keyForApiTokenApi: 'canConfigureLogManagement',
      label: t('in-stores:permissionCanConfigureLogManagementLabel'),
      description: t('in-stores:permissionCanConfigureLogManagementDescription'),
      category: t('in-stores:permissionCanConfigureLogManagementCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_RELEASES',
      keyForApiTokenApi: 'canConfigureReleases',
      label: t('in-stores:permissionCanConfigureReleasesLabel'),
      description: t('in-stores:permissionCanConfigureReleasesDescription'),
      category: t('in-stores:permissionCanConfigureReleasesCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS',
      keyForApiTokenApi: 'canConfigureServiceLevelIndicators',
      label: t('in-stores:permissionCanConfigureServiceLevelIndicatorsLabel'),
      description: t('in-stores:permissionCanConfigureServiceLevelIndicatorsDescription'),
      category: t('in-stores:permissionCanConfigureServiceLevelIndicatorsCategory'),
      isOwnerPermission: false
    },
    /* Access Control */
    {
      keyForGroupApi: 'CAN_CONFIGURE_USERS',
      keyForApiTokenApi: 'canConfigureUsers',
      label: t('in-stores:permissionCanConfigureUsersLabel'),
      description: t('in-stores:permissionCanConfigureUsersDescription'),
      category: t('in-stores:permissionCanConfigureUsersCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_TEAMS',
      keyForApiTokenApi: 'canConfigureTeams',
      label: t('in-stores:permissionCanConfigureTeamsLabel'),
      description: t('in-stores:permissionCanConfigureTeamsDescription'),
      category: t('in-stores:permissionCanConfigureTeamsCategory'),
      isOwnerPermission: true
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_API_TOKENS',
      keyForApiTokenApi: 'canConfigureApiTokens',
      label: t('in-stores:permissionCanConfigureApiTokensLabel'),
      description: t('in-stores:permissionCanConfigureApiTokensDescription'),
      category: t('in-stores:permissionCanConfigureApiTokensCategory'),
      isOwnerPermission: true
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_AUTHENTICATION_METHODS',
      keyForApiTokenApi: 'canConfigureAuthenticationMethods',
      label: t('in-stores:permissionCanConfigureAuthenticationMethodsLabel'),
      description: t('in-stores:permissionCanConfigureAuthenticationMethodsDescription'),
      category: t('in-stores:permissionCanConfigureAuthenticationMethodsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_VIEW_AUDIT_LOG',
      keyForApiTokenApi: 'canViewAuditLog',
      label: t('in-stores:permissionCanViewAuditLogLabel'),
      description: t('in-stores:permissionCanViewAuditLogDescription'),
      category: t('in-stores:permissionCanViewAuditLogCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_SESSION_SETTINGS',
      keyForApiTokenApi: 'canConfigureSessionSettings',
      label: t('in-stores:permissionCanConfigureSessionSettingsLabel'),
      description: t('in-stores:permissionCanConfigureSessionSettingsDescription'),
      category: t('in-stores:permissionCanConfigureSessionSettingsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_VIEW_LOGS',
      keyForApiTokenApi: '', // indicates that this is not a permission for a token
      label: t('in-stores:permissionCanViewLogsLabel'),
      description: t('in-stores:permissionCanViewLogsDescription'),
      category: t('in-stores:permissionCanViewLogsCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_VIEW_TRACE_DETAILS',
      keyForApiTokenApi: '', // indicates that this is not a permission for a token
      label: t('in-stores:permissionCanViewTraceDetailsLabel'),
      description: t('in-stores:permissionCanViewTraceDetailsDescription'),
      category: t('in-stores:permissionCanViewTraceDetailsCategory'),
      isOwnerPermission: false
    },
    /* Account Information */
    {
      keyForGroupApi: 'CAN_SEE_USAGE_INFORMATION',
      keyForApiTokenApi: 'canSeeUsageInformation',
      label: t('in-stores:permissionCanSeeUsageInformationLabel'),
      description: t('in-stores:permissionCanSeeUsageInformationDescription'),
      category: t('in-stores:permissionCanSeeUsageInformationCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_SEE_ON_PREM_LICENE_INFORMATION',
      keyForApiTokenApi: 'canSeeOnPremLicenseInformation',
      label: t('in-stores:permissionCanSeeOnPremLicenseInformationLabel'),
      description: t('in-stores:permissionCanSeeOnPremLicenseInformationDescription'),
      category: t('in-stores:permissionCanSeeOnPremLicenseInformationCategory'),
      isOwnerPermission: false
    },
    {
      keyForGroupApi: 'CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION',
      keyForApiTokenApi: 'canViewAccountAndBillingInformation',
      label: t('in-stores:permissionCanViewAccountAndBillingInformationLabel'),
      description: t('in-stores:permissionCanViewAccountAndBillingInformationDescription'),
      category: t('in-stores:permissionCanViewAccountAndBillingInformationCategory')
    }
  ];
}

function getProductRestrictions() {
  return [
    {
      value: RESTRICTED_ACCESS,
      label: t('in-stores:permissionRestrictedLabel'),
      help: t('in-stores:permissionRestrictedHelp')
    }
  ];
}
