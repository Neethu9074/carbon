import { interval } from 'reactive-observables';
import { get, set } from 'lodash';

import http from 'in-services/http';

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
    .flatMap(() =>
      http({
        method: 'GET',
        url: '/api/csrf/token',
        maxRetries: 5
      })
    )
    .map(response => response.getHeader('X-CSRF-TOKEN'))
    .subscribe(_token => (token = _token));
}
