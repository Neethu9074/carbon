/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export const getSessionSettingsAsResultObservable = memoize(
  getSessionSettingsAsResultObservableInternal,
  () => 'SessionSettings',
  60000
);
function getSessionSettingsAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/session`
      })
    )
  );
}

export function setSessionSettings(sessionSettings) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/session`,
    headers: getCsrfHeader(),
    data: sessionSettings
  }).map(response => {
    refresh();
    return response.body;
  });
}

export function deleteSessionSettings() {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/session`,
    headers: getCsrfHeader()
  }).map(response => {
    refresh();
    return response.body;
  });
}
