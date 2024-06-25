/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable, create } from '@instana/observables';
import { DateFormatterInput } from '@instana/format-date';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { Response } from 'in-services/http/types';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
function refresh() {
  refreshSignal.emit(true);
}

/**
 * Model for a PersonalApiToken
 * @property tokenId id of token
 * @property accessGrantingToken actual token
 * @property name name of token
 * @property userId id of user associated with token
 * @property tenantUnitId of current token
 */
export interface PersonalApiToken {
  readonly tokenId: string;
  readonly accessGrantingToken: string;
  readonly name: string;
  readonly userId: string;
  readonly createdOn?: DateFormatterInput;
  readonly lastUsedOn?: DateFormatterInput;
}

export const getPersonalApiTokensOfUserAsResultObservable = memoize(
  getPersonalApiTokensOfUserInternal,
  userId => userId,
  60000
);

function getPersonalApiTokensOfUserInternal(userId: string) {
  return refreshSignal.flatMap(() =>
    createObservable(
      http<PersonalApiToken[]>({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/personal-api-tokens?userId=${userId}`
      })
    )
  );
}

export const getPersonalApiTokenAsResultObservable = memoize(getPersonalApiTokenInternal, id => id, 60000);

function getPersonalApiTokenInternal(id: string) {
  return refreshSignal.flatMap(() =>
    createObservable(
      http<PersonalApiToken[]>({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/personal-api-tokens/${encodeURIComponent(id)}`
      })
    )
  );
}

export function createPersonalApiToken(personalApiToken: PersonalApiToken): Observable<PersonalApiToken> {
  return http<PersonalApiToken>({
    method: 'POST',
    headers: getCsrfHeader(),
    maxRetries: 0,
    url: `/api/settings/personal-api-tokens`,
    data: personalApiToken
  }).map(mapAndRefresh);
}

export function savePersonalApiToken(personalApiToken: PersonalApiToken): Observable<PersonalApiToken> {
  return http<PersonalApiToken>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/personal-api-tokens/${encodeURIComponent(personalApiToken.tokenId)}`,
    data: personalApiToken
  }).map(mapAndRefresh);
}

export function deletePersonalApiToken(id: string): Observable<void> {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/personal-api-tokens/${encodeURIComponent(id)}`
  }).map(mapAndRefresh);
}

function mapAndRefresh<T>(response: Response<T>): T {
  refresh();
  return response.body;
}
