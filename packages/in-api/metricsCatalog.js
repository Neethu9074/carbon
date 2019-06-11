import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getRules() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/rules`
  }).map(response => fromJS(response.body));
}

export function getBuiltIn(type) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/metricsCatalog/builtIn`,
    queryParams: {
      entityType: type
    }
  }).map(response => fromJS(response.body));
}

export function getCustom() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/metricsCatalog/custom`
  }).map(response => fromJS(response.body));
}
