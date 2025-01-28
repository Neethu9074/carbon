/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';
import { GoogleSSOConfig, Result } from '@instana/types';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import { Response } from 'in-services/http/types';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

// observables

export function getConfigAsResultObservable(): Observable<Result<GoogleSSOConfig>> {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: '/api/settings/authentication/googleSSO'
      })
    )
  );
}

// regular calls

export function setConfig(config: GoogleSSOConfig): Observable<Response<undefined>> {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: '/api/settings/authentication/googleSSO',
    headers: getCsrfHeader(),
    data: config
  });
}

export function isAvailable(): Observable<boolean> {
  return http<boolean>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/googleSSO/available'
  }).map(res => res.body);
}

export function isGoogleSSOActive(): Observable<boolean> {
  return http<boolean>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/googleSSO/active'
  }).map(res => res.body);
}
