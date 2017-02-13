import {fromJS} from 'immutable';

import http from 'in-services/http';

export function getApiTokens() {
  return http({
    method: 'GET',
    url: `/api/apiTokens`
  })
  .map(response => fromJS(response.body));
}


export function getApiToken(apiTokenId) {
  return http({
    method: 'GET',
    url: `/api/apiTokens/${encodeURIComponent(apiTokenId)}`
  })
  .map(response => fromJS(response.body));
}


export function saveApiToken(apiToken) {
  return http({
    method: 'PUT',
    url: `/api/apiTokens/${encodeURIComponent(apiToken.get('id'))}`,
    data: apiToken.toJS()
  });
}


export function deleteApiToken(apiTokenId) {
  return http({
    method: 'DELETE',
    url: `/api/apiTokens/${encodeURIComponent(apiTokenId)}`
  });
}
