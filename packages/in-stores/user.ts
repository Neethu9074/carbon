/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { config } from 'in-services/config';

interface Tenant {
  tenantKey: string;
  role?: Role;
}

interface Role {
  id: string;
}

export interface User {
  email: string;
  role?: Role;
  tenants: Tenant[];
}

interface InstanaGlobals {
  user?: User
}

declare global {
  interface Window {
    instana: InstanaGlobals;
  }
}

export const ownerRoleId = '-1';
export const fallbackRoleId = '-2';
export const defaultRoleId = '-3';

export const user = window.instana.user;
export const tenant = user?.tenants.find(tenant => tenant.tenantKey === config.tenant);
export const role = user?.role ?? tenant?.role;

export const isInstanaEmail = user?.email.endsWith('@instana.com');

export const isOwner = role?.id === ownerRoleId;
