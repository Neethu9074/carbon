import {find} from 'lodash';

import {config} from 'in-services/config';

const user = getCurrentUser();
const tenant = find(user.tenants, tenant => tenant.name === config.tenant.name);
const role = tenant.role;

export function getCurrentUser() { return user; }
export function getTenant() { return tenant; }
export function getRole() { return role; }

export function isInstanaEmployee() {
  return user.email.indexOf('@instana.com') !== -1;
}
