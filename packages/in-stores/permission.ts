/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  actionAutomationEnabled,
  openstackEnabled,
  pcfEnabled,
  phmcEnabled,
  syntheticsEnabled,
  vsphereEnabled,
  zhmcEnabled,
  infraExploreDataEnabled
} from 'in-services/featureFlags';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export const RESTRICTED_ACCESS = 'RESTRICTED_ACCESS';

export const LimitedAccessScope = Object.freeze({
  LIMITED_APPLICATIONS_SCOPE: 'LIMITED_APPLICATIONS_SCOPE',
  LIMITED_WEBSITES_SCOPE: 'LIMITED_WEBSITES_SCOPE',
  LIMITED_KUBERNETES_SCOPE: 'LIMITED_KUBERNETES_SCOPE',
  LIMITED_MOBILE_APPS_SCOPE: 'LIMITED_MOBILE_APPS_SCOPE',
  LIMITED_INFRASTRUCTURE_SCOPE: 'LIMITED_INFRASTRUCTURE_SCOPE',
  LIMITED_SYNTHETICS_SCOPE: 'LIMITED_SYNTHETICS_SCOPE',
  LIMITED_VSPHERE_SCOPE: 'LIMITED_VSPHERE_SCOPE',
  LIMITED_PHMC_SCOPE: 'LIMITED_PHMC_SCOPE',
  LIMITED_ZHMC_SCOPE: 'LIMITED_ZHMC_SCOPE',
  LIMITED_PCF_SCOPE: 'LIMITED_PCF_SCOPE',
  LIMITED_OPENSTACK_SCOPE: 'LIMITED_OPENSTACK_SCOPE'
} as const);
export type LimitedAccessScopeType = keyof typeof LimitedAccessScope;
export const LimitedAccessScopes = Object.freeze(Object.values(LimitedAccessScope));

export const AreaPermission = Object.freeze({
  ACCESS_WEBSITES: 'ACCESS_WEBSITES',
  ACCESS_MOBILE_APPS: 'ACCESS_MOBILE_APPS',
  ACCESS_APPLICATIONS: 'ACCESS_APPLICATIONS',
  ACCESS_KUBERNETES: 'ACCESS_KUBERNETES',
  ACCESS_INFRASTRUCTURE: 'ACCESS_INFRASTRUCTURE',
  ACCESS_SYNTHETICS: 'ACCESS_SYNTHETICS',
  ACCESS_VSPHERE: 'ACCESS_VSPHERE',
  ACCESS_PHMC: 'ACCESS_PHMC',
  ACCESS_ZHMC: 'ACCESS_ZHMC',
  ACCESS_PCF: 'ACCESS_PCF',
  ACCESS_OPENSTACK: 'ACCESS_OPENSTACK',
  ACCESS_INFRASTRUCTURE_ANALYZE: 'ACCESS_INFRASTRUCTURE_ANALYZE'
} as const);
export type AreaPermissionType = keyof typeof AreaPermission;
export const AreaPermissions = Object.freeze(Object.values(AreaPermission));

export const ACCESS_APPLICATIONS = AreaPermission.ACCESS_APPLICATIONS;
export const ACCESS_KUBERNETES = AreaPermission.ACCESS_KUBERNETES;
export const ACCESS_WEBSITES = AreaPermission.ACCESS_WEBSITES;
export const ACCESS_MOBILE_APPS = AreaPermission.ACCESS_MOBILE_APPS;
export const ACCESS_INFRASTRUCTURE = AreaPermission.ACCESS_INFRASTRUCTURE;
export const ACCESS_SYNTHETICS = AreaPermission.ACCESS_SYNTHETICS;
export const ACCESS_VSPHERE = AreaPermission.ACCESS_VSPHERE;
export const ACCESS_PHMC = AreaPermission.ACCESS_PHMC;
export const ACCESS_ZHMC = AreaPermission.ACCESS_ZHMC;
export const ACCESS_PCF = AreaPermission.ACCESS_PCF;
export const ACCESS_OPENSTACK = AreaPermission.ACCESS_OPENSTACK;
export const ACCESS_INFRASTRUCTURE_ANALYZE = AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE;

export const Capability = Object.freeze({
  CAN_CONFIGURE_EUM_APPLICATIONS: 'CAN_CONFIGURE_EUM_APPLICATIONS',
  CAN_CONFIGURE_MOBILE_APP_MONITORING: 'CAN_CONFIGURE_MOBILE_APP_MONITORING',
  CAN_CONFIGURE_APPLICATIONS: 'CAN_CONFIGURE_APPLICATIONS',
  CAN_CONFIGURE_SERVICE_MAPPING: 'CAN_CONFIGURE_SERVICE_MAPPING',
  CAN_INSTALL_NEW_AGENTS: 'CAN_INSTALL_NEW_AGENTS',
  CAN_CONFIGURE_AGENTS: 'CAN_CONFIGURE_AGENTS',
  CAN_CONFIGURE_AGENT_RUN_MODE: 'CAN_CONFIGURE_AGENT_RUN_MODE',
  CAN_CONFIGURE_INTEGRATIONS: 'CAN_CONFIGURE_INTEGRATIONS',
  CAN_CONFIGURE_CUSTOM_ALERTS: 'CAN_CONFIGURE_CUSTOM_ALERTS',
  CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD: 'CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD',
  CAN_CONFIGURE_GLOBAL_ALERT_CONFIGS: 'CAN_CONFIGURE_GLOBAL_ALERT_CONFIGS',
  CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS: 'CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS',
  CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS: 'CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS',
  CAN_CONFIGURE_LOG_MANAGEMENT: 'CAN_CONFIGURE_LOG_MANAGEMENT',
  CAN_CONFIGURE_RELEASES: 'CAN_CONFIGURE_RELEASES',
  CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS: 'CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS',
  CAN_CONFIGURE_USERS: 'CAN_CONFIGURE_USERS',
  CAN_CONFIGURE_TEAMS: 'CAN_CONFIGURE_TEAMS',
  CAN_CONFIGURE_API_TOKENS: 'CAN_CONFIGURE_API_TOKENS',
  CAN_CONFIGURE_PERSONAL_API_TOKENS: 'CAN_CONFIGURE_PERSONAL_API_TOKENS',
  CAN_CONFIGURE_AUTHENTICATION_METHODS: 'CAN_CONFIGURE_AUTHENTICATION_METHODS',
  CAN_VIEW_AUDIT_LOG: 'CAN_VIEW_AUDIT_LOG',
  CAN_CONFIGURE_SESSION_SETTINGS: 'CAN_CONFIGURE_SESSION_SETTINGS',
  CAN_VIEW_LOGS: 'CAN_VIEW_LOGS',
  CAN_VIEW_TRACE_DETAILS: 'CAN_VIEW_TRACE_DETAILS',
  CAN_SEE_USAGE_INFORMATION: 'CAN_SEE_USAGE_INFORMATION',
  CAN_SEE_ON_PREM_LICENE_INFORMATION: 'CAN_SEE_ON_PREM_LICENE_INFORMATION',
  CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION: 'CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION',
  CAN_CONFIGURE_AUTOMATION_ACTIONS: 'CAN_CONFIGURE_AUTOMATION_ACTIONS',
  CAN_RUN_AUTOMATION_ACTIONS: 'CAN_RUN_AUTOMATION_ACTIONS',
  CAN_CONFIGURE_SYNTHETIC_TESTS: 'CAN_CONFIGURE_SYNTHETIC_TESTS',
  CAN_CONFIGURE_SYNTHETIC_LOCATIONS: 'CAN_CONFIGURE_SYNTHETIC_LOCATIONS',
  CAN_VIEW_SYNTHETIC_TESTS: 'CAN_VIEW_SYNTHETIC_TESTS',
  CAN_VIEW_SYNTHETIC_LOCATIONS: 'CAN_VIEW_SYNTHETIC_LOCATIONS',
  CAN_VIEW_SYNTHETIC_TEST_RESULTS: 'CAN_VIEW_SYNTHETIC_TEST_RESULTS'
} as const);

export type CapabilityType = keyof typeof Capability;
export const Capabilities = Object.freeze(Object.values(Capability));

export type PermissionsUnion = AreaPermissionType | CapabilityType | LimitedAccessScopeType;

const permissions = window.instana?.permissions ?? [];

export const hasRestrictedAccess = role?.restrictedAccess ?? false;

/**
 * Verifies if the current user has access with the given scope and access
 * @param limitedScope if unlimited, then user has always access
 * @param accessPermission if limitedScope then requires to accessPermission
 * @return true if user has permission
 */
function hasPermission(limitedScope: string, accessPermission: string): boolean {
  // hasRestrictedAccess validation is required, support role does only contain the CAN_* permissions
  // it is missing all the ACCESS_* permissions
  if (!hasRestrictedAccess || permissions.indexOf(limitedScope) === -1) return true;
  return permissions.indexOf(accessPermission) !== -1;
}

export const hasApplicationsAccess = hasPermission(LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE, ACCESS_APPLICATIONS);
export const hasKubernetesAccess = hasPermission(LimitedAccessScope.LIMITED_KUBERNETES_SCOPE, ACCESS_KUBERNETES);
export const hasWebsitesAccess = hasPermission(LimitedAccessScope.LIMITED_WEBSITES_SCOPE, ACCESS_WEBSITES);
export const hasMobileAppsAccess = hasPermission(LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE, ACCESS_MOBILE_APPS);
export const hasInfrastructureAnalyzeAccess =
  hasPermission(LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE, ACCESS_INFRASTRUCTURE_ANALYZE) &&
  infraExploreDataEnabled;
export const hasAnalyzeAccess =
  hasApplicationsAccess || hasWebsitesAccess || hasMobileAppsAccess || hasInfrastructureAnalyzeAccess;
export const hasInfrastructureAccess = hasPermission(
  LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
  ACCESS_INFRASTRUCTURE
);
export const hasSyntheticsAccess =
  hasPermission(LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE, ACCESS_SYNTHETICS) && syntheticsEnabled;
export const hasVSphereAccess =
  hasPermission(LimitedAccessScope.LIMITED_VSPHERE_SCOPE, ACCESS_VSPHERE) && vsphereEnabled;
export const hasPHMCAccess = hasPermission(LimitedAccessScope.LIMITED_PHMC_SCOPE, ACCESS_PHMC) && phmcEnabled;
export const hasZHMCAccess = hasPermission(LimitedAccessScope.LIMITED_ZHMC_SCOPE, ACCESS_ZHMC) && zhmcEnabled;
export const hasPCFAccess = hasPermission(LimitedAccessScope.LIMITED_PCF_SCOPE, ACCESS_PCF) && pcfEnabled;
export const hasOpenStackAccess =
  hasPermission(LimitedAccessScope.LIMITED_OPENSTACK_SCOPE, ACCESS_OPENSTACK) && openstackEnabled;
export const hasAPlatformAccess =
  hasVSphereAccess || hasPHMCAccess || hasZHMCAccess || hasPCFAccess || hasOpenStackAccess || hasKubernetesAccess;
export const hasEventsAccess =
  hasWebsitesAccess || hasApplicationsAccess || hasAPlatformAccess || hasInfrastructureAccess;

interface AreaPermissionProps {
  value: AreaPermissionType;
  label: string;
  isNew?: boolean;
}

function getProductAreaPermissions(): Array<AreaPermissionProps> {
  const areaPermissions: Array<AreaPermissionProps> = [
    { value: AreaPermission.ACCESS_WEBSITES, label: t('in-stores:permissionAccessWebsitesLabel') },
    { value: AreaPermission.ACCESS_MOBILE_APPS, label: t('in-stores:permissionAccessMobileAppsLabel') },
    { value: AreaPermission.ACCESS_APPLICATIONS, label: t('in-stores:permissionAccessApplicationsLabel') }
  ];
  if (pcfEnabled) {
    areaPermissions.push({ value: AreaPermission.ACCESS_PCF, label: t('in-stores:permissionAccessPCFLabel') });
  }
  if (openstackEnabled) {
    areaPermissions.push({
      value: AreaPermission.ACCESS_OPENSTACK,
      label: t('in-stores:permissionAccessOpenStackLabel')
    });
  }
  if (phmcEnabled) {
    areaPermissions.push({ value: AreaPermission.ACCESS_PHMC, label: t('in-stores:permissionAccessPHMCLabel') });
  }
  if (zhmcEnabled) {
    areaPermissions.push({ value: AreaPermission.ACCESS_ZHMC, label: t('in-stores:permissionAccessZHMCLabel') });
  }

  areaPermissions.push({
    value: AreaPermission.ACCESS_KUBERNETES,
    label: t('in-stores:permissionAccessKubernetesLabel')
  });

  if (vsphereEnabled) {
    areaPermissions.push({ value: AreaPermission.ACCESS_VSPHERE, label: t('in-stores:permissionAccessVSphereLabel') });
  }

  areaPermissions.push({
    value: AreaPermission.ACCESS_INFRASTRUCTURE,
    label: t('in-stores:permissionAccessInfrastructureLabel')
  });

  areaPermissions.push({
    value: AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE,
    label: t('in-stores:permissionAccessInfrastructureAnalyzeLabel'),
    isNew: true
  });

  if (syntheticsEnabled) {
    areaPermissions.push({
      value: AreaPermission.ACCESS_SYNTHETICS,
      label: t('in-stores:permissionAccessSyntheticsLabel')
    });
  }
  return areaPermissions;
}

interface ProductPermission {
  keyForGroupApi: CapabilityType;
  keyForApiTokenApi: string;
  label: string;
  description: string;
  category: string;
  isOwnerPermission?: boolean;
}

type ProductPermissionsObjectType = {
  [key in CapabilityType]: ProductPermission;
};

export const productPermissionsObject: ProductPermissionsObjectType = {
  [Capability.CAN_CONFIGURE_EUM_APPLICATIONS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_EUM_APPLICATIONS,
    keyForApiTokenApi: 'canConfigureEumApplications',
    label: t('in-stores:permissionCanConfigureEumApplicationsLabel'),
    description: t('in-stores:permissionCanConfigureEumApplicationsDescription'),
    category: t('in-stores:permissionCanConfigureEumApplicationsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING,
    keyForApiTokenApi: 'canConfigureMobileAppMonitoring',
    label: t('in-stores:permissionCanConfigureMobileAppMonitoringLabel'),
    description: t('in-stores:permissionCanConfigureMobileAppMonitoringDescription'),
    category: t('in-stores:permissionCanConfigureMobileAppMonitoringCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_APPLICATIONS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_APPLICATIONS,
    keyForApiTokenApi: 'canConfigureApplications',
    label: t('in-stores:permissionCanConfigureApplicationsLabel'),
    description: t('in-stores:permissionCanConfigureApplicationsDescription'),
    category: t('in-stores:permissionCanConfigureApplicationsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_SERVICE_MAPPING]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SERVICE_MAPPING,
    keyForApiTokenApi: 'canConfigureServiceMapping',
    label: t('in-stores:permissionCanConfigureServiceMappingLabel'),
    description: t('in-stores:permissionCanConfigureServiceMappingDescription'),
    category: t('in-stores:permissionCanConfigureServiceMappingCategory'),
    isOwnerPermission: false
  },
  /* Infrastructure */
  [Capability.CAN_INSTALL_NEW_AGENTS]: {
    keyForGroupApi: Capability.CAN_INSTALL_NEW_AGENTS,
    keyForApiTokenApi: 'canInstallNewAgents',
    label: t('in-stores:permissionCanInstallNewAgentsLabel'),
    description: t('in-stores:permissionCanInstallNewAgentsDescription'),
    category: t('in-stores:permissionCanInstallNewAgentsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_AGENTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_AGENTS,
    keyForApiTokenApi: 'canConfigureAgents',
    label: t('in-stores:permissionCanConfigureAgentsLabel'),
    description: t('in-stores:permissionCanConfigureAgentsDescription'),
    category: t('in-stores:permissionCanConfigureAgentsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_AGENT_RUN_MODE]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_AGENT_RUN_MODE,
    keyForApiTokenApi: 'canConfigureAgentRunMode',
    label: t('in-stores:permissionCanConfigureAgentRunModeLabel'),
    description: t('in-stores:permissionCanConfigureAgentRunModeDescription'),
    category: t('in-stores:permissionCanConfigureAgentRunModeCategory'),
    isOwnerPermission: false
  },
  /* Events */
  [Capability.CAN_CONFIGURE_INTEGRATIONS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_INTEGRATIONS,
    keyForApiTokenApi: 'canConfigureIntegrations',
    label: t('in-stores:permissionCanConfigureIntegrationsLabel'),
    description: t('in-stores:permissionCanConfigureIntegrationsDescription'),
    category: t('in-stores:permissionCanConfigureIntegrationsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_CUSTOM_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_CUSTOM_ALERTS,
    keyForApiTokenApi: 'canConfigureCustomAlerts',
    label: t('in-stores:permissionCanConfigureCustomAlertsLabel'),
    description: t('in-stores:permissionCanConfigureCustomAlertsDescription'),
    category: t('in-stores:permissionCanConfigureCustomAlertsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD,
    keyForApiTokenApi: 'canConfigureGlobalAlertPayload',
    label: t('in-stores:permissionCanConfigureGlobalAlertPayloadLabel'),
    description: t('in-stores:permissionCanConfigureGlobalAlertPayloadDescription'),
    category: t('in-stores:permissionCanConfigureGlobalAlertPayloadCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_GLOBAL_ALERT_CONFIGS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_GLOBAL_ALERT_CONFIGS,
    keyForApiTokenApi: 'canConfigureGlobalAlertConfigs',
    label: t('in-stores:permissionCanConfigureGlobalAlertConfigsLabel'),
    description: t('in-stores:permissionCanConfigureGlobalAlertConfigsDescription'),
    category: t('in-stores:permissionCanConfigureGlobalAlertConfigsCategory')
  },
  /* Custom Dashboards */
  [Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS]: {
    keyForGroupApi: Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS,
    keyForApiTokenApi: 'canCreatePublicCustomDashboards',
    label: t('in-stores:permissionCanCreatePublicCustomDashboardsLabel'),
    description: t('in-stores:permissionCanCreatePublicCustomDashboardsDescription'),
    category: t('in-stores:permissionCanCreatePublicCustomDashboardsCategory'),
    isOwnerPermission: true
  },
  [Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS]: {
    keyForGroupApi: Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS,
    keyForApiTokenApi: 'canEditAllAccessibleCustomDashboards',
    label: t('in-stores:permissionCanEditAllAccessibleCustomDashboardsLabel'),
    description: t('in-stores:permissionCanEditAllAccessibleCustomDashboardsDescription'),
    category: t('in-stores:permissionCanEditAllAccessibleCustomDashboardsCategory'),
    isOwnerPermission: false
  },
  /* Extensions */
  [Capability.CAN_CONFIGURE_LOG_MANAGEMENT]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
    keyForApiTokenApi: 'canConfigureLogManagement',
    label: t('in-stores:permissionCanConfigureLogManagementLabel'),
    description: t('in-stores:permissionCanConfigureLogManagementDescription'),
    category: t('in-stores:permissionCanConfigureLogManagementCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_RELEASES]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_RELEASES,
    keyForApiTokenApi: 'canConfigureReleases',
    label: t('in-stores:permissionCanConfigureReleasesLabel'),
    description: t('in-stores:permissionCanConfigureReleasesDescription'),
    category: t('in-stores:permissionCanConfigureReleasesCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS,
    keyForApiTokenApi: 'canConfigureServiceLevelIndicators',
    label: t('in-stores:permissionCanConfigureServiceLevelIndicatorsLabel'),
    description: t('in-stores:permissionCanConfigureServiceLevelIndicatorsDescription'),
    category: t('in-stores:permissionCanConfigureServiceLevelIndicatorsCategory'),
    isOwnerPermission: false
  },
  /* Access Control */
  [Capability.CAN_CONFIGURE_USERS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_USERS,
    keyForApiTokenApi: 'canConfigureUsers',
    label: t('in-stores:permissionCanConfigureUsersLabel'),
    description: t('in-stores:permissionCanConfigureUsersDescription'),
    category: t('in-stores:permissionCanConfigureUsersCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_TEAMS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_TEAMS,
    keyForApiTokenApi: 'canConfigureTeams',
    label: t('in-stores:permissionCanConfigureTeamsLabel'),
    description: t('in-stores:permissionCanConfigureTeamsDescription'),
    category: t('in-stores:permissionCanConfigureTeamsCategory'),
    isOwnerPermission: true
  },
  [Capability.CAN_CONFIGURE_API_TOKENS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_API_TOKENS,
    keyForApiTokenApi: 'canConfigureApiTokens',
    label: t('in-stores:permissionCanConfigureApiTokensLabel'),
    description: t('in-stores:permissionCanConfigureApiTokensDescription'),
    category: t('in-stores:permissionCanConfigureApiTokensCategory'),
    isOwnerPermission: true
  },
  [Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS,
    keyForApiTokenApi: '', // indicates that this is not a permission for a token
    label: t('in-stores:permissionCanConfigurePersonalApiTokensLabel'),
    description: t('in-stores:permissionCanConfigurePersonalApiTokensDescription'),
    category: t('in-stores:permissionCanConfigurePersonalApiTokensCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS,
    keyForApiTokenApi: 'canConfigureAuthenticationMethods',
    label: t('in-stores:permissionCanConfigureAuthenticationMethodsLabel'),
    description: t('in-stores:permissionCanConfigureAuthenticationMethodsDescription'),
    category: t('in-stores:permissionCanConfigureAuthenticationMethodsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_VIEW_AUDIT_LOG]: {
    keyForGroupApi: Capability.CAN_VIEW_AUDIT_LOG,
    keyForApiTokenApi: 'canViewAuditLog',
    label: t('in-stores:permissionCanViewAuditLogLabel'),
    description: t('in-stores:permissionCanViewAuditLogDescription'),
    category: t('in-stores:permissionCanViewAuditLogCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_SESSION_SETTINGS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SESSION_SETTINGS,
    keyForApiTokenApi: 'canConfigureSessionSettings',
    label: t('in-stores:permissionCanConfigureSessionSettingsLabel'),
    description: t('in-stores:permissionCanConfigureSessionSettingsDescription'),
    category: t('in-stores:permissionCanConfigureSessionSettingsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_VIEW_LOGS]: {
    keyForGroupApi: Capability.CAN_VIEW_LOGS,
    keyForApiTokenApi: '', // indicates that this is not a permission for a token
    label: t('in-stores:permissionCanViewLogsLabel'),
    description: t('in-stores:permissionCanViewLogsDescription'),
    category: t('in-stores:permissionCanViewLogsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_VIEW_TRACE_DETAILS]: {
    keyForGroupApi: Capability.CAN_VIEW_TRACE_DETAILS,
    keyForApiTokenApi: '', // indicates that this is not a permission for a token
    label: t('in-stores:permissionCanViewTraceDetailsLabel'),
    description: t('in-stores:permissionCanViewTraceDetailsDescription'),
    category: t('in-stores:permissionCanViewTraceDetailsCategory'),
    isOwnerPermission: false
  },
  /* Account Information */
  [Capability.CAN_SEE_USAGE_INFORMATION]: {
    keyForGroupApi: Capability.CAN_SEE_USAGE_INFORMATION,
    keyForApiTokenApi: 'canSeeUsageInformation',
    label: t('in-stores:permissionCanSeeUsageInformationLabel'),
    description: t('in-stores:permissionCanSeeUsageInformationDescription'),
    category: t('in-stores:permissionCanSeeUsageInformationCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_SEE_ON_PREM_LICENE_INFORMATION]: {
    keyForGroupApi: Capability.CAN_SEE_ON_PREM_LICENE_INFORMATION,
    keyForApiTokenApi: 'canSeeOnPremLicenseInformation',
    label: t('in-stores:permissionCanSeeOnPremLicenseInformationLabel'),
    description: t('in-stores:permissionCanSeeOnPremLicenseInformationDescription'),
    category: t('in-stores:permissionCanSeeOnPremLicenseInformationCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION]: {
    keyForGroupApi: Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION,
    keyForApiTokenApi: 'canViewAccountAndBillingInformation',
    label: t('in-stores:permissionCanViewAccountAndBillingInformationLabel'),
    description: t('in-stores:permissionCanViewAccountAndBillingInformationDescription'),
    category: t('in-stores:permissionCanViewAccountAndBillingInformationCategory')
  },
  /* Automation */
  [Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
    keyForApiTokenApi: 'canConfigureAutomationActions',
    label: t('in-stores:permissionCanConfigureAutomationActionsLabel'),
    description: t('in-stores:permissionCanConfigureAutomationActionsDescription'),
    category: t('in-stores:permissionCanConfigureAutomationActionsCategory')
  },
  [Capability.CAN_RUN_AUTOMATION_ACTIONS]: {
    keyForGroupApi: Capability.CAN_RUN_AUTOMATION_ACTIONS,
    keyForApiTokenApi: 'canRunAutomationActions',
    label: t('in-stores:permissionCanRunAutomationActionsLabel'),
    description: t('in-stores:permissionCanRunAutomationActionsDescription'),
    category: t('in-stores:permissionCanRunAutomationActionsCategory')
  },
  /* Synthetic */
  [Capability.CAN_CONFIGURE_SYNTHETIC_TESTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
    keyForApiTokenApi: 'canConfigureSyntheticTests',
    label: t('in-stores:permissionCanConfigureSyntheticTestsLabel'),
    description: t('in-stores:permissionCanConfigureSyntheticTestsDescription'),
    category: t('in-stores:permissionSyntheticMonitoringCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
    keyForApiTokenApi: 'canConfigureSyntheticLocations',
    label: t('in-stores:permissionCanConfigureSyntheticLocationsLabel'),
    description: t('in-stores:permissionCanConfigureSyntheticLocationsDescription'),
    category: t('in-stores:permissionSyntheticMonitoringCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_VIEW_SYNTHETIC_TESTS]: {
    keyForGroupApi: Capability.CAN_VIEW_SYNTHETIC_TESTS,
    keyForApiTokenApi: 'canViewSyntheticTests',
    label: t('in-stores:permissionCanViewSyntheticTestsLabel'),
    description: t('in-stores:permissionCanViewSyntheticTestsDescription'),
    category: t('in-stores:permissionSyntheticMonitoringCategory')
  },
  [Capability.CAN_VIEW_SYNTHETIC_LOCATIONS]: {
    keyForGroupApi: Capability.CAN_VIEW_SYNTHETIC_LOCATIONS,
    keyForApiTokenApi: 'canViewSyntheticLocations',
    label: t('in-stores:permissionCanViewSyntheticLocationsLabel'),
    description: t('in-stores:permissionCanViewSyntheticLocationsDescription'),
    category: t('in-stores:permissionSyntheticMonitoringCategory')
  },
  [Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS]: {
    keyForGroupApi: Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS,
    keyForApiTokenApi: 'canViewSyntheticTestResults',
    label: t('in-stores:permissionCanViewSyntheticTestResultsLabel'),
    description: t('in-stores:permissionCanViewSyntheticTestResultsDescription'),
    category: t('in-stores:permissionSyntheticMonitoringCategory')
  }
};

export function getProductPermissions(): Array<ProductPermission> {
  let permissions: Array<ProductPermission> = Object.values(productPermissionsObject);

  if (!syntheticsEnabled) {
    permissions = permissions.filter(({ keyForGroupApi }) => {
      const syntheticCapabilities: Array<CapabilityType> = [
        Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
        Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
        Capability.CAN_VIEW_SYNTHETIC_TESTS,
        Capability.CAN_VIEW_SYNTHETIC_LOCATIONS,
        Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS
      ];

      return !syntheticCapabilities.includes(keyForGroupApi);
    });
  }

  if (!actionAutomationEnabled) {
    permissions = permissions.filter(({ keyForGroupApi }) => {
      const automationCapabilities: Array<CapabilityType> = [
        Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
        Capability.CAN_RUN_AUTOMATION_ACTIONS
      ];

      return !automationCapabilities.includes(keyForGroupApi);
    });
  }

  return permissions;
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

export const productAreaPermissions = getProductAreaPermissions();
export const productPermissions = getProductPermissions();
export const productOwnerPermissions = getProductPermissions().filter(permission => permission.isOwnerPermission);
export const productNonOwnerPermissions = getProductPermissions().filter(permission => !permission.isOwnerPermission);
export const productRestrictions = getProductRestrictions();
export const apiTokenPermissions = getProductPermissions().filter(permission => permission.keyForApiTokenApi != '');
