/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { FormatLocaleDefinition } from 'd3-format';

import { Tag } from '@instana/types';

export interface UiSettings {
  [key: string]: any;
}

export interface Tenant {
  tenantKey: string;
  role?: Role;
}

export interface Role {
  id: string;
  name: string;
  // all product permissions
  permissions: Array<string>;
  // instana internal permissions
  canAccessAllUnits: boolean;
  canSeeInternalTags: boolean;
  canSetAgentTraceLogLevel: boolean;
  canSeeExtendedInternalMonitoring: boolean;
  // pre-evaluated permissions from backend
  canConfigureServiceLevelIndicators: boolean;
  canConfigureCustomAlerts: boolean;
  canRunAutomationActions: boolean;
  canViewLogs: boolean;
  canConfigureSyntheticLocations: boolean;
  /* Partially implementing this permission breaks tests so once this is fully implemented on the BE
  uncomment all usages of CAN_DELETE_LOGS and canDelete logs in the project */
  //canDeleteLogs: boolean;
}

export interface User {
  email: string;
  role?: Role;
  tenants: Tenant[];
}

declare interface InstanaGlobals {
  user?: User;
  settings?: UiSettings;
  numberLocale?: FormatLocaleDefinition;
  dev: any;
  tags: Tag[];
  permissions: string[];
}

declare global {
  const __DEV__: boolean;

  interface Window {
    instana: InstanaGlobals;
  }
}
