/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import useCurrentUserRole from 'in-stores/useCurrentUserRole';

/**
 * Enum-like object to define available permission strategies.
 * @readonly
 * @object {string}
 */
export const PERMISSION_STRATEGY = Object.freeze({
  /** @type {string} all permissions must match */
  REQUIRE_ALL: 'REQUIRE_ALL',
  /** @type {string} at least a single permission must match */
  REQUIRE_ANY: 'REQUIRE_ANY'
} as const);

export type PermissionStrategy = keyof typeof PERMISSION_STRATEGY;

interface HasPermissionProps {
  grantedPermissions: string[];
  requiredPermissions: string[];
  strategy?: PermissionStrategy;
}

/**
 * @warning This function is only used to statically check permissions and
 * should only be used in exceptional cases or outside the React context. In
 * most cases, the useHasPermission hook should be preferred to receive
 * permission updates if changes have been made to the user's role.
 */
export function hasPermission({
  grantedPermissions,
  requiredPermissions,
  strategy = PERMISSION_STRATEGY.REQUIRE_ALL
}: HasPermissionProps): boolean {
  if (strategy === PERMISSION_STRATEGY.REQUIRE_ANY) {
    return requiredPermissions.some(permission => grantedPermissions.includes(permission));
  }

  return requiredPermissions.every(permission => grantedPermissions.includes(permission));
}

/**
 * Check whether a list of permissions is (partially) present within the array
 * of granted permissions for the currently active role.
 * @param {object} props
 * @param {string[]} props.requiredPermissions list of required permissions
 * @param {string[]} [props.strategy=PERMISSION_STRATEGY.REQUIRE_ALL] strategy
 *   used to evaluate the permission
 * @returns {boolean}
 **/
export default function useHasPermission({
  requiredPermissions,
  strategy = PERMISSION_STRATEGY.REQUIRE_ALL
}: Omit<HasPermissionProps, 'grantedPermissions'>): boolean {
  const [role] = useCurrentUserRole();

  return hasPermission({ grantedPermissions: role.permissions, requiredPermissions, strategy });
}
