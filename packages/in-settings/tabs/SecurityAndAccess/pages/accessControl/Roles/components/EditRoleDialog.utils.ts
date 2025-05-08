/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';

export function combinePermissions(
  current: Array<ProductAreaPermissionUnion>,
  newPermissions: Array<ProductAreaPermissionUnion>
): Array<ProductAreaPermissionUnion> {
  // Filter permissions to avoid redundancies
  const otherPermissions = current.filter(permission => !newPermissions.includes(permission));
  return [...otherPermissions, ...newPermissions];
}

export function filterPermissions(
  current: Array<ProductAreaPermissionUnion>,
  toBeRemoved: Array<ProductAreaPermissionUnion>
): Array<ProductAreaPermissionUnion> {
  return current.filter(permission => !toBeRemoved.includes(permission));
}

export function containsAnyPermission(
  current: Array<ProductAreaPermissionUnion>,
  expected: Array<ProductAreaPermissionUnion>
): boolean {
  return expected.some(permission => current.includes(permission));
}

export function containsAllPermissions(
  current: Array<ProductAreaPermissionUnion>,
  expected: Array<ProductAreaPermissionUnion>
): boolean {
  return expected.every(permission => current.includes(permission));
}

/**
 * Given permissions will be added to or removed from the permissions array
 **/
export function modifyPermissions(
  current: Array<ProductAreaPermissionUnion>,
  toBeAdded: Array<ProductAreaPermissionUnion> = [],
  toBeRemoved: Array<ProductAreaPermissionUnion> = []
): Array<ProductAreaPermissionUnion> {
  let updatedPermissions = [...current];

  if (toBeRemoved.length) updatedPermissions = filterPermissions(updatedPermissions, toBeRemoved);
  if (toBeAdded.length) updatedPermissions = combinePermissions(updatedPermissions, toBeAdded);

  return updatedPermissions;
}

interface TogglePermissions {
  current: Array<ProductAreaPermissionUnion>;
  enabled?: boolean;
  toAddOnDisabled?: Array<ProductAreaPermissionUnion>;
  toAddOnEnabled?: Array<ProductAreaPermissionUnion>;
  toRemoveOnDisabled?: Array<ProductAreaPermissionUnion>;
  toRemoveOnEnabled?: Array<ProductAreaPermissionUnion>;
}

/**
 * In order to easily set permissions depending on checkbox states this function
 * can be utilize to add or remove given permissions on the permissions array
 **/
export function togglePermissions({
  current,
  enabled,
  toAddOnDisabled = [],
  toAddOnEnabled = [],
  toRemoveOnDisabled = [],
  toRemoveOnEnabled = []
}: TogglePermissions): Array<ProductAreaPermissionUnion> {
  const toBeAdded = enabled ? toAddOnEnabled : toAddOnDisabled;
  const toBeRemoved = enabled ? toRemoveOnEnabled : toRemoveOnDisabled;
  return modifyPermissions(current, toBeAdded, toBeRemoved);
}
