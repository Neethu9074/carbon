import {find} from 'lodash';

import {config} from 'in-services/config';

const user = window.instana.user;
const tenant = find(user.tenants, tenant => (tenant.tenantKey || tenant.name) === config.tenant);
const role = tenant.role;

export function getCurrentUser() { return user; }
export function getTenant() { return tenant; }
export function getRole() { return role; }

export function isInstanaEmployee() {
  return user.email.indexOf('@instana.com') !== -1;
}
