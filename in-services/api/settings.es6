import http from 'in-services/http';

export function saveSettings(settings) {
  return http({
    method: 'PUT',
    url: `/api/ui/settings`,
    data: Object.keys(settings).map(key => {
      return {
        property: key,
        value: settings[key]
      };
    })
  }).map(response => response.body);
}
