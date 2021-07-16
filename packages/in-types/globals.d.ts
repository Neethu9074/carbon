/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export interface UiSettings {
  [key: string]: any;
}

export interface Tenant {
  tenantKey: string;
  role?: Role;
}

export interface Role {
  id: string;
}

export interface User {
  email: string;
  role?: Role;
  tenants: Tenant[];
}

declare interface InstanaGlobals {
  user?: User;
  settings?: UiSettings;
}

declare global {
  const __DEV__: boolean;

  interface Window {
    instana: InstanaGlobals;
  }
}
