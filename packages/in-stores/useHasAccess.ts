/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { PermissionTuple } from 'in-stores/permission';

interface UseHasAccessProps {
  optionalFeatureFlag?: boolean;
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
  optionalFeatureFlag,
  requiredPermissions: [limitedScope, accessPermission]
}: HasAccessProps): boolean {
  const isFeatureFlagged = optionalFeatureFlag !== undefined;
  const isGrantedByFeatureFlag = !isFeatureFlagged || optionalFeatureFlag;

  if (!isGrantedByFeatureFlag) return false;

  if (!grantedPermissions.includes(limitedScope)) return true;

  return grantedPermissions.includes(accessPermission);
}

/**
 * Check whether a access is granted for the currently active role based on the
 * limited-scope and permissions that are specified by a permission-tuple.
 * @param {object} props
 * @param {boolean} [props.optionalFeatureFlag] in case the permissions needs
 *   to be feature-flag sensitive
 * @param {string[]} props.requiredPermissions tuple of limited-scope and
 *   access-permission
 * @returns {boolean}
 **/
export default function useHasAccess({ optionalFeatureFlag, requiredPermissions }: UseHasAccessProps): boolean {
  const [role] = useCurrentUserRole();

  return hasAccess({
    grantedPermissions: role.permissions,
    optionalFeatureFlag,
    requiredPermissions
  });
}
