/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import { DEFAULT_ROLE } from 'in-stores/constants';
import { deepCopy } from 'in-services/util/object';
import { role$ } from 'in-stores/user';
import { Role } from 'in-types';

function updateRole(role: Role) {
  const newRole = deepCopy({ ...role, wasUpdatedAtRuntime: true });
  role$.emit(newRole);
}

/**
 * Retruns a state-like tuple with the currently active user-role and a setter
 * to update the user's role at runtime.
 * Attention: Updating the users role should only be done in certain cases e.g.
 * when changing the team focus.
 * @returns {[Role, Function]} A state-like tuple that contains the user's
 *   active role and an update function that is used to change the active Role
 *   of a user.
 **/
export default function useCurrentUserRole(): [Role, typeof updateRole] {
  const role = useObservable(() => role$, [role$]) ?? undefined;

  if (!role) return [deepCopy(DEFAULT_ROLE), updateRole];

  const roleCopy = deepCopy(role);

  // In some test scenarios, the permissions array may not yet be defined at
  // the time of execution. However, the types say that an array must always be
  // present. For this reason, we ensure that the permissions property is at
  // least an empty array in the case of an undefined property.
  if (!Array.isArray(roleCopy.permissions)) {
    roleCopy.permissions = [];
  }

  return [roleCopy, updateRole];
}
