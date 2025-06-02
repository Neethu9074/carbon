/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { PermissionSet } from '@instana/types';

export function createEmptyPermissionSet(): PermissionSet {
  return {
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
}

export function getInitValue<INIT_VALUES, FIELD_NAME extends keyof INIT_VALUES>(
  initValues: INIT_VALUES | undefined,
  fieldName: FIELD_NAME,
  defaultValue: INIT_VALUES[FIELD_NAME]
): INIT_VALUES[FIELD_NAME] {
  return initValues?.[fieldName] ?? defaultValue;
}
