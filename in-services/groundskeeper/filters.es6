import {fromJS} from 'immutable';

import config from 'in-services/config';
import http from 'in-services/http';


export function getAllFilters() {
  return http({
    method: 'GET',
    url: `/ump/${config.tenant}/${config.tenantUnit}/filters`
  })
  .map(response => {
    response.body.sort((a, b) => a.name.localeCompare(b.name));
    return fromJS(response.body);
  });
}


export function saveNewFilter(name, definition) {
  return http({
    method: 'POST',
    url: `/ump/${config.tenant}/${config.tenantUnit}/filters`,
    data: {
      name,
      definition
    }
  })
  .map(response => response.body);
}


export function saveFilter(id, name, definition) {
  return http({
    method: 'PUT',
    url: `/ump/${config.tenant}/${config.tenantUnit}/filters/${encodeURIComponent(id)}`,
    data: {
      id,
      name,
      definition
    }
  })
  .map(response => response.body);
}


export function removeFilter(id) {
  return http({
    method: 'DELETE',
    url: `/ump/${config.tenant}/${config.tenantUnit}/filters/${encodeURIComponent(id)}`
  })
  .map(response => response.body);
}
