/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

// observables

export function getConfigAsResultObservable() {
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

export function setConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: '/api/settings/authentication/googleSSO',
    headers: getCsrfHeader(),
    data: config
  });
}

export function isAvailable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/googleSSO/available'
  }).map(res => res.body);
}

export function isGoogleSSOActive() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/googleSSO/active'
  }).map(res => res.body);
}
