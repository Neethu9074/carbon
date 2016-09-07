import http from 'in-services/http';

const tenantFetchUrl = '/auth/users/tenants/';

export function getTenantsWithUnits() {
  return http({method: 'GET', url: tenantFetchUrl})
    .map(response => response.body);
}
