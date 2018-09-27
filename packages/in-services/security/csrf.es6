import { get } from 'lodash';

export function getToken() {
  return get(window, ['instana', 'csrf', 'token']);
}

export function getHeader() {
  return {
    'X-CSRF-TOKEN': getToken()
  };
}
