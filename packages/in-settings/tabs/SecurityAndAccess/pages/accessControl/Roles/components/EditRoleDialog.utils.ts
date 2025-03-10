/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/roleForm';

export function combinePermissions(
  currentPermissions: Array<ProductAreaPermissionUnion>,
  newPermissions: Array<ProductAreaPermissionUnion>
): Array<ProductAreaPermissionUnion> {
  // Filter permissions to avoid redundancies
  const otherPermissions = currentPermissions.filter(permission => !newPermissions.includes(permission));
  return [...otherPermissions, ...newPermissions];
}

export function filterPermissions(
  currentPermissions: Array<ProductAreaPermissionUnion>,
  permissionsToBeRemoved: Array<ProductAreaPermissionUnion>
): Array<ProductAreaPermissionUnion> {
  return currentPermissions.filter(permission => !permissionsToBeRemoved.includes(permission));
}

export function containsSomePermissions(
  currentPermissions: Array<ProductAreaPermissionUnion>,
  expectedPermissions: Array<ProductAreaPermissionUnion>
): boolean {
  return expectedPermissions.some(permission => currentPermissions.includes(permission));
}

export function containsAllPermissions(
  currentPermissions: Array<ProductAreaPermissionUnion>,
  expectedPermissions: Array<ProductAreaPermissionUnion>
): boolean {
  return expectedPermissions.every(permission => currentPermissions.includes(permission));
}

/**
 * Given permissions will be added to or removed from the permissions array
 **/
export function modifyPermissions(
  currentPermissions: Array<ProductAreaPermissionUnion>,
  permissionsToBeAdded: Array<ProductAreaPermissionUnion> = [],
  permissionsToBeRemoved: Array<ProductAreaPermissionUnion> = []
): Array<ProductAreaPermissionUnion> {
  let updatedPermissions = [...currentPermissions];

  if (permissionsToBeRemoved.length) updatedPermissions = filterPermissions(updatedPermissions, permissionsToBeRemoved);
  if (permissionsToBeAdded.length) updatedPermissions = combinePermissions(updatedPermissions, permissionsToBeAdded);

  return updatedPermissions;
}

interface TogglePermissions {
  currentPermissions: Array<ProductAreaPermissionUnion>;
  permissionsToAddOnEnabled: Array<ProductAreaPermissionUnion>;
  permissionsToRemoveOnDisabled: Array<ProductAreaPermissionUnion>;
  enabled?: boolean;
}

/**
 * In order to easily set permissions depending on checkbox states this function
 * can be utilize to add or remove given permissions on the permissions array
 **/
export function togglePermissions({
  currentPermissions,
  permissionsToAddOnEnabled,
  permissionsToRemoveOnDisabled,
  enabled
}: TogglePermissions): Array<ProductAreaPermissionUnion> {
  const permissionsToBeAdded = enabled ? permissionsToAddOnEnabled : [];
  const permissionsToBeRemoved = !enabled ? permissionsToRemoveOnDisabled : [];
  return modifyPermissions(currentPermissions, permissionsToBeAdded, permissionsToBeRemoved);
}
