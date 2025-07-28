/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable, create } from '@instana/observables';
import { Result } from '@instana/types';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';
import { Role } from 'in-types';

export interface User {
  email: string;
  fullName: string;
  role: Role;
}
const refreshSignal = create<number>().emit(Date.now());

export function refreshUserInfo() {
  refreshSignal.emit(Date.now());
}

export function fetchUserInfo(): Observable<Result<User>> {
  return http<User>({
    mapToResultObject: true,
    maxRetries: 3,
    method: 'GET',
    treat400AsError: true,
    url: '/api/checkUserAccessPermitted'
  });
}

export const getUserInfo = memoize<void, Result<User>>(
  getUserInfoInternal,
  () => `${refreshSignal._lastEmittedValue}`,
  6000
);

export function getUserInfoInternal(): Observable<Result<User>> {
  return refreshSignal.flatMap(fetchUserInfo);
}

export function updateUserName(fullName: any): Observable<Result<void>> {
  return http<void>({
    method: 'PUT',
    headers: getCsrfHeader(),
    maxRetries: 3,
    url: '/api/user-settings/profile',
    data: {
      fullName
    },
    treat400AsError: true,
    mapToResultObject: true
  }).map(res => {
    refreshUserInfo();
    return res;
  });
}
