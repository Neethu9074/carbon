/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { PERMISSION_STRATEGY, PermissionStrategy } from 'in-stores/useHasPermission';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { PermissionTuple } from 'in-stores/permission';
import { hasAccess } from 'in-stores/useHasAccess';

type HasPermissionProps = Parameters<typeof hasAccess>[0];

interface HasAccessesProps extends Omit<HasPermissionProps, 'requiredPermissions'> {
  requiredPermissions: PermissionTuple[];
  strategy: PermissionStrategy;
}

/**
 * @warning This function is only used to statically check permissions and
 * should only be used in exceptional cases or outside the React context. In
 * most cases, the useHasAccesses hook should be preferred to receive permission
 * updates if changes have been made to the user's role.
 */
export function hasAccesses({
  grantedPermissions,
  optionalFeatureFlag,
  requiredPermissions,
  strategy
}: HasAccessesProps): boolean {
  if (strategy === PERMISSION_STRATEGY.REQUIRE_ANY) {
    return requiredPermissions.some(permissions =>
      hasAccess({ requiredPermissions: permissions, optionalFeatureFlag, grantedPermissions })
    );
  }

  return requiredPermissions.every(permissions =>
    hasAccess({ requiredPermissions: permissions, optionalFeatureFlag, grantedPermissions })
  );
}

interface UseHasAccessesProps extends Omit<HasAccessesProps, 'grantedPermissions'> {}

/**
 * Check whether a access is granted for the currently active role based on a
 * list of limited-scopes and access-permissions, whom which are specified by
 * an array of permission-tuples.
 * @param {object} props
 * @param {boolean} [props.optionalFeatureFlag] in case the permissions needs
 *   to be feature-flag sensitive
 * @param {string[]} props.requiredPermissions tuple of limited-scope and
 *   access-permission
 * @param {string[]} [props.strategy=PERMISSION_STRATEGY.REQUIRE_ALL] strategy
 *   used to evaluate the permission
 * @returns {boolean}
 **/
export default function useHasAccesses({
  optionalFeatureFlag,
  requiredPermissions,
  strategy = PERMISSION_STRATEGY.REQUIRE_ALL
}: UseHasAccessesProps): boolean {
  const [role] = useCurrentUserRole();

  return hasAccesses({
    grantedPermissions: role.permissions,
    optionalFeatureFlag,
    requiredPermissions,
    strategy
  });
}
