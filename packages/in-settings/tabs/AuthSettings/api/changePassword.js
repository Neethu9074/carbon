import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function changePassword(config) {
  return http({
    method: 'POST',
    url: `/api/settings/authentication/changePassword`,
    headers: getCsrfHeader(),
    data: config
  });
}
