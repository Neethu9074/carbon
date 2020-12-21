import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignal = create().emit(true);

export const getUsersAsResultObservable = memoize(getUsersAsResultObservableInternal, () => '', 60000);
function getUsersAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: '/api/settings/authentication/2fa/users'
      })
    )
  );
}

export const getTwoFactorCredentials = memoize(getTwoFactorCredentialsObservableInternal, () => '', 60000);
function getTwoFactorCredentialsObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: '/api/settings/authentication/2fa/credentials'
      })
    )
  );
}

export function toggleTwoFactor() {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: '/api/settings/authentication/2fa/toggle',
    headers: getCsrfHeader()
  }).map(response => {
    refreshSignal.emit(true);
    return response.body;
  });
}

export function verifyTwoFactorToken(token) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/authentication/2fa/verify/${token}`,
    headers: getCsrfHeader()
  }).map(response => {
    refreshSignal.emit(true);
    return response.body;
  });
}
