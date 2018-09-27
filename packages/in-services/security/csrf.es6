import { get } from 'lodash';

export const token = get(window, ['instana', 'csrf', 'token']);
export const header = {
  'X-CSRF-TOKEN': token
};
