/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { PermissionSet } from '@instana/types';

import {
  AreaPermission,
  AreaPermissionType,
  Capability,
  CapabilityType,
  LimitedAccessScope,
  LimitedAccessScopeType
} from 'in-stores/permission';
import { syntheticRbacEnabled } from 'in-services/featureFlags';
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

export const AreaRoleWithContributer = Object.freeze({
  OWNER: 'OWNER',
  VIEWER: 'VIEWER',
  CONTRIBUTER: 'CONTRIBUTER'
} as const);

export const AreaRolesWithContributer = Object.freeze(Object.values(AreaRoleWithContributer));

export type AreaRoleWithContributerType = AreaRoleType | 'CONTRIBUTER';
export type AreaRolesWithContributerType = typeof AreaRolesWithContributer;

// This is only necessary while in migration phase and should be removed after some releases
export type AreaRoleWithCustomType = AreaRoleType | 'CUSTOM';

// These are the new product areas for the new, improved RBAC UI.
export const ProductArea = Object.freeze({
  WEBSITE: 'WEBSITE',
  MOBILE_APP: 'MOBILE_APP',
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
>;

export const PermissionAreas = Object.freeze<Array<keyof PermissionSet>>([
  'applicationIds',
  'kubernetesClusterUUIDs',
  'kubernetesNamespaceUIDs',
  'websiteIds',
  'mobileAppIds',
  'infraDfqFilter',
  'syntheticTestIds'
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
const applicationCapabilities: Array<CapabilityType> = [Capability.CAN_CONFIGURE_APPLICATIONS];

export const syntheticOtherCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
  Capability.CAN_USE_SYNTHETIC_CREDENTIALS,
  Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS
];

export const analyticsCapabilities: Array<CapabilityType> = [Capability.CAN_VIEW_TRACE_DETAILS];

export const eventCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_CUSTOM_ALERTS,
  Capability.CAN_CONFIGURE_INTEGRATIONS,
  Capability.CAN_CONFIGURE_GLOBAL_ALERT_CONFIGS,
  Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD
];

export const mixedCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS,
  Capability.CAN_CONFIGURE_RELEASES,
  Capability.CAN_CONFIGURE_SERVICE_MAPPING,
  Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION
];

export const logCapabilities: Array<CapabilityType> = [
  Capability.CAN_VIEW_LOGS,
  Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
  Capability.CAN_DELETE_LOGS
];

export const customDashboardCapabilities: Array<CapabilityType> = [
  Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS,
  Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS,
  Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS
];

export const syntheticMonitoringCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
  ...(syntheticRbacEnabled ? [] : [Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS]),
  ...(syntheticRbacEnabled ? [] : [Capability.CAN_VIEW_SYNTHETIC_TESTS]),
  ...(syntheticRbacEnabled ? [] : [Capability.CAN_VIEW_SYNTHETIC_LOCATIONS]),
  ...(syntheticRbacEnabled ? [] : [Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS])
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

export const automationCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
  Capability.CAN_RUN_AUTOMATION_ACTIONS,
  Capability.CAN_VIEW_AUTOMATION_ACTION_INSTANCES
];

export const unionGlobalCapabilities: Array<CapabilityType> = [
  ...mixedCapabilities,
  ...logCapabilities,
  ...customDashboardCapabilities,
  ...(syntheticRbacEnabled ? [] : [...syntheticMonitoringCapabilities]),
  ...agentsCapabilities,
  ...accessControlCapabilities,
  ...automationCapabilities
];

interface ProductAreaAccess {
  limitation?: LimitedAccessScopeType;
  permission?: AreaPermissionType;
  capabilities: Array<CapabilityType>;
}
type ProductAreaPermissionStructure = Record<ProductAreaType, ProductAreaAccess>;
const noCapabilities: Array<CapabilityType> = [];
export const ProductAreaPermissionMap: ProductAreaPermissionStructure = deepFreeze({
  [ProductArea.WEBSITE]: {
    limitation: LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
    permission: AreaPermission.ACCESS_WEBSITES,
    capabilities: websiteCapabilities
  },
  [ProductArea.MOBILE_APP]: {
    limitation: LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
    permission: AreaPermission.ACCESS_MOBILE_APPS,
    capabilities: mobileAppCapabilities
  },
  [ProductArea.APPLICATION]: {
    limitation: LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
    permission: AreaPermission.ACCESS_APPLICATIONS,
    capabilities: applicationCapabilities
  },
  [ProductArea.KUBERNETES]: {
    limitation: LimitedAccessScope.LIMITED_KUBERNETES_SCOPE,
    permission: AreaPermission.ACCESS_KUBERNETES,
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
    capabilities: noCapabilities
  },
  [ProductArea.SYNTHETICS]: {
    limitation: LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE,
    permission: AreaPermission.ACCESS_SYNTHETICS,
    capabilities: syntheticMonitoringCapabilities
  },
  [ProductArea.ANALYTICS]: { capabilities: analyticsCapabilities },
  [ProductArea.EVENT]: { capabilities: eventCapabilities },
  [ProductArea.MIXED]: { capabilities: mixedCapabilities },
  [ProductArea.LOGS]: { capabilities: logCapabilities },
  [ProductArea.DASHBOARD]: { capabilities: customDashboardCapabilities },
  [ProductArea.AGENTS]: { capabilities: agentsCapabilities },
  [ProductArea.ACCESS_CONTROL]: { capabilities: accessControlCapabilities },
  [ProductArea.AUTOMATION]: { capabilities: automationCapabilities },
  [ProductArea.GLOBAL]: { capabilities: unionGlobalCapabilities }
} as const);
