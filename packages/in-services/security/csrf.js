import { interval } from 'reactive-observables';
import { get, set } from 'lodash';

import { createLogger } from 'instalog';
import http from 'in-services/http';

const logger = createLogger('csrf');

let token = get(window, ['instana', 'csrf', 'token']);
// do not expose the CSRF token as a global
set(window, ['instana', 'csrf'], null);

export function getToken() {
  return token;
}

export function getHeader() {
  return {
    'X-CSRF-TOKEN': getToken()
  };
}

export function init() {
  interval(1000 * 60)
    .nextFrame()
    .flatMap(getCsrfToken)
    .merge(getCsrfToken())
    .subscribe(
      _token => (token = _token),
      error => {
        // Deliberately logged on debug level to avoid error logging of this. In production
        // we gain insights into this via Instana's website monitoring. There is no need to
        // additional log.error this (in the global unhandled error handler).
        logger.debug('Failed to retrieve CSRF token', error);
      }
    );
}

function getCsrfToken() {
  return http({
    method: 'GET',
    url: '/api/csrf/token',
    maxRetries: 5
  }).map(response => response.getHeader('X-CSRF-TOKEN'));
}
