import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getPinnedItems(settings) {
  return http({
    method: 'PUT',
    url: `/api/ui/foobar`,
    data: settings,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function savePinnedItems(value) {
  return http({
    method: 'PUT',
    url: `/api/ui/foobar`,
    data: value,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}
