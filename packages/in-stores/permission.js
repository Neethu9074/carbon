import { role } from 'in-stores/user';

export const RESTRICTED_ACCESS = 'RESTRICTED_ACCESS';
export const CAN_VIEW_LOGS = 'CAN_VIEW_LOGS';
export const CAN_VIEW_TRACE_DETAILS = 'CAN_VIEW_TRACE_DETAILS';

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
    { value: 'CAN_CONFIGURE_SERVICE_MAPPING', label: 'Service & endpoint mapping' },
    { value: 'CAN_CONFIGURE_APPLICATIONS', label: 'Configuration of applications' },
    { value: 'CAN_CONFIGURE_EUM_APPLICATIONS', label: 'Website monitoring configuration' },
    { value: 'CAN_CONFIGURE_MOBILE_APP_MONITORING', label: 'Mobile app monitoring configuration' },
    { value: 'CAN_CONFIGURE_USERS', label: 'User management' },
    { value: 'CAN_INSTALL_NEW_AGENTS', label: 'Agent download and agent key visibility' },
    { value: 'CAN_SEE_USAGE_INFORMATION', label: 'Access to license usage' },
    { value: 'CAN_CONFIGURE_INTEGRATIONS', label: 'Configuration of integrations' },
    { value: 'CAN_SEE_ON_PREM_LICENE_INFORMATION', label: 'Access to on prem license usage' },
    { value: 'CAN_CONFIGURE_CUSTOM_ALERTS', label: 'Configuration of custom alerts' },
    { value: 'CAN_CONFIGURE_API_TOKENS', label: 'Configuration of API tokens' },
    { value: 'CAN_CONFIGURE_AGENT_RUN_MODE', label: 'Configuration of agent mode' },
    { value: 'CAN_VIEW_AUDIT_LOG', label: 'Access to audit log' },
    { value: 'CAN_CONFIGURE_AGENTS', label: 'Configuration of agents' },
    { value: 'CAN_CONFIGURE_AUTHENTICATION_METHODS', label: 'Configuration of authentication methods' },
    { value: 'CAN_CONFIGURE_TEAMS', label: 'Access group configuration' },
    { value: 'CAN_CONFIGURE_RELEASES', label: 'Configuration of releases' },
    { value: 'CAN_CONFIGURE_LOG_MANAGEMENT', label: 'Configuration of log management' },
    { value: 'CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS', label: 'Creation of public custom dashboards' },
    { value: 'CAN_CONFIGURE_SESSION_SETTINGS', label: 'Access to token and session timeout settings' },
    { value: 'CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS', label: 'Configuration of service level indicators' },
    { value: 'CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD', label: 'Configuration of global custom payload for alerts' },
    { value: 'CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION', label: 'Access to account and billing information' }
  ];
}

function getProductRestrictions() {
  return [
    {
      value: RESTRICTED_ACCESS,
      label: 'Limit access by group access scopes',
      help: 'Enable role based access control.'
    },
    {
      value: CAN_VIEW_LOGS,
      label: 'Access of logs in the trace detail view',
      help: 'Enable access to logs.'
    },
    {
      value: CAN_VIEW_TRACE_DETAILS,
      label: 'Access of trace details in the trace detail view',
      help: 'Enable access to trace details.'
    }
  ];
}
