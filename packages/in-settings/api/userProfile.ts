/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { create } from '@instana/observables';
import { Result } from '@instana/types';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

export interface User {
  email: string;
  fullName: string;
}
const refreshSignal = create().emit(true);

export const getUserInfo = memoize<void, Result<User>>(getUserInfoInternal, () => '', 6000);
export function getUserInfoInternal() {
  return refreshSignal.flatMap(() => {
    return createObservable(
      http<User>({
        method: 'GET',
        maxRetries: 3,
        url: '/api/checkUserAccessPermitted'
      })
    );
  });
}

export function updateUserName(fullName: string) {
  return http<void>({
    method: 'PUT',
    headers: getCsrfHeader(),
    maxRetries: 3,
    url: '/api/user-settings/profile',
    data: {
      fullName
    }
  }).map(res => {
    if (res.status !== 204) throw new Error('failed to update');
    refreshSignal.emit(true);
  });
}
