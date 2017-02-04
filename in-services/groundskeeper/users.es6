import {fromJS} from 'immutable';

import http from 'in-services/http';

export function getUsers() {
  return http({
    method: 'GET',
    url: `/api/tenant/users/overview`
  })
  .map(response => fromJS(response.body));
}
