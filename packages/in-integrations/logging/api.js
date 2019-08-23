import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function get() {
  return http({
    method: 'GET',
    url: `/api/settings/logging-integration`,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function save(configuration) {
  const id = configuration.get('id');
  return http({
    method: 'PUT',
    url: `/api/settings/logging-integration/${encodeURIComponent(id)}`,
    data: configuration,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}
