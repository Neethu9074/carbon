import config from 'in-services/config';
import http from 'in-services/http';

export function getAllEumKeys() {
  return http({
    method: 'GET',
    url: `/ump/${config.tenant}/${config.tenantUnit}/eum/eumkeys`
  })
  .map(response => {
    const keys = response.body || [];
    keys.sort((a, b) => a.appName.localeCompare(b.appName));
    return keys;
  });
}

export function removeKey(keyId) {
  return http({
    method: 'DELETE',
    url: `/ump/${config.tenant}/${config.tenantUnit}/eum/remove/${keyId}`
  })
  .map(response => response.body);
}

export function addKey(appName) {
  return http({
    method: 'POST',
    url: `/ump/${config.tenant}/${config.tenantUnit}/eum/add/${encodeURIComponent(appName)}`
  })
  .map(response => response.body);
}


export function renameKey(apiKey, newAppName) {
  return http({
    method: 'POST',
    url: `/ump/${config.tenant}/${config.tenantUnit}/eum/rename/${encodeURIComponent(apiKey)}/${encodeURIComponent(newAppName)}`
  })
  .map(response => response.body);
}
