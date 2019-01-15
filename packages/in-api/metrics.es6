import { fromJS } from 'immutable';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';

import http from 'in-services/http';

export function getInfrastructureMetrics(data) {
  return http({
    method: 'POST',
    url: `/api/infrastructure-monitoring/metrics`,
    headers: getCsrfHeader(),
    maxRetries: 3,
    data: data
  }).map(response => fromJS(response.body));
}

export function getApplicationMetrics(data) {
  return http({
    method: 'POST',
    url: `/api/application-monitoring/metrics/applications`,
    headers: getCsrfHeader(),
    maxRetries: 3,
    data: data
  }).map(response => fromJS(response.body));
}

export function getServiceMetrics(data) {
  return http({
    method: 'POST',
    url: `/api/application-monitoring/metrics/services`,
    headers: getCsrfHeader(),
    maxRetries: 3,
    data: data
  }).map(response => fromJS(response.body));
}

export function getEndpointMetrics(data) {
  return http({
    method: 'POST',
    url: `/api/application-monitoring/metrics/endpoints`,
    headers: getCsrfHeader(),
    maxRetries: 3,
    data: data
  }).map(response => fromJS(response.body));
}
