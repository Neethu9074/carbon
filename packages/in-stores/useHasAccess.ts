/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { PermissionTuple } from 'in-stores/permission';

interface UseHasAccessProps {
  optionalPrecondition?: boolean;
  requiredPermissions: PermissionTuple;
}

interface HasAccessProps extends UseHasAccessProps {
  grantedPermissions: string[];
}

/**
 * @warning This function is only used to statically check permissions and
 * should only be used in exceptional cases or outside the React context. In
 * most cases, the useHasAccess hook should be preferred to receive permission
 * updates if changes have been made to the user's role.
 */
export function hasAccess({
  grantedPermissions,
  optionalPrecondition,
  requiredPermissions: [limitedScope, accessPermission]
}: HasAccessProps): boolean {
  const hasPrecondition = optionalPrecondition !== undefined;
  const isGrantedByPrecondition = !hasPrecondition || optionalPrecondition;

  if (!isGrantedByPrecondition) return false;

  if (!grantedPermissions.includes(limitedScope)) return true;

  return grantedPermissions.includes(accessPermission);
}

/**
 * Check whether a access is granted for the currently active role based on the
 * limited-scope and permissions that are specified by a permission-tuple.
 * @param {object} props
 * @param {boolean} [props.optionalPrecondition] useful if a permission is
 *   dependent on other conditions such as an feature-flag
 * @param {string[]} props.requiredPermissions tuple of limited-scope and
 *   access-permission
 * @returns {boolean}
 **/
export default function useHasAccess({ optionalPrecondition, requiredPermissions }: UseHasAccessProps): boolean {
  const [role] = useCurrentUserRole();

  return hasAccess({
    grantedPermissions: role.permissions,
    optionalPrecondition,
    requiredPermissions
  });
}
