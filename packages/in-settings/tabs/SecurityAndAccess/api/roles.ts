/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create, just } from '@instana/observables';
import { Result } from '@instana/types';

import { Role, roleOverview } from 'in-settings/tabs/SecurityAndAccess/api/rolesMocks';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { success } from 'in-services/util/result';
import { minutes } from 'in-services/time/time';

// const API_BASE_PATH_ROLES = '/api/settings/rbac/roles';

const refreshSignal = create<string>().emit('');

function getRolesOverviewInternal() {
  return refreshSignal.flatMap(
    () => just(success(roleOverview))
    // http<Role[]>({
    //   method: 'GET',
    //   maxRetries: 3,
    //   url: API_BASE_PATH_ROLES,
    //   mapToResultObject: true
    // })
  );
}

export const getRolesOverview = memoize<void, Result<Role[]>>(
  getRolesOverviewInternal,
  () => 'Roles',
  minutes.toMillis(1)
);
