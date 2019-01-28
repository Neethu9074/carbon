import { find } from 'lodash';

import { createTrackingStore } from 'in-stores/store';
import { getTenantsWithUnits } from 'in-api/account';
import { config } from 'in-services/config';

export const ownerRoleId = '-1';
export const fallbackRoleId = '-2';
export const defaultRoleId = '-3';

export const user = window.instana.user;
export const tenant = find(user.tenants, tenant => tenant.tenantKey === config.tenant);
export const role = tenant.role;

export const isInstanaEngineer = user.email === 'stan@instana.com';

export const isInstanaEmail = user.email.endsWith('@instana.com');

export const tenantUnitStructure$ = createTrackingStore({
  name: 'tenantUnitStructure',
  observable: getTenantsWithUnits()
}).observable;
