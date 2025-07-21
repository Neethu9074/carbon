/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import { $role, DEFAULT_ROLE } from 'in-stores/user';
import { deepCopy } from 'in-services/util/object';
import { Role } from 'in-types';

function updateRole(role: Role) {
  $role.emit(role);
}

export default function useCurrentUserRole(): [Role, typeof updateRole] {
  const role = useObservable(() => $role, [$role]) ?? undefined;

  if (!role) return [deepCopy(DEFAULT_ROLE), updateRole];

  return [role, updateRole];
}
