/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get, set } from 'lodash';

import { create, interval, Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';

import { minutes } from 'in-services/time';
import http from 'in-services/http';

const logger = createLogger('csrf');

let token: string = get(window, ['instana', 'csrf', 'token']);
// do not expose the CSRF token as a global
set(window, ['instana', 'csrf'], null);

export const token$ = create<string>();
token$.emit(token);

export function getHeader() {
  return {
    'X-CSRF-TOKEN': token
  };
}

export function init() {
  interval(minutes.toMillis(1))
    .nextFrame()
    .flatMap(() => getCsrfToken())
    .merge(getCsrfToken())
    .subscribe(
      _token => {
        token = _token;
        token$.emit(token);
      },
      error => {
        // Deliberately logged on debug level to avoid error logging of this. In production
        // we gain insights into this via Instana's website monitoring. There is no need to
        // additional log.error this (in the global unhandled error handler).
        logger.debug('Failed to retrieve CSRF token', error);
      }
    );
}

function getCsrfToken(): Observable<string> {
  return http({
    method: 'GET',
    url: '/csrf/token',
    maxRetries: 5
  }).map(response => response.getHeader('X-CSRF-TOKEN') as string);
}
