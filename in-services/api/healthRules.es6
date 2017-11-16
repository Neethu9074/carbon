import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getHealthRules() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/healthRules`
  }).map(response => fromJS(response.body));
}
