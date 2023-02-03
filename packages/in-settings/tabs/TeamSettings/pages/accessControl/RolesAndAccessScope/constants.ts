/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { PermissionSetWithRoles } from '@instana/types';

import {
  CapabilityType,
  AreaPermissionType,
  AreaPermission,
  Capability,
  LimitedAccessScopeType,
  LimitedAccessScope
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

// This is only necessary while in migration phase and should be removed after some releases
export type AreaRoleWithCustomType = AreaRoleType | 'CUSTOM';

// These are the new product areas for the new, improved RBAC UI.
export const ProductArea = Object.freeze({
  WEBSITE: 'WEBSITE',
  MOBILE_APP: 'MOBILE_APP',
  APPLICATION: 'APPLICATION',
  PLATFORM: 'PLATFORM',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  ANALYTICS: 'ANALYTICS',
  EVENT: 'EVENT',
  MIXED: 'MIXED'
} as const);
export type ProductAreaType = keyof typeof ProductArea;
export const ProductAreas = Object.freeze(Object.values(ProductArea)) as Array<ProductAreaType>;

export const PermissionAreas = Object.freeze<Array<keyof PermissionSetWithRoles>>([
  'applicationIds',
  'kubernetesClusterUUIDs',
  'kubernetesNamespaceUIDs',
  'websiteIds',
  'mobileAppIds',
  'infraDfqFilter'
]);

// These are the standard options to select source specific permission types
export const ScopedPermissionItem = Object.freeze({
  ACCESS_ALL: 'ACCESS_ALL',
  LIMITED_ACCESS: 'LIMITED_ACCESS',
  NO_ACCESS: 'NO_ACCESS'
} as const);
export type ScopedPermissionType = keyof typeof ScopedPermissionItem;
export const ScopedPermissionItems = Object.freeze(Object.values(ScopedPermissionItem)) as Array<ScopedPermissionType>;

export type LimitableProductArea = Extract<ProductAreaType, 'WEBSITE' | 'MOBILE_APP' | 'APPLICATION'>;
type LimitedScopeByProductAreaType = Record<LimitableProductArea, LimitedAccessScopeType>;
export const LimitedScopeByProductArea: LimitedScopeByProductAreaType = {
  [ProductArea.WEBSITE]: LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
  [ProductArea.MOBILE_APP]: LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
  [ProductArea.APPLICATION]: LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE
};

export function isLimitableProductArea(productArea: ProductAreaType): productArea is LimitableProductArea {
  return productArea in LimitedScopeByProductArea;
}

// Permission mapping:

// WEBSITE
const websiteAreaPermissions: Array<AreaPermissionType> = [AreaPermission.ACCESS_WEBSITES];
const websiteCapabilities: Array<CapabilityType> = [Capability.CAN_CONFIGURE_EUM_APPLICATIONS];

// MOBILE_APP
const mobileAppAreaPermissions: Array<AreaPermissionType> = [AreaPermission.ACCESS_MOBILE_APPS];
const mobileAppCapabilities: Array<CapabilityType> = [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING];

// APPLICATION
const applicationAreaPermissions: Array<AreaPermissionType> = [AreaPermission.ACCESS_APPLICATIONS];
const applicationCapabilities: Array<CapabilityType> = [Capability.CAN_CONFIGURE_APPLICATIONS];

// PLATFORM
const platformAreaPermissions: Array<AreaPermissionType> = [
  AreaPermission.ACCESS_KUBERNETES,
  AreaPermission.ACCESS_PCF,
  AreaPermission.ACCESS_PHMC,
  AreaPermission.ACCESS_VSPHERE,
  AreaPermission.ACCESS_ZHMC,
  AreaPermission.ACCESS_OPENSTACK
];
const platformCapabilities: Array<CapabilityType> = [];

// INFRASTRUCTURE
const infraAreaPermissions: Array<AreaPermissionType> = [AreaPermission.ACCESS_INFRASTRUCTURE];
const infraCapabilities: Array<CapabilityType> = [];

// ANALYTICS
const analyticsAreaPermissions: Array<AreaPermissionType> = [];
const analyticsCapabilities: Array<CapabilityType> = [Capability.CAN_VIEW_TRACE_DETAILS, Capability.CAN_VIEW_LOGS];

// EVENT
const eventAreaPermissions: Array<AreaPermissionType> = [];
const eventCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_INTEGRATIONS,
  Capability.CAN_CONFIGURE_CUSTOM_ALERTS,
  Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD,
  Capability.CAN_CONFIGURE_GLOBAL_ALERT_CONFIGS
];

// MIXED
const mixedAreaPermissions: Array<AreaPermissionType> = [];
const mixedCapabilities: Array<CapabilityType> = [
  Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS,
  Capability.CAN_CONFIGURE_RELEASES,
  Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
  Capability.CAN_CONFIGURE_SERVICE_MAPPING,
  // Custom dashboard permissions
  Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS,
  Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS,
  Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS,
  // Agent permissions
  Capability.CAN_INSTALL_NEW_AGENTS,
  Capability.CAN_CONFIGURE_AGENTS,
  Capability.CAN_CONFIGURE_AGENT_RUN_MODE,
  // User management & security permissions
  Capability.CAN_CONFIGURE_USERS,
  Capability.CAN_CONFIGURE_TEAMS,
  Capability.CAN_CONFIGURE_API_TOKENS,
  Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS,
  Capability.CAN_VIEW_AUDIT_LOG,
  Capability.CAN_CONFIGURE_SESSION_SETTINGS,
  // Account & billing permissions
  Capability.CAN_SEE_USAGE_INFORMATION,
  Capability.CAN_SEE_ON_PREM_LICENE_INFORMATION,
  Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION,
  // Automation
  Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
  Capability.CAN_RUN_AUTOMATION_ACTIONS
];

interface ProductAreaPermissions {
  areaPermissions: Array<AreaPermissionType>;
  capabilities: Array<CapabilityType>;
}
type ProductAreaPermissionStructure = Record<ProductAreaType, ProductAreaPermissions>;

// We need to distinguish between area permissions and capabilities in mapping to
// enable correct role assignment. The OWNER role owns all area permissions as
// well as all capabilities, whereas the VIEWER role owns only the area permissions.
export const ProductAreaPermissionMap: ProductAreaPermissionStructure = deepFreeze({
  [ProductArea.WEBSITE]: { areaPermissions: websiteAreaPermissions, capabilities: websiteCapabilities },
  [ProductArea.MOBILE_APP]: { areaPermissions: mobileAppAreaPermissions, capabilities: mobileAppCapabilities },
  [ProductArea.APPLICATION]: { areaPermissions: applicationAreaPermissions, capabilities: applicationCapabilities },
  [ProductArea.PLATFORM]: { areaPermissions: platformAreaPermissions, capabilities: platformCapabilities },
  [ProductArea.INFRASTRUCTURE]: { areaPermissions: infraAreaPermissions, capabilities: infraCapabilities },
  [ProductArea.ANALYTICS]: { areaPermissions: analyticsAreaPermissions, capabilities: analyticsCapabilities },
  [ProductArea.EVENT]: { areaPermissions: eventAreaPermissions, capabilities: eventCapabilities },
  [ProductArea.MIXED]: { areaPermissions: mixedAreaPermissions, capabilities: mixedCapabilities }
} as const);
