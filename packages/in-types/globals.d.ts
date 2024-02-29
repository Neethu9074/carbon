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
  canConfigureEventsAndAlerts: boolean;
  canConfigureMaintenanceWindows: boolean;
  canConfigureApplicationSmartAlerts: boolean;
  canConfigureWebsiteSmartAlerts: boolean;
  canConfigureMobileAppSmartAlerts: boolean;
  canConfigureAutomationActions: boolean;
  canRunAutomationActions: boolean;
  canConfigureAutomationPolicies: boolean;
  canViewAutomationActionInstances: boolean;
  canViewLogs: boolean;
  canConfigureSyntheticLocations: boolean;
  canConfigureSyntheticTests: boolean;
  canConfigureGlobalApplicationSmartAlerts: boolean;
  canConfigureGlobalSyntheticSmartAlerts: boolean;
  canConfigureGlobalInfraSmartAlerts: boolean;
  canConfigureGlobalLogSmartAlerts: boolean;
  canViewSyntheticTests: boolean;
  canConfigureUsers: boolean;
  canConfigureAgents: boolean;
  canConfigureApiTokens: boolean;
  canDeleteLogs: boolean;
  canConfigureIntegrations: boolean;
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
