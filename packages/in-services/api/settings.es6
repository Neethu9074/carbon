import http from 'in-services/http';

export function saveSettings(settings) {
  return http({
    method: 'PUT',
    url: `/api/ui/settings`,
    data: settings,
    maxRetries: 3
  }).map(response => response.body);
}
