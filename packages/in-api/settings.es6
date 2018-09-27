import { header as csrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function saveSettings(settings) {
  return http({
    method: 'PUT',
    url: `/api/ui/settings`,
    data: settings,
    maxRetries: 3,
    headers: csrfHeader
  }).map(response => response.body);
}
