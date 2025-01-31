/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { PermissionSet } from '@instana/types';

import {
  applicationSubtracesEnabled,
  infraSmartAlertsEnabled,
  logRetentionPageEnabled,
  logSmartAlertsEnabled,
  logVolumePageEnabled,
  syntheticsEnabled
} from 'in-services/featureFlags';
import {
  AreaPermission,
  AreaPermissionType,
  Capability,
  CapabilityType,
  LimitedAccessScope,
  LimitedAccessScopeType,
  PermissionsUnion
} from 'in-stores/permission';
import { deepFreeze } from 'in-services/util/object';

// The area roles (not to be confused with the normal groups) are used
// to simplify the permission settings by mapping them.
// See ProductAreaPermissionMap below.
export const AreaRole = Object.freeze({
  OWNER: 'OWNER',
  VIEWER: 'VIEWER'
} as const);

export type AreaRoleType = keyof typeof AreaRole;
export const AreaRoles = Object.freeze(Object.values(AreaRole));
export type AreaRoleOptionsType = typeof AreaRoles;

export type AreaRolesType = keyof typeof AreaRoles;

export const AreaRoleWithContributor = Object.freeze({
  OWNER: 'OWNER',
  CONTRIBUTOR: 'CONTRIBUTOR',
  VIEWER: 'VIEWER'
} as const);

export const ScopeRoles = Object.freeze({
  Owner: '-100',
  Viewer: '-101',
  Contributor: '-102'
});

export const AreaRolesWithContributor = Object.freeze(Object.values(AreaRoleWithContributor));

export type AreaRoleWithContributorType = keyof typeof AreaRoleWithContributor;
export type AreaRolesWithContributorOptionsType = typeof AreaRolesWithContributor;
export type AreaRolesWithContributorType = keyof typeof AreaRolesWithContributor;

// This is only necessary while in migration phase and should be removed after some releases
export type AreaRoleWithCustomType = AreaRoleWithContributorType | 'CUSTOM';

// These are the new product areas for the new, improved RBAC UI.
export const ProductArea = Object.freeze({
  WEBSITE: 'WEBSITE',
  MOBILE_APP: 'MOBILE_APP',
  BIZOPS: 'BIZOPS',
  APPLICATION: 'APPLICATION',
  KUBERNETES: 'KUBERNETES',
  VSPHERE: 'VSPHERE',
  PHMC: 'PHMC',
  ZHMC: 'ZHMC',
  PCF: 'PCF',
  OPENSTACK: 'OPENSTACK',
  POWERVC: 'POWERVC',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  SAP: 'SAP',
  NUTANIX: 'NUTANIX',
  ANALYTICS: 'ANALYTICS',
  EVENT: 'EVENT',
  DASHBOARD: 'DASHBOARD',
  SYNTHETICS: 'SYNTHETICS',
  AGENTS: 'AGENTS',
  ACCESS_CONTROL: 'ACCESS_CONTROL',
  AUTOMATION: 'AUTOMATION',
  LOGS: 'LOGS',
  MIXED: 'MIXED',
  GLOBAL: 'GLOBAL'
} as const);
export type ProductAreaType = keyof typeof ProductArea;
export const ProductAreas = Object.freeze(Object.values(ProductArea)) as Array<ProductAreaType>;

export type LimitableProductArea = Extract<
  ProductAreaType,
  | 'WEBSITE'
  | 'MOBILE_APP'
  | 'BIZOPS'
  | 'APPLICATION'
  | 'INFRASTRUCTURE'
  | 'KUBERNETES'
  | 'VSPHERE'
  | 'PHMC'
  | 'POWERVC'
  | 'ZHMC'
  | 'PCF'
  | 'OPENSTACK'
  | 'SYNTHETICS'
  | 'SAP'
  | 'AUTOMATION'
  | 'NUTANIX'
>;

export const PermissionAreas = Object.freeze<Array<keyof PermissionSet>>([
  'applicationIds',
  'kubernetesClusterUUIDs',
  'kubernetesNamespaceUIDs',
  'websiteIds',
  'mobileAppIds',
  'infraDfqFilter',
  'syntheticTestIds',
  'actionFilter'
]);

// These are the standard options to select source specific permission types
export const ScopedPermissionItem = Object.freeze({
  ACCESS_ALL: 'ACCESS_ALL',
  LIMITED_ACCESS: 'LIMITED_ACCESS',
  NO_ACCESS: 'NO_ACCESS'
} as const);
export type ScopedPermissionType = keyof typeof ScopedPermissionItem;
export const ScopedPermissionItems = Object.freeze(Object.values(ScopedPermissionItem)) as Array<ScopedPermissionType>;

// Permission mapping:

const websiteCapabilities: Array<CapabilityType> = [Capability.CAN_CONFIGURE_EUM_APPLICATIONS];
const mobileAppCapabilities: Array<CapabilityType> = [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING];
export const bizopsCapabilities: Array<CapabilityType> = [];
export const applicationCapabilities: Array<CapabilityType> = [Capability.CAN_CONFIGURE_APPLICATIONS];
export const subtraceCapabilities: Array<CapabilityType> = applicationSubtracesEnabled
  ? [Capability.CAN_CONFIGURE_SUBTRACES]
  : [];

export const applicationAlertCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS,
  Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
];
export const applicationAdditionalCapabilities: Array<CapabilityType> = [
  Capability.CAN_VIEW_TRACE_DETAILS,
  Capability.CAN_CONFIGURE_SERVICE_MAPPING,
  ...subtraceCapabilities,
  ...applicationAlertCapabilities
];

export const syntheticViewCapabilities: Array<CapabilityType> = [
  Capability.CAN_VIEW_SYNTHETIC_TESTS,
  Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS,
  Capability.CAN_VIEW_SYNTHETIC_LOCATIONS
];

export const syntheticAdditionalOwnerCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
  Capability.CAN_USE_SYNTHETIC_CREDENTIALS,
  Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS,
  Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS
];

//Need to remove default and additional Synthetic view permissions when access scope is NO_ACCESS
export const syntheticAdditionalDefaultCapabilities: Array<CapabilityType> = [
  ...syntheticViewCapabilities,
  ...syntheticAdditionalOwnerCapabilities
];

export const infrastructureDefaultCapabilities: Array<CapabilityType> = [
  Capability.CAN_CREATE_HEAP_DUMP,
  Capability.CAN_CREATE_THREAD_DUMP
];

export const infrastructureOtherCapabilities: Array<CapabilityType> = [
  ...[AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE as CapabilityType],
  ...(infraSmartAlertsEnabled ? [Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS] : [])
];

export const infrastructureAdditionalCapabilities: Array<CapabilityType> = [
  ...infrastructureOtherCapabilities,
  ...infrastructureDefaultCapabilities
];

export const analyticsCapabilities: Array<CapabilityType> = [Capability.CAN_VIEW_TRACE_DETAILS];

export const eventAndAlertCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS,
  Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS,
  Capability.CAN_CONFIGURE_INTEGRATIONS,
  Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD,
  Capability.CAN_MANUALLY_CLOSE_ISSUE,
  Capability.CAN_INVOKE_ALERT_CHANNEL
];

export const mixedCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS,
  Capability.CAN_CONFIGURE_RELEASES,
  Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION,
  Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT
];

export const logCapabilities: Array<CapabilityType> = [
  Capability.CAN_VIEW_LOGS,
  Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
  Capability.CAN_DELETE_LOGS,
  ...(logSmartAlertsEnabled ? [Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS] : []),
  ...(logVolumePageEnabled ? [Capability.CAN_VIEW_LOG_VOLUME] : []),
  ...(logRetentionPageEnabled ? [Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD] : [])
];

export const customDashboardCapabilities: Array<CapabilityType> = [
  Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS,
  Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS,
  Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS
];

export const syntheticMonitoringCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
  ...(syntheticsEnabled ? [] : [Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS]),
  ...(syntheticsEnabled ? [] : [Capability.CAN_VIEW_SYNTHETIC_TESTS]),
  ...(syntheticsEnabled ? [] : [Capability.CAN_VIEW_SYNTHETIC_LOCATIONS]),
  ...(syntheticsEnabled ? [] : [Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS])
];

export const agentsCapabilities: Array<CapabilityType> = [
  Capability.CAN_INSTALL_NEW_AGENTS,
  Capability.CAN_CONFIGURE_AGENTS,
  Capability.CAN_CONFIGURE_AGENT_RUN_MODE
];

export const accessControlCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_USERS,
  Capability.CAN_CONFIGURE_TEAMS,
  Capability.CAN_CONFIGURE_API_TOKENS,
  Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS,
  Capability.CAN_VIEW_AUDIT_LOG,
  Capability.CAN_CONFIGURE_SESSION_SETTINGS
];

export const automationCapabilities: Array<CapabilityType> = [Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS];

export const automationViewCapabilities: Array<CapabilityType> = [Capability.CAN_RUN_AUTOMATION_ACTIONS];

export const automationOwnerCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_AUTOMATION_POLICIES,
  Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY
];

export const automationAdditionalCapabilities: Array<CapabilityType> = [
  ...automationViewCapabilities,
  ...automationOwnerCapabilities
];

export const syntheticCredentialCapabilities: Array<CapabilityType> = [
  Capability.CAN_USE_SYNTHETIC_CREDENTIALS,
  Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS
];

export const unionGlobalCapabilities: Array<CapabilityType> = [
  ...mixedCapabilities,
  ...eventAndAlertCapabilities,
  ...logCapabilities,
  ...customDashboardCapabilities,
  ...automationCapabilities,
  ...agentsCapabilities,
  ...accessControlCapabilities
];

interface ProductAreaAccess {
  limitation?: LimitedAccessScopeType;
  permission?: AreaPermissionType;
  capabilities: Array<CapabilityType>;
  additionalCapabilities?: PermissionsUnion[];
}

type ProductAreaPermissionStructure = Record<ProductAreaType, ProductAreaAccess>;
const noCapabilities: Array<CapabilityType> = [];
export const ProductAreaPermissionMap: ProductAreaPermissionStructure = deepFreeze({
  [ProductArea.WEBSITE]: {
    limitation: LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
    permission: AreaPermission.ACCESS_WEBSITES,
    capabilities: websiteCapabilities,
    additionalCapabilities: [Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS] as Array<CapabilityType>
  },
  [ProductArea.MOBILE_APP]: {
    limitation: LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
    permission: AreaPermission.ACCESS_MOBILE_APPS,
    capabilities: mobileAppCapabilities,
    additionalCapabilities: [Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS] as Array<CapabilityType>
  },
  [ProductArea.BIZOPS]: {
    capabilities: bizopsCapabilities,
    permission: AreaPermission.ACCESS_BIZOPS,
    limitation: LimitedAccessScope.LIMITED_BIZOPS_SCOPE
  },
  [ProductArea.APPLICATION]: {
    limitation: LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
    permission: AreaPermission.ACCESS_APPLICATIONS,
    capabilities: applicationCapabilities,
    additionalCapabilities: applicationAdditionalCapabilities
  },
  [ProductArea.KUBERNETES]: {
    limitation: LimitedAccessScope.LIMITED_KUBERNETES_SCOPE,
    permission: AreaPermission.ACCESS_KUBERNETES,
    capabilities: noCapabilities
  },
  [ProductArea.NUTANIX]: {
    limitation: LimitedAccessScope.LIMITED_NUTANIX_SCOPE,
    permission: AreaPermission.ACCESS_NUTANIX,
    capabilities: noCapabilities
  },
  [ProductArea.VSPHERE]: {
    limitation: LimitedAccessScope.LIMITED_VSPHERE_SCOPE,
    permission: AreaPermission.ACCESS_VSPHERE,
    capabilities: noCapabilities
  },
  [ProductArea.PHMC]: {
    limitation: LimitedAccessScope.LIMITED_PHMC_SCOPE,
    permission: AreaPermission.ACCESS_PHMC,
    capabilities: noCapabilities
  },
  [ProductArea.POWERVC]: {
    limitation: LimitedAccessScope.LIMITED_POWERVC_SCOPE,
    permission: AreaPermission.ACCESS_POWERVC,
    capabilities: noCapabilities
  },
  [ProductArea.ZHMC]: {
    limitation: LimitedAccessScope.LIMITED_ZHMC_SCOPE,
    permission: AreaPermission.ACCESS_ZHMC,
    capabilities: noCapabilities
  },
  [ProductArea.PCF]: {
    limitation: LimitedAccessScope.LIMITED_PCF_SCOPE,
    permission: AreaPermission.ACCESS_PCF,
    capabilities: noCapabilities
  },
  [ProductArea.OPENSTACK]: {
    limitation: LimitedAccessScope.LIMITED_OPENSTACK_SCOPE,
    permission: AreaPermission.ACCESS_OPENSTACK,
    capabilities: noCapabilities
  },
  [ProductArea.SAP]: {
    limitation: LimitedAccessScope.LIMITED_SAP_SCOPE,
    permission: AreaPermission.ACCESS_SAP,
    capabilities: noCapabilities
  },
  [ProductArea.INFRASTRUCTURE]: {
    limitation: LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
    permission: AreaPermission.ACCESS_INFRASTRUCTURE,
    capabilities: noCapabilities,
    additionalCapabilities: infrastructureAdditionalCapabilities
  },
  [ProductArea.SYNTHETICS]: {
    limitation: LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE,
    permission: AreaPermission.ACCESS_SYNTHETICS,
    capabilities: syntheticMonitoringCapabilities,
    additionalCapabilities: syntheticAdditionalDefaultCapabilities
  },
  [ProductArea.ANALYTICS]: { capabilities: analyticsCapabilities },
  [ProductArea.EVENT]: { capabilities: eventAndAlertCapabilities },
  [ProductArea.MIXED]: { capabilities: mixedCapabilities },
  [ProductArea.LOGS]: { capabilities: logCapabilities },
  [ProductArea.DASHBOARD]: { capabilities: customDashboardCapabilities },
  [ProductArea.AGENTS]: { capabilities: agentsCapabilities },
  [ProductArea.ACCESS_CONTROL]: { capabilities: accessControlCapabilities },
  [ProductArea.AUTOMATION]: {
    limitation: LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
    permission: AreaPermission.ACCESS_AUTOMATION,
    capabilities: automationCapabilities,
    additionalCapabilities: automationAdditionalCapabilities
  },
  [ProductArea.GLOBAL]: { capabilities: unionGlobalCapabilities }
} as const);
