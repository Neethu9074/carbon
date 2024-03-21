/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSet } from '@instana/types';

import { AreaPermissionType, CapabilityType } from 'in-stores/permission';

interface IFilterPermissionSet {
  permissionsSet: PermissionSet;
  capabilities: CapabilityType[];
}

interface IFilterPermissionSetByArea {
  permissionsSet: PermissionSet;
  areaPermissions: AreaPermissionType[];
}

export const filterPermissionSet = ({ permissionsSet, capabilities }: IFilterPermissionSet) =>
  capabilities.filter(capability => permissionsSet.permissions.includes(capability));

export const filterPermissionSetByArea = ({ permissionsSet, areaPermissions }: IFilterPermissionSetByArea) =>
  areaPermissions.filter(areaPermission => permissionsSet.permissions.includes(areaPermission));
