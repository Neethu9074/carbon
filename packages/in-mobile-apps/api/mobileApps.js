import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getMobileApps() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config`
  }).map(response => {
    const keys = response.body || [];
    keys.sort((a, b) => a.appName.localeCompare(b.appName));
    return keys;
  });
}

export function removeMobileApp(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function addMobileApp(name) {
  return http({
    method: 'POST',
    url: `/api/mobile-app-monitoring/config`,
    headers: getCsrfHeader(),
    queryParams: {
      name
    }
  }).map(response => response.body);
}

export function renameMobileApp(id, name) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    queryParams: {
      name
    }
  }).map(response => response);
}
