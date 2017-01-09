import config from 'in-services/config';
import http from 'in-services/http';
import Immutable from 'immutable';

export function getAllFilters() {
  return http({
    method: 'GET',
    url: `/ump/${config.tenant}/${config.tenantUnit}/filters`
  })
  .map(response => {
    const filters = Immutable.fromJS(response.body);
    filters.sort((a, b) => a.name.localeCompare(b.name));
    return filters;
  });
}
