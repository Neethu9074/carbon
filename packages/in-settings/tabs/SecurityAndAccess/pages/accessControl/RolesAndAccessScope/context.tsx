/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSet } from '@instana/types';

const defaultValue = {
  permissionsSet: {
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
  }
};

interface IRolesAndAccessScopeProvider {
  permissionsSet: PermissionSet;
}

export const RolesAndAccessScopeContext = React.createContext<IRolesAndAccessScopeProvider>(defaultValue);
