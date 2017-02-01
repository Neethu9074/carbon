import {find} from 'lodash';

import {config} from 'in-services/config';

export const user = window.instana.user;
export const tenant = find(user.tenants, tenant => tenant.tenantKey === config.tenant);
export const role = tenant.role;

export function isInstanaEmployee() {
  return user.email.indexOf('@instana.com') !== -1;
}
