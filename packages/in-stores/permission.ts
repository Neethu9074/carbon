/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  actionAutomationEnabled,
  infraExploreDataEnabled,
  openstackEnabled,
  pcfEnabled,
  phmcEnabled,
  sapEnabled,
  syntheticsEnabled,
  vsphereEnabled,
  zhmcEnabled,
  sloFullEnabled,
  powervcEnabled,
  infraSmartAlertsEnabled,
  logSmartAlertsEnabled,
  applicationSubtracesEnabled,
  nutanixEnabled,
  xenserverEnabled
} from 'in-services/featureFlags';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export const LimitedAccessScope = Object.freeze({
  LIMITED_WEBSITES_SCOPE: 'LIMITED_WEBSITES_SCOPE',
  LIMITED_MOBILE_APPS_SCOPE: 'LIMITED_MOBILE_APPS_SCOPE',
  LIMITED_BIZOPS_SCOPE: 'LIMITED_BIZOPS_SCOPE',
  LIMITED_APPLICATIONS_SCOPE: 'LIMITED_APPLICATIONS_SCOPE',
  LIMITED_KUBERNETES_SCOPE: 'LIMITED_KUBERNETES_SCOPE',
  LIMITED_INFRASTRUCTURE_SCOPE: 'LIMITED_INFRASTRUCTURE_SCOPE',
  LIMITED_SYNTHETICS_SCOPE: 'LIMITED_SYNTHETICS_SCOPE',
  LIMITED_VSPHERE_SCOPE: 'LIMITED_VSPHERE_SCOPE',
  LIMITED_PHMC_SCOPE: 'LIMITED_PHMC_SCOPE',
  LIMITED_POWERVC_SCOPE: 'LIMITED_POWERVC_SCOPE',
  LIMITED_ZHMC_SCOPE: 'LIMITED_ZHMC_SCOPE',
  LIMITED_PCF_SCOPE: 'LIMITED_PCF_SCOPE',
  LIMITED_OPENSTACK_SCOPE: 'LIMITED_OPENSTACK_SCOPE',
  LIMITED_SAP_SCOPE: 'LIMITED_SAP_SCOPE',
  LIMITED_AUTOMATION_SCOPE: 'LIMITED_AUTOMATION_SCOPE',
  LIMITED_NUTANIX_SCOPE: 'LIMITED_NUTANIX_SCOPE',
  LIMITED_XENSERVER_SCOPE: 'LIMITED_XENSERVER_SCOPE'
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
  ACCESS_POWERVC: 'ACCESS_POWERVC',
  ACCESS_ZHMC: 'ACCESS_ZHMC',
  ACCESS_PCF: 'ACCESS_PCF',
  ACCESS_OPENSTACK: 'ACCESS_OPENSTACK',
  ACCESS_INFRASTRUCTURE_ANALYZE: 'ACCESS_INFRASTRUCTURE_ANALYZE',
  ACCESS_SAP: 'ACCESS_SAP',
  ACCESS_BIZOPS: 'ACCESS_BIZOPS',
  ACCESS_AUTOMATION: 'ACCESS_AUTOMATION',
  ACCESS_NUTANIX: 'ACCESS_NUTANIX',
  ACCESS_XENSERVER: 'ACCESS_XENSERVER'
} as const);
export type AreaPermissionType = keyof typeof AreaPermission;
export const AreaPermissions = Object.freeze(Object.values(AreaPermission));
export const Capability = Object.freeze({
  CAN_CONFIGURE_EUM_APPLICATIONS: 'CAN_CONFIGURE_EUM_APPLICATIONS',
  CAN_CONFIGURE_MOBILE_APP_MONITORING: 'CAN_CONFIGURE_MOBILE_APP_MONITORING',
  CAN_CONFIGURE_APPLICATIONS: 'CAN_CONFIGURE_APPLICATIONS',
  CAN_CONFIGURE_SUBTRACES: 'CAN_CONFIGURE_SUBTRACES',
  CAN_CONFIGURE_SERVICE_MAPPING: 'CAN_CONFIGURE_SERVICE_MAPPING',
  CAN_INSTALL_NEW_AGENTS: 'CAN_INSTALL_NEW_AGENTS',
  CAN_CONFIGURE_AGENTS: 'CAN_CONFIGURE_AGENTS',
  CAN_CONFIGURE_AGENT_RUN_MODE: 'CAN_CONFIGURE_AGENT_RUN_MODE',
  CAN_CONFIGURE_INTEGRATIONS: 'CAN_CONFIGURE_INTEGRATIONS',
  CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD: 'CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD',
  CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS: 'CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS',
  CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS: 'CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS',
  CAN_CONFIGURE_LOG_MANAGEMENT: 'CAN_CONFIGURE_LOG_MANAGEMENT',
  CAN_CONFIGURE_DATABASE_MANAGEMENT: 'CAN_CONFIGURE_DATABASE_MANAGEMENT',
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
  CAN_DELETE_LOGS: 'CAN_DELETE_LOGS',
  CAN_CONFIGURE_LOG_RETENTION_PERIOD: 'CAN_CONFIGURE_LOG_RETENTION_PERIOD',
  CAN_VIEW_LOG_VOLUME: 'CAN_VIEW_LOG_VOLUME',
  CAN_VIEW_TRACE_DETAILS: 'CAN_VIEW_TRACE_DETAILS',
  CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION: 'CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION',
  CAN_CONFIGURE_AUTOMATION_ACTIONS: 'CAN_CONFIGURE_AUTOMATION_ACTIONS',
  CAN_RUN_AUTOMATION_ACTIONS: 'CAN_RUN_AUTOMATION_ACTIONS',
  CAN_CONFIGURE_AUTOMATION_POLICIES: 'CAN_CONFIGURE_AUTOMATION_POLICIES',
  CAN_DELETE_AUTOMATION_ACTION_HISTORY: 'CAN_DELETE_AUTOMATION_ACTION_HISTORY',
  CAN_CONFIGURE_SYNTHETIC_TESTS: 'CAN_CONFIGURE_SYNTHETIC_TESTS',
  CAN_CONFIGURE_SYNTHETIC_LOCATIONS: 'CAN_CONFIGURE_SYNTHETIC_LOCATIONS',
  CAN_VIEW_SYNTHETIC_TESTS: 'CAN_VIEW_SYNTHETIC_TESTS',
  CAN_VIEW_SYNTHETIC_LOCATIONS: 'CAN_VIEW_SYNTHETIC_LOCATIONS',
  CAN_VIEW_SYNTHETIC_TEST_RESULTS: 'CAN_VIEW_SYNTHETIC_TEST_RESULTS',
  CAN_USE_SYNTHETIC_CREDENTIALS: 'CAN_USE_SYNTHETIC_CREDENTIALS',
  CAN_CONFIGURE_SYNTHETIC_CREDENTIALS: 'CAN_CONFIGURE_SYNTHETIC_CREDENTIALS',
  CAN_CONFIGURE_EVENTS_AND_ALERTS: 'CAN_CONFIGURE_EVENTS_AND_ALERTS',
  CAN_CONFIGURE_MAINTENANCE_WINDOWS: 'CAN_CONFIGURE_MAINTENANCE_WINDOWS',
  CAN_CONFIGURE_APPLICATION_SMART_ALERTS: 'CAN_CONFIGURE_APPLICATION_SMART_ALERTS',
  CAN_CONFIGURE_WEBSITE_SMART_ALERTS: 'CAN_CONFIGURE_WEBSITE_SMART_ALERTS',
  CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS: 'CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS',
  CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS: 'CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS',
  CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS: 'CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS',
  CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS: 'CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS',
  CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS: 'CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS',
  CAN_CREATE_HEAP_DUMP: 'CAN_CREATE_HEAP_DUMP',
  CAN_CREATE_THREAD_DUMP: 'CAN_CREATE_THREAD_DUMP',
  CAN_MANUALLY_CLOSE_ISSUE: 'CAN_MANUALLY_CLOSE_ISSUE',
  CAN_INVOKE_ALERT_CHANNEL: 'CAN_INVOKE_ALERT_CHANNEL'
} as const);

export const InfrastructureCapability = Object.freeze({
  [AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE]: AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE,
  CAN_CREATE_HEAP_DUMP: 'CAN_CREATE_HEAP_DUMP',
  CAN_CREATE_THREAD_DUMP: 'CAN_CREATE_THREAD_DUMP',
  CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS: 'CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS'
} as const);

export type CapabilityType = keyof typeof Capability;
export const Capabilities = Object.freeze(Object.values(Capability));

export type PermissionsUnion = AreaPermissionType | CapabilityType | LimitedAccessScopeType;

const permissions = role?.permissions ?? [];

/**
 * Verifies if the current user has access with the given scope and access
 * @param limitedScope if unlimited, then user has always access
 * @param accessPermission if limitedScope then requires to accessPermission
 * @return true if user has permission
 */
function hasPermission(limitedScope: string, accessPermission: string): boolean {
  // users are not allowed to see an area once this area is limited and no additional access is given
  if (!permissions.includes(limitedScope)) return true;
  return permissions.includes(accessPermission);
}

export const hasApplicationsAccess = hasPermission(
  LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
  AreaPermission.ACCESS_APPLICATIONS
);
export const hasKubernetesAccess = hasPermission(
  LimitedAccessScope.LIMITED_KUBERNETES_SCOPE,
  AreaPermission.ACCESS_KUBERNETES
);
export const hasWebsitesAccess = hasPermission(
  LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
  AreaPermission.ACCESS_WEBSITES
);
export const hasMobileAppsAccess = hasPermission(
  LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
  AreaPermission.ACCESS_MOBILE_APPS
);
export const hasInfrastructureAnalyzeAccess =
  hasPermission(LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE, AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE) &&
  infraExploreDataEnabled;
export const hasAnalyzeAccess =
  hasApplicationsAccess || hasWebsitesAccess || hasMobileAppsAccess || hasInfrastructureAnalyzeAccess;
export const hasInfrastructureAccess = hasPermission(
  LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
  AreaPermission.ACCESS_INFRASTRUCTURE
);
export const hasSyntheticsAccess =
  hasPermission(LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE, AreaPermission.ACCESS_SYNTHETICS) && syntheticsEnabled;
export const hasVSphereAccess =
  hasPermission(LimitedAccessScope.LIMITED_VSPHERE_SCOPE, AreaPermission.ACCESS_VSPHERE) && vsphereEnabled;
export const hasPHMCAccess =
  hasPermission(LimitedAccessScope.LIMITED_PHMC_SCOPE, AreaPermission.ACCESS_PHMC) && phmcEnabled;
export const hasPowerVcAccess =
  hasPermission(LimitedAccessScope.LIMITED_POWERVC_SCOPE, AreaPermission.ACCESS_POWERVC) && powervcEnabled;
export const hasZHMCAccess =
  hasPermission(LimitedAccessScope.LIMITED_ZHMC_SCOPE, AreaPermission.ACCESS_ZHMC) && zhmcEnabled;
export const hasPCFAccess =
  hasPermission(LimitedAccessScope.LIMITED_PCF_SCOPE, AreaPermission.ACCESS_PCF) && pcfEnabled;
export const hasOpenStackAccess =
  hasPermission(LimitedAccessScope.LIMITED_OPENSTACK_SCOPE, AreaPermission.ACCESS_OPENSTACK) && openstackEnabled;
export const hasSAPAccess =
  hasPermission(LimitedAccessScope.LIMITED_SAP_SCOPE, AreaPermission.ACCESS_SAP) && sapEnabled;
export const hasNutanixAccess =
  hasPermission(LimitedAccessScope.LIMITED_NUTANIX_SCOPE, AreaPermission.ACCESS_NUTANIX) && nutanixEnabled;
export const hasXenServerAccess =
  hasPermission(LimitedAccessScope.LIMITED_XENSERVER_SCOPE, AreaPermission.ACCESS_XENSERVER) && xenserverEnabled;
export const hasAPlatformAccess =
  hasVSphereAccess ||
  hasPHMCAccess ||
  hasZHMCAccess ||
  hasPCFAccess ||
  hasPowerVcAccess ||
  hasOpenStackAccess ||
  hasKubernetesAccess ||
  hasSAPAccess ||
  hasNutanixAccess ||
  hasXenServerAccess;

export const hasCanCreateHeapDump =
  hasInfrastructureAccess && permissions.includes(InfrastructureCapability.CAN_CREATE_HEAP_DUMP);
export const hasCanCreateThreadDump =
  hasInfrastructureAccess && permissions.includes(InfrastructureCapability.CAN_CREATE_THREAD_DUMP);

export const amountPlatformAccesses = (() => {
  if (!hasAPlatformAccess) return 0;
  let count = 0;
  if (hasVSphereAccess) count++;
  if (hasPHMCAccess) count++;
  if (hasZHMCAccess) count++;
  if (hasPCFAccess) count++;
  if (hasOpenStackAccess) count++;
  if (hasPowerVcAccess) count++;
  if (hasKubernetesAccess) count++;
  if (hasSAPAccess) count++;
  if (hasNutanixAccess) count++;
  if (hasXenServerAccess) count++;
  return count;
})();

export const hasSloAccess = sloFullEnabled && (hasWebsitesAccess || hasApplicationsAccess || hasSyntheticsAccess);
export const hasEventsAccess =
  hasWebsitesAccess ||
  hasMobileAppsAccess ||
  hasApplicationsAccess ||
  hasAPlatformAccess ||
  hasInfrastructureAccess ||
  hasSyntheticsAccess;

export const hasBizOpsAccess = hasPermission(LimitedAccessScope.LIMITED_BIZOPS_SCOPE, AreaPermission.ACCESS_BIZOPS);

export const hasAutomationAccess =
  actionAutomationEnabled &&
  hasPermission(LimitedAccessScope.LIMITED_AUTOMATION_SCOPE, AreaPermission.ACCESS_AUTOMATION);

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
  if (powervcEnabled) {
    areaPermissions.push({ value: AreaPermission.ACCESS_POWERVC, label: t('in-stores:permissionAccessPowerVCLabel') });
  }
  if (zhmcEnabled) {
    areaPermissions.push({ value: AreaPermission.ACCESS_ZHMC, label: t('in-stores:permissionAccessZHMCLabel') });
  }
  if (sapEnabled) {
    areaPermissions.push({ value: AreaPermission.ACCESS_SAP, label: t('in-stores:permissionAccessSAPLabel') });
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

  areaPermissions.push({
    value: AreaPermission.ACCESS_BIZOPS,
    label: t('in-stores:permissionAccessBizOpsLabel')
  });

  if (actionAutomationEnabled) {
    areaPermissions.push({
      value: AreaPermission.ACCESS_AUTOMATION,
      label: t('in-stores:permissionAccessAutomationLabel')
    });
  }
  return areaPermissions;
}

export interface ProductPermission {
  keyForGroupApi: CapabilityType;
  keyForApiTokenApi: string;
  label: string;
  description?: string;
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
    category: t('in-stores:permissionCanConfigureEumApplicationsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING,
    keyForApiTokenApi: 'canConfigureMobileAppMonitoring',
    label: t('in-stores:permissionCanConfigureMobileAppMonitoringLabel'),
    category: t('in-stores:permissionCanConfigureMobileAppMonitoringCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_APPLICATIONS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_APPLICATIONS,
    keyForApiTokenApi: 'canConfigureApplications',
    label: t('in-stores:permissionCanConfigureApplicationsLabel'),
    category: t('in-stores:permissionCanConfigureApplicationsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_SERVICE_MAPPING]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SERVICE_MAPPING,
    keyForApiTokenApi: 'canConfigureServiceMapping',
    label: t('in-stores:permissionCanConfigureServiceMappingLabel'),
    category: t('in-stores:permissionCanConfigureServiceMappingCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_SUBTRACES]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SUBTRACES,
    keyForApiTokenApi: 'canConfigureSubtraces',
    label: t('in-stores:permissionCanConfigureSubtracesLabel'),
    category: t('in-stores:permissionCanConfigureSubtracesCategory'),
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
    category: t('in-stores:permissionCanConfigureIntegrationsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS,
    keyForApiTokenApi: 'canConfigureEventsAndAlerts',
    label: t('in-stores:permissionCanConfigureEventsAndAlertsLabel'),
    category: t('in-stores:permissionCanConfigureEventsAndAlertsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS,
    keyForApiTokenApi: 'canConfigureMaintenanceWindows',
    label: t('in-stores:permissionCanConfigureMaintenanceWindowsLabel'),
    category: t('in-stores:permissionCanConfigureMaintenanceWindowsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS,
    keyForApiTokenApi: 'canConfigureApplicationSmartAlerts',
    label: t('in-stores:permissionCanConfigureApplicationSmartAlertsLabel'),
    category: t('in-stores:permissionCanConfigureApplicationSmartAlertsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS,
    keyForApiTokenApi: 'canConfigureWebsiteSmartAlerts',
    label: t('in-stores:permissionCanConfigureWebsiteSmartAlertsLabel'),
    category: t('in-stores:permissionCanConfigureWebsiteSmartAlertsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS,
    keyForApiTokenApi: 'canConfigureMobileAppSmartAlerts',
    label: t('in-stores:permissionCanConfigureMobileAppSmartAlertsLabel'),
    category: t('in-stores:permissionCanConfigureMobileAppSmartAlertsCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS,
    keyForApiTokenApi: 'canConfigureGlobalApplicationSmartAlerts',
    label: t('in-stores:permissionCanConfigureGlobalApplicationSmartAlertsLabel'),
    category: t('in-stores:permissionCanConfigureGlobalApplicationSmartAlertsCategory')
  },
  [Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS,
    keyForApiTokenApi: 'canConfigureGlobalSyntheticSmartAlerts',
    label: t('in-stores:permissionCanConfigureGlobalSyntheticSmartAlertsLabel'),
    category: t('in-stores:permissionCanConfigureGlobalSyntheticSmartAlertsCategory')
  },
  [Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS,
    keyForApiTokenApi: 'canConfigureGlobalInfraSmartAlerts',
    label: t('in-stores:permissionCanConfigureGlobalInfraSmartAlertsLabel'),
    category: t('in-stores:permissionCanConfigureGlobalInfraSmartAlertsCategory')
  },
  [Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS,
    keyForApiTokenApi: 'canConfigureGlobalLogSmartAlerts',
    label: t('in-stores:permissionCanConfigureGlobalLogSmartAlertsLabel'),
    category: t('in-stores:permissionCanConfigureGlobalLogSmartAlertsCategory')
  },
  [Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD,
    keyForApiTokenApi: 'canConfigureGlobalAlertPayload',
    label: t('in-stores:permissionCanConfigureGlobalAlertPayloadLabel'),
    category: t('in-stores:permissionCanConfigureGlobalAlertPayloadCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_INVOKE_ALERT_CHANNEL]: {
    keyForGroupApi: Capability.CAN_INVOKE_ALERT_CHANNEL,
    keyForApiTokenApi: 'canInvokeAlertChannel',
    label: t('in-stores:permissionCanInvokeAlertChannelLabel'),
    description: t('in-stores:permissionCanInvokeAlertChannelDescription'),
    category: t('in-stores:permissionCanInvokeAlertChannelCategory'),
    isOwnerPermission: false
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
    category: t('in-stores:permissionCanConfigureLogManagementCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_RELEASES]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_RELEASES,
    keyForApiTokenApi: 'canConfigureReleases',
    label: t('in-stores:permissionCanConfigureReleasesLabel'),
    category: t('in-stores:permissionCanConfigureReleasesCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT,
    keyForApiTokenApi: 'canConfigureDatabaseManagement',
    label: t('in-stores:permissionCanConfigureDatabaseManagementLabel'),
    category: t('in-stores:permissionCanConfigureDatabaseManagementCategory'),
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
    category: t('in-stores:permissionCanConfigureApiTokensCategory'),
    isOwnerPermission: true
  },
  [Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS,
    keyForApiTokenApi: '', // indicates that this is not a permission for a token
    label: t('in-stores:permissionCanConfigurePersonalApiTokensLabel'),
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
    category: t('in-stores:permissionCanViewAuditLogCategory'),
    isOwnerPermission: false
  },
  [Capability.CAN_CONFIGURE_SESSION_SETTINGS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SESSION_SETTINGS,
    keyForApiTokenApi: 'canConfigureSessionSettings',
    label: t('in-stores:permissionCanConfigureSessionSettingsLabel'),
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
  [Capability.CAN_DELETE_LOGS]: {
    keyForGroupApi: Capability.CAN_DELETE_LOGS,
    keyForApiTokenApi: 'canDeleteLogs',
    label: t('in-stores:permissionCanDeleteLogsLabel'),
    category: t('in-stores:permissionCanDeleteLogsCategory'),
    isOwnerPermission: true
  },
  [Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD,
    keyForApiTokenApi: 'canConfigureLogRetentionPeriod',
    label: t('in-stores:permissionCanConfigureLogRetentionPeriodLabel'),
    description: t('in-stores:permissionCanConfigureLogRetentionPeriodDescription'),
    category: t('in-stores:permissionCanConfigureLogRetentionPeriodCategory'),
    isOwnerPermission: true
  },
  [Capability.CAN_VIEW_LOG_VOLUME]: {
    keyForGroupApi: Capability.CAN_VIEW_LOG_VOLUME,
    keyForApiTokenApi: 'canViewLogVolume',
    label: t('in-stores:permissionCanViewLogVolume'),
    description: t('in-stores:permissionCanViewLogVolumeDescription'),
    category: t('in-stores:permissionCanViewLogVolumeCategory'),
    isOwnerPermission: true
  },
  [Capability.CAN_VIEW_TRACE_DETAILS]: {
    keyForGroupApi: Capability.CAN_VIEW_TRACE_DETAILS,
    keyForApiTokenApi: '', // indicates that this is not a permission for a token
    label: t('in-stores:permissionCanViewTraceDetailsLabel'),
    category: t('in-stores:permissionCanViewTraceDetailsCategory'),
    isOwnerPermission: false
  },
  /* Account Information */
  [Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION]: {
    keyForGroupApi: Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION,
    keyForApiTokenApi: 'canViewAccountAndBillingInformation',
    label: t('in-stores:permissionCanViewAccountAndBillingInformationLabel'),
    category: t('in-stores:permissionCanViewAccountAndBillingInformationCategory')
  },
  /* Automation */
  [Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
    keyForApiTokenApi: 'canConfigureAutomationActions',
    label: t('in-stores:permissionCanConfigureAutomationActionsLabel'),
    category: t('in-stores:permissionCanConfigureAutomationActionsCategory')
  },
  [Capability.CAN_RUN_AUTOMATION_ACTIONS]: {
    keyForGroupApi: Capability.CAN_RUN_AUTOMATION_ACTIONS,
    keyForApiTokenApi: 'canRunAutomationActions',
    label: t('in-stores:permissionCanRunAutomationActionsLabel'),
    category: t('in-stores:permissionCanRunAutomationActionsCategory')
  },
  [Capability.CAN_CONFIGURE_AUTOMATION_POLICIES]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_AUTOMATION_POLICIES,
    keyForApiTokenApi: 'canConfigureAutomationPolicies',
    label: t('in-stores:permissionCanConfigureAutomationPoliciesLabel'),
    category: t('in-stores:permissionCanConfigureAutomationPoliciesCategory')
  },
  [Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY]: {
    keyForGroupApi: Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY,
    keyForApiTokenApi: 'canDeleteAutomationActionHistory',
    label: t('in-stores:permissionCanDeleteAutomationActionHistoryLabel'),
    category: t('in-stores:permissionCanDeleteAutomationActionHistoryCategory')
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
  },
  [Capability.CAN_USE_SYNTHETIC_CREDENTIALS]: {
    keyForGroupApi: Capability.CAN_USE_SYNTHETIC_CREDENTIALS,
    keyForApiTokenApi: 'canUseSyntheticCredentials',
    label: t('in-stores:permissionCanUseSyntheticCredentialsLabel'),
    category: t('in-stores:permissionSyntheticMonitoringCategory')
  },
  [Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS]: {
    keyForGroupApi: Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS,
    keyForApiTokenApi: 'canConfigureSyntheticCredentials',
    label: t('in-stores:permissionCanConfigureSyntheticCredentialsLabel'),
    description: t('in-stores:permissionCanConfigureSyntheticCredentialsDescription'),
    category: t('in-stores:permissionSyntheticMonitoringCategory')
  },
  [Capability.CAN_CREATE_HEAP_DUMP]: {
    keyForGroupApi: Capability.CAN_CREATE_HEAP_DUMP,
    keyForApiTokenApi: '',
    label: t('in-stores:permissionCanCreateHeapDumpLabel'),
    description: t('in-stores:permissionCanCreateHeapDumpDescription'),
    category: t('in-stores:permissionInfrastructureCategory')
  },
  [Capability.CAN_CREATE_THREAD_DUMP]: {
    keyForGroupApi: Capability.CAN_CREATE_THREAD_DUMP,
    keyForApiTokenApi: '',
    label: t('in-stores:permissionCanCreateThreadDumpLabel'),
    description: t('in-stores:permissionCanCreateThreadDumpDescription'),
    category: t('in-stores:permissionInfrastructureCategory')
  },
  [Capability.CAN_MANUALLY_CLOSE_ISSUE]: {
    keyForGroupApi: Capability.CAN_MANUALLY_CLOSE_ISSUE,
    keyForApiTokenApi: 'canManuallyCloseIssue',
    label: t('in-stores:permissionCanManuallyCloseIssueLabel'),
    description: t('in-stores:permissionCanManuallyCloseIssueDescription'),
    category: t('in-stores:permissionCanManuallyCloseIssueCategory'),
    isOwnerPermission: false
  }
};

export function getProductPermissions(): Array<ProductPermission> {
  let permissions: Array<ProductPermission> = Object.values(productPermissionsObject);

  if (!syntheticsEnabled) {
    const syntheticCapabilities: Set<CapabilityType> = new Set([
      Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
      Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
      Capability.CAN_VIEW_SYNTHETIC_TESTS,
      Capability.CAN_VIEW_SYNTHETIC_LOCATIONS,
      Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS,
      Capability.CAN_USE_SYNTHETIC_CREDENTIALS,
      Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS
    ]);

    permissions = permissions.filter(({ keyForGroupApi }) => {
      return !syntheticCapabilities.has(keyForGroupApi);
    });
  }

  if (!actionAutomationEnabled) {
    const automationCapabilities: Set<CapabilityType> = new Set([
      Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
      Capability.CAN_RUN_AUTOMATION_ACTIONS,
      Capability.CAN_CONFIGURE_AUTOMATION_POLICIES,
      Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY
    ]);

    permissions = permissions.filter(({ keyForGroupApi }) => {
      return !automationCapabilities.has(keyForGroupApi);
    });
  }

  if (!infraSmartAlertsEnabled) {
    permissions = permissions.filter(({ keyForGroupApi }) => {
      return keyForGroupApi !== Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS;
    });
  }

  if (!logSmartAlertsEnabled) {
    permissions = permissions.filter(({ keyForGroupApi }) => {
      return keyForGroupApi !== Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS;
    });
  }

  if (!applicationSubtracesEnabled) {
    permissions = permissions.filter(({ keyForGroupApi }) => {
      return keyForGroupApi !== Capability.CAN_CONFIGURE_SUBTRACES;
    });
  }

  return permissions;
}
export const getInfrastructurePermissions = (): {
  readonly key: string;
  readonly label: string;
  readonly description?: string;
}[] => [
  {
    key: InfrastructureCapability.ACCESS_INFRASTRUCTURE_ANALYZE,
    label: t('in-stores:permissionAccessInfrastructureAnalyzeLabel'),
    description: t('in-stores:permissionAccessInfrastructureAnalyzeDescription')
  },
  {
    key: InfrastructureCapability.CAN_CREATE_HEAP_DUMP,
    label: t('in-stores:permissionCanCreateHeapDumpLabel'),
    description: t('in-stores:permissionCanCreateHeapDumpDescription')
  },
  {
    key: InfrastructureCapability.CAN_CREATE_THREAD_DUMP,
    label: t('in-stores:permissionCanCreateThreadDumpLabel'),
    description: t('in-stores:permissionCanCreateThreadDumpDescription')
  },
  ...(infraSmartAlertsEnabled
    ? [
        {
          key: Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS,
          label: t('in-stores:permissionCanConfigureGlobalInfraSmartAlertsLabel')
        }
      ]
    : [])
];

export const productAreaPermissions = getProductAreaPermissions();
export const productPermissions = getProductPermissions();
export const productOwnerPermissions = getProductPermissions().filter(permission => permission.isOwnerPermission);
export const productNonOwnerPermissions = getProductPermissions().filter(permission => !permission.isOwnerPermission);
export const apiTokenPermissions = getProductPermissions().filter(permission => permission.keyForApiTokenApi != '');
export const fallBackPermissions = [...LimitedAccessScopes];
