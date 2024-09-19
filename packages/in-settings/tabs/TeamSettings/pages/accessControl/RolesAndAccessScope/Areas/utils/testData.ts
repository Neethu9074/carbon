/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ApiApplicationScope, TagFilter } from '@instana/types';

export const mockEmptyPermissionsSet = {
  applicationIds: [],
  infraDfqFilter: {},
  kubernetesClusterUUIDs: [],
  kubernetesNamespaceUIDs: [],
  mobileAppIds: [],
  permissions: [],
  websiteIds: [],
  businessPerspectiveIds: [],
  syntheticCredentialKeys: [],
  syntheticTestIds: [],
  actionFilter: {}
};

const mockPermissionsWithLimitedAccess = [
  'LIMITED_WEBSITES_SCOPE',
  'ACCESS_APPLICATIONS',
  'ACCESS_WEBSITES',
  'ACCESS_VSPHERE',
  'CAN_VIEW_TRACE_DETAILS',
  'ACCESS_MOBILE_APPS',
  'CAN_CONFIGURE_AGENTS',
  'CAN_CONFIGURE_EUM_APPLICATIONS',
  'LIMITED_OPENSTACK_SCOPE',
  'CAN_CONFIGURE_AUTOMATION_ACTIONS',
  'ACCESS_SYNTHETICS',
  'CAN_CONFIGURE_INTEGRATIONS',
  'LIMITED_PCF_SCOPE',
  'LIMITED_SYNTHETICS_SCOPE',
  'CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS',
  'CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS',
  'CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS',
  'CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD',
  'LIMITED_INFRASTRUCTURE_SCOPE',
  'CAN_CONFIGURE_MOBILE_APP_MONITORING',
  'CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS',
  'ACCESS_INFRASTRUCTURE',
  'LIMITED_APPLICATIONS_SCOPE',
  'CAN_CONFIGURE_RELEASES',
  'LIMITED_VSPHERE_SCOPE',
  'ACCESS_KUBERNETES',
  'LIMITED_MOBILE_APPS_SCOPE',
  'CAN_CONFIGURE_EVENTS_AND_ALERTS',
  'CAN_CONFIGURE_MAINTENANCE_WINDOWS',
  'CAN_CONFIGURE_APPLICATION_SMART_ALERTS',
  'CAN_CONFIGURE_WEBSITE_SMART_ALERTS',
  'CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS',
  'CAN_CONFIGURE_AGENT_RUN_MODE',
  'LIMITED_ZHMC_SCOPE',
  'CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS',
  'LIMITED_KUBERNETES_SCOPE',
  'CAN_INSTALL_NEW_AGENTS',
  'CAN_RUN_AUTOMATION_ACTIONS',
  'CAN_CONFIGURE_AUTOMATION_POLICIES',
  'CAN_DELETE_AUTOMATION_ACTION_HISTORY',
  'CAN_CONFIGURE_TEAMS',
  'CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS',
  'CAN_CONFIGURE_LOG_MANAGEMENT',
  'CAN_CONFIGURE_DATABASE_MANAGEMENT',
  'LIMITED_PHMC_SCOPE',
  'LIMITED_POWERVC_SCOPE',
  'LIMITED_SAP_SCOPE',
  'CAN_CONFIGURE_APPLICATIONS',
  'ACCESS_AUTOMATION',
  'LIMITED_AUTOMATION_SCOPE'
];

const mockPermissionsLimitedNoAccess = [
  'CAN_VIEW_LOGS',
  'CAN_VIEW_TRACE_DETAILS',
  'LIMITED_WEBSITES_SCOPE',
  'LIMITED_APPLICATIONS_SCOPE',
  'LIMITED_VSPHERE_SCOPE',
  'LIMITED_MOBILE_APPS_SCOPE',
  'LIMITED_OPENSTACK_SCOPE',
  'LIMITED_ZHMC_SCOPE',
  'LIMITED_KUBERNETES_SCOPE',
  'LIMITED_SAP_SCOPE',
  'LIMITED_PCF_SCOPE',
  'LIMITED_SYNTHETICS_SCOPE',
  'LIMITED_PHMC_SCOPE',
  'LIMITED_POWERVC_SCOPE',
  'LIMITED_INFRASTRUCTURE_SCOPE',
  'LIMITED_AUTOMATION_SCOPE'
];

const mockPermissionsWithFullAccess = [
  'ACCESS_APPLICATIONS',
  'ACCESS_WEBSITES',
  'ACCESS_VSPHERE',
  'CAN_VIEW_TRACE_DETAILS',
  'ACCESS_MOBILE_APPS',
  'CAN_CONFIGURE_AGENTS',
  'CAN_CONFIGURE_EUM_APPLICATIONS',
  'CAN_CONFIGURE_AUTOMATION_ACTIONS',
  'ACCESS_SYNTHETICS',
  'CAN_CONFIGURE_INTEGRATIONS',
  'CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS',
  'CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS',
  'CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS',
  'CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD',
  'CAN_CONFIGURE_MOBILE_APP_MONITORING',
  'CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS',
  'ACCESS_INFRASTRUCTURE',
  'CAN_CONFIGURE_RELEASES',
  'ACCESS_KUBERNETES',
  'CAN_CONFIGURE_EVENTS_AND_ALERTS',
  'CAN_CONFIGURE_MAINTENANCE_WINDOWS',
  'CAN_CONFIGURE_APPLICATION_SMART_ALERTS',
  'CAN_CONFIGURE_WEBSITE_SMART_ALERTS',
  'CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS',
  'CAN_CONFIGURE_AGENT_RUN_MODE',
  'CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS',
  'CAN_INSTALL_NEW_AGENTS',
  'CAN_RUN_AUTOMATION_ACTIONS',
  'CAN_CONFIGURE_AUTOMATION_POLICIES',
  'CAN_DELETE_AUTOMATION_ACTION_HISTORY',
  'CAN_CONFIGURE_TEAMS',
  'CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS',
  'CAN_CONFIGURE_LOG_MANAGEMENT',
  'CAN_CONFIGURE_DATABASE_MANAGEMENT',
  'CAN_CONFIGURE_APPLICATIONS',
  'ACCESS_AUTOMATION'
];

const mockPermissionsApplicationsAccessAllViewer = [
  'CAN_VIEW_LOGS',
  'LIMITED_KUBERNETES_SCOPE',
  'ACCESS_INFRASTRUCTURE',
  'CAN_VIEW_SYNTHETIC_TESTS',
  'CAN_VIEW_SYNTHETIC_LOCATIONS',
  'CAN_VIEW_SYNTHETIC_TEST_RESULTS',
  'CAN_VIEW_TRACE_DETAILS',
  'LIMITED_INFRASTRUCTURE_SCOPE'
];
const mockPermissionsApplicationsAccessAllOwner = [
  ...mockPermissionsApplicationsAccessAllViewer,
  'CAN_CONFIGURE_APPLICATIONS'
];
const mockPermissionsApplicationsAccessAllContributor = [...mockPermissionsApplicationsAccessAllViewer];

const mockPermissionsApplicationsLimitedAccessViewer = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
const mockPermissionsApplicationsLimitedAccessOwner = [
  ...mockPermissionsApplicationsLimitedAccessViewer,
  'CAN_CONFIGURE_APPLICATIONS'
];
const mockPermissionsApplicationsLimitedAccessContributor = [...mockPermissionsApplicationsLimitedAccessViewer];

const mockApplicationContributionFilter = {
  label: 'Mock contribution filter',
  scope: 'INCLUDE_NO_DOWNSTREAM' as ApiApplicationScope,
  tagFilterExpression: {
    booleanValue: undefined,
    entity: 'DESTINATION',
    key: undefined,
    name: 'service.name',
    numberValue: undefined,
    operator: 'EQUALS',
    stringValue: 'butler',
    type: 'TAG_FILTER',
    value: 'butler'
  } as TagFilter
};

export const mockPermissionsSetWithData = {
  applicationIds: [
    { scopeId: '1', scopeRoleId: '-101' },
    { scopeId: '2', scopeRoleId: '-102' }
  ],
  infraDfqFilter: {},
  kubernetesClusterUUIDs: [
    { scopeId: '3', scopeRoleId: '-1' },
    { scopeId: '4', scopeRoleId: '-1' }
  ],
  kubernetesNamespaceUIDs: [
    { scopeId: '5', scopeRoleId: '-1' },
    { scopeId: '6', scopeRoleId: '-1' }
  ],
  mobileAppIds: [
    { scopeId: '7', scopeRoleId: '-1' },
    { scopeId: '8', scopeRoleId: '-1' }
  ],
  websiteIds: [
    { scopeId: '11', scopeRoleId: '-1' },
    { scopeId: '12', scopeRoleId: '-1' }
  ],
  syntheticTestIds: [],
  businessPerspectiveIds: [],
  permissions: mockPermissionsWithLimitedAccess,
  syntheticCredentialKeys: [],
  actionFilter: {}
};

export const mockPermissionsSetWithFullAccessData = {
  ...mockPermissionsSetWithData,
  permissions: mockPermissionsWithFullAccess
};

export const mockPermissionsSetWithLimitedAccessEmptyData = {
  ...mockEmptyPermissionsSet,
  permissions: mockPermissionsLimitedNoAccess
};

export const mockPermissionSetWithContributionFilter = {
  ...mockEmptyPermissionsSet,
  applicationIds: [
    { scopeId: '1', scopeRoleId: '-101' }, // Viewer
    { scopeId: '2', scopeRoleId: '-102' }, // Contributor
    { scopeId: '3', scopeRoleId: '-102' } // Contributor
  ],
  restrictedApplicationFilter: mockApplicationContributionFilter
};

// merged permission set owner and contributor
export const mockPermissionSetOwnerWithContributionFilter = {
  ...mockEmptyPermissionsSet,
  applicationIds: [
    { scopeId: '1', scopeRoleId: '-100' }, // Owner
    { scopeId: '2', scopeRoleId: '-102' }, // Contributor
    { scopeId: '3', scopeRoleId: '-102' } // Contributor
  ],
  restrictedApplicationFilter: mockApplicationContributionFilter
};

export const mockPermissionSetApplicationAccessAllContributor = {
  ...mockPermissionSetWithContributionFilter,
  permissions: mockPermissionsApplicationsAccessAllContributor
};

export const mockPermissionSetApplicationAccessAllOwner = {
  ...mockPermissionSetOwnerWithContributionFilter,
  permissions: mockPermissionsApplicationsAccessAllOwner
};

export const mockPermissionSetApplicationLimitedAccessContributor = {
  ...mockPermissionSetWithContributionFilter,
  permissions: mockPermissionsApplicationsLimitedAccessContributor
};

export const mockPermissionSetApplicationLimitedAccessOwner = {
  ...mockPermissionSetOwnerWithContributionFilter,
  permissions: mockPermissionsApplicationsLimitedAccessOwner
};
