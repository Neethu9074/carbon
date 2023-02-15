/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSetWithRoles } from '@instana/types';

import { CapabilityType } from 'in-stores/permission';

interface IFilterPermissionSet {
  permissionsSet: PermissionSetWithRoles;
  capabilities: CapabilityType[];
}

export const filterPermissionSet = ({ permissionsSet, capabilities }: IFilterPermissionSet) =>
  permissionsSet.permissions.filter(permission => capabilities.includes(permission as CapabilityType));
