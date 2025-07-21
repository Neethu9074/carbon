/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { FormatLocaleDefinition } from 'd3-format';

// CreateTearsheet component has a bug in its props type definition for children, this allows using it without losing typesafety of other props
import '@instana/ibm-products';
import { Tag } from '@instana/types';

// Is only imported here to derive the correct types for the pre-evaluated
// permissions.
// eslint-disable-next-line no-restricted-imports
import { PRE_EVALUATED_PERMISSION_DEFAULTS } from 'in-stores/permission';
// Is only imported here to derive the correct types for the user's role.
// eslint-disable-next-line no-restricted-imports
import { DEFAULT_ROLE } from 'in-stores/user';

export interface UiSettings {
  [key: string]: any;
}

export interface Tenant {
  tenantKey: string;
  role?: Role;
  name?: string;
}

export type PreEvaluatedPermissionNames = keyof typeof PRE_EVALUATED_PERMISSION_DEFAULTS;

export type PreEvaluatedPermissions = {
  [K in PreEvaluatedPermissionNames]: boolean;
};

/**
 * NOTE: Pre-evaluated permissions are now getting automatically derived from
 * the PRE_EVALUATED_PERMISSION_DEFAULTS object in `in-stores/permission`.
 **/
export interface Role extends PreEvaluatedPermissions {
  id: string;
  name: string;
  teamId: string;
  // all product permissions
  permissions: Array<string>;
}

export interface User {
  email: string;
  role?: Role;
  tenants: Tenant[];
  fullName: string;
  preferredName: string;
}

interface ReportingData {
  hasEntities: boolean;
  hostCount: number;
  serverlessCount: number;
}
interface Analytics {
  page<T = Record<string, any>>(eventName: string, properties?: T): void;
  track<T = Record<string, any>>(eventName: string, properties?: T): void;
  identify<T = Record<string, any>>(userId: string, traits?: T): void;
}
interface Concert {
  instance_id?: string;
  instance_url?: string;
}
interface Turbonomic {
  instance_id?: string;
  instance_url?: string;
}
interface Instances {
  concert?: Concert;
  turbonomic?: Turbonomic;
}

declare interface InstanaGlobals {
  reportingData?: ReportingData;
  user?: User;
  settings?: UiSettings;
  numberLocale?: FormatLocaleDefinition;
  dev: any;
  tags: Tag[];
  permissions: string[];
  termsAndPrivacySettings: Record<string, any>;

  // Needs to come in a follow-up task, after further clarification
  // Currently missing: config: ClientConfig;
}

declare global {
  const __DEV__: boolean;

  interface Window {
    instana: InstanaGlobals;
    analytics: Analytics;
    _solis_meta: Instances;
  }
}

declare module '@instana/ibm-products' {
  interface CreateTearsheetProps {
    children?: React.ReactNode;
  }
}
