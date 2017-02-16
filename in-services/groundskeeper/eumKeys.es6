import http from 'in-services/http';

export function getAllEumKeys() {
  return http({
    method: 'GET',
    url: `/api/eumApps`
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
    url: `/api/eumApps/${encodeURIComponent(keyId)}`
  })
  .map(response => response.body);
}

export function addKey(appName) {
  return http({
    method: 'POST',
    url: `/api/eumApps`,
    queryParams: {
      name: appName
    }
  })
  .map(response => response.body);
}


export function renameKey(apiKey, newAppName) {
  return http({
    method: 'PUT',
    url: `/api/eumApps/${encodeURIComponent(apiKey)}`,
    queryParams: {
      name: newAppName
    }
  })
  .map(response => response);
}
