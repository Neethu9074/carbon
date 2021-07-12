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
function refresh() {
  refreshSignal.emit(true);
}

export const getPersonalApiTokensOfUserAsResultObservable = memoize(
  getPersonalApiTokensOfUserInternal,
  userId => userId,
  60000
);

function getPersonalApiTokensOfUserInternal(userId) {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/personal-api-tokens?userId=${userId}`
      })
    )
  );
}

export const getPersonalApiTokenAsResultObservable = memoize(getPersonalApiTokenInternal, id => id, 60000);

function getPersonalApiTokenInternal(id) {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/personal-api-tokens/${encodeURIComponent(id)}`
      })
    )
  );
}

export function createPersonalApiToken(personalApiToken) {
  return http({
    method: 'POST',
    headers: getCsrfHeader(),
    maxRetries: 0,
    url: `/api/settings/personal-api-tokens`,
    data: personalApiToken
  }).map(mapAndRefresh);
}

export function savePersonalApiToken(personalApiToken) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/personal-api-tokens/${encodeURIComponent(personalApiToken.tokenId)}`,
    data: personalApiToken
  }).map(mapAndRefresh);
}

export function deletePersonalApiToken(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/personal-api-tokens/${encodeURIComponent(id)}`
  }).map(mapAndRefresh);
}

function mapAndRefresh(response) {
  refresh();
  return response.body;
}
