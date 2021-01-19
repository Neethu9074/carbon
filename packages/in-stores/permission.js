/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { role } from 'in-stores/user';

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
export const productRestrictions = getProductRestrictions();

export const apiTokenPermissions = getProductPermissions().filter(permission => permission.keyForApiTokenApi != '');

function getProductAreaPermissions() {
  return [
    { value: ACCESS_WEBSITES, label: 'Websites' },
    { value: ACCESS_MOBILE_APPS, label: 'Mobile Apps' },
    { value: ACCESS_APPLICATIONS, label: 'Applications' },
    { value: ACCESS_KUBERNETES, label: 'Kubernetes' }
  ];
}

function getProductPermissions() {
  return [
    /* Websites & Mobile Apps */
    {
      keyForGroupApi: 'CAN_CONFIGURE_EUM_APPLICATIONS',
      keyForApiTokenApi: 'canConfigureEumApplications',
      label: 'Website monitoring configuration',
      description: 'Permits configuration of website monitoring functionality.',
      category: 'Websites & Mobile Apps'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_MOBILE_APP_MONITORING',
      keyForApiTokenApi: 'canConfigureMobileAppMonitoring',
      label: 'Mobile app monitoring configuration',
      description: 'Permits configuration of mobile app monitoring functionality.',
      category: 'Websites & Mobile Apps'
    },

    {
      keyForGroupApi: 'CAN_CONFIGURE_APPLICATIONS',
      keyForApiTokenApi: 'canConfigureApplications',
      label: 'Configuration of applications',
      description: 'Permits creation and configuration of applications.',
      category: 'Applications'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_SERVICE_MAPPING',
      keyForApiTokenApi: 'canConfigureServiceMapping',
      label: 'Service & endpoint mapping',
      description: 'Permits configuration of services and endpoints.',
      category: 'Applications'
    },
    /* Infrastructure */
    {
      keyForGroupApi: 'CAN_INSTALL_NEW_AGENTS',
      keyForApiTokenApi: 'canInstallNewAgents',
      label: 'Agent download and agent key visibility',
      description: 'Permits access to host agent and configuration.',
      category: 'Infrastructure'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_AGENTS',
      keyForApiTokenApi: 'canConfigureAgents',
      label: 'Configuration of agents',
      description: 'Permits host agent configuration of all host agents through the UI.',
      category: 'Infrastructure'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_AGENT_RUN_MODE',
      keyForApiTokenApi: 'canConfigureAgentRunMode',
      label: 'Configuration of agent mode',
      description: 'Permits configuration of host agent mode through the UI.',
      category: 'Infrastructure'
    },
    /* Events */
    {
      keyForGroupApi: 'CAN_CONFIGURE_INTEGRATIONS',
      keyForApiTokenApi: 'canConfigureIntegrations',
      label: 'Configuration of integrations',
      description: 'Permits creation and configuration of integrations for use in alerting.',
      category: 'Events'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_CUSTOM_ALERTS',
      keyForApiTokenApi: 'canConfigureCustomAlerts',
      label: 'Configuration of custom alerts',
      description: 'Permits creation and configuration of custom alerts and associated integrations.',
      category: 'Events'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD',
      keyForApiTokenApi: 'canConfigureGlobalAlertPayload',
      label: 'Configuration of global custom payload for alerts',
      description: 'Permits configuration of global custom payload for alerts.',
      category: 'Events'
    },
    /* Extensions */
    {
      keyForGroupApi: 'CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS',
      keyForApiTokenApi: 'canCreatePublicCustomDashboards',
      label: 'Creation of public custom dashboards',
      description:
        "Without this permission, users and API tokens can create custom dashboards visible only to themselves. Granting this permission allows users and API tokens to create custom dashboards visible to all users and API tokens of this Instana environment. Additionally, they can add editors to custom dashboards, which means they can see a full list of names and email addresses of all users of this Instana environment. Additionally, they can see a complete list of all API tokens' IDs and names.",
      category: 'Extensions'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_LOG_MANAGEMENT',
      keyForApiTokenApi: 'canConfigureLogManagement',
      label: 'Configuration of log management',
      description: 'Permits configuration of log management.',
      category: 'Extensions'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_RELEASES',
      keyForApiTokenApi: 'canConfigureReleases',
      label: 'Configuration of releases',
      description: 'Permits configuration of releases.',
      category: 'Extensions'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS',
      keyForApiTokenApi: 'canConfigureServiceLevelIndicators',
      label: 'Configuration of service level indicators',
      description: 'Permits definition and configuration of SLIs.',
      category: 'Extensions'
    },
    /* Access Control */
    {
      keyForGroupApi: 'CAN_CONFIGURE_USERS',
      keyForApiTokenApi: 'canConfigureUsers',
      label: 'User management',
      description: 'Permits inviting, modifying and removing user accounts.',
      category: 'Access Control'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_TEAMS',
      keyForApiTokenApi: 'canConfigureTeams',
      label: 'Access group configuration',
      description: 'Permits configuration of access scopes and permissions for all teams.',
      category: 'Access Control'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_API_TOKENS',
      keyForApiTokenApi: 'canConfigureApiTokens',
      label: 'Configuration of API tokens',
      description: 'Permits creation and configuration of API tokens.',
      category: 'Access Control'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_AUTHENTICATION_METHODS',
      keyForApiTokenApi: 'canConfigureAuthenticationMethods',
      label: 'Configuration of authentication methods',
      description: 'Permits configuration of team authentication methods (eg. 2FA/SSO).',
      category: 'Access Control'
    },
    {
      keyForGroupApi: 'CAN_VIEW_AUDIT_LOG',
      keyForApiTokenApi: 'canViewAuditLog',
      label: 'Access to audit log',
      description: 'Permits access to audit log for all users.',
      category: 'Access Control'
    },
    {
      keyForGroupApi: 'CAN_CONFIGURE_SESSION_SETTINGS',
      keyForApiTokenApi: 'canConfigureSessionSettings',
      label: 'Access to token and session timeout settings',
      description: 'Permits access to configure token and session timeouts.',
      category: 'Access Control'
    },
    {
      keyForGroupApi: 'CAN_VIEW_LOGS',
      keyForApiTokenApi: '', // indicates that this is not a permission for a token
      label: 'Access of logs in the trace detail view',
      description: 'Enable access to logs.',
      category: 'Access Control'
    },
    {
      keyForGroupApi: 'CAN_VIEW_TRACE_DETAILS',
      keyForApiTokenApi: '', // indicates that this is not a permission for a token
      label: 'Access of trace details in the trace detail view',
      description: 'Enable access to trace details.',
      category: 'Access Control'
    },
    /* Account Information */
    {
      keyForGroupApi: 'CAN_SEE_USAGE_INFORMATION',
      keyForApiTokenApi: 'canSeeUsageInformation',
      label: 'Access to license usage',
      description: 'Permits access to license usage information.',
      category: 'Account Information'
    },
    {
      keyForGroupApi: 'CAN_SEE_ON_PREM_LICENE_INFORMATION',
      keyForApiTokenApi: 'canSeeOnPremLicenseInformation',
      label: 'Access to on prem license usage',
      description: 'Permits access to on prem license usage information.',
      category: 'Account Information'
    },
    {
      keyForGroupApi: 'CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION',
      keyForApiTokenApi: 'canViewAccountAndBillingInformation',
      label: 'Access to account and billing information',
      description: 'Permits access to account and billing information.',
      category: 'Account Information'
    }
  ];
}

function getProductRestrictions() {
  return [
    {
      value: RESTRICTED_ACCESS,
      label: 'Limit access by group access scopes',
      help: 'Enable role based access control.'
    }
  ];
}
