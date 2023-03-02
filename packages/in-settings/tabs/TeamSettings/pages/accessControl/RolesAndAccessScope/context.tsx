/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles } from '@instana/types';

const defaultValue = {
  permissionsSet: {
    applicationIds: [],
    kubernetesClusterUUIDs: [],
    kubernetesNamespaceUIDs: [],
    mobileAppIds: [],
    permissions: [],
    websiteIds: []
  }
};

interface IRolesAndAccessScopeProvider {
  permissionsSet: PermissionSetWithRoles;
}

export const RolesAndAccessScopeContext = React.createContext<IRolesAndAccessScopeProvider>(defaultValue);
