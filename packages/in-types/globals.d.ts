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
  name?: string;
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
  limitedInfrastructureScope: boolean;
  limitedAutomationScope: boolean;
  // pre-evaluated permissions from backend
  canConfigureApplications: boolean;
  canConfigureServiceLevelIndicators: boolean;
  canConfigureEventsAndAlerts: boolean;
  canConfigureMaintenanceWindows: boolean;
  canConfigureApplicationSmartAlerts: boolean;
  canConfigureWebsiteSmartAlerts: boolean;
  canConfigureMobileAppSmartAlerts: boolean;
  canConfigureAutomationActions: boolean;
  canRunAutomationActions: boolean;
  canConfigureAutomationPolicies: boolean;
  canViewLogs: boolean;
  canConfigureLogRetentionPeriod: boolean;
  canViewAuditLog: boolean;
  canConfigureSyntheticCredentials: boolean;
  canUseSyntheticCredentials: boolean;
  canConfigureSyntheticLocations: boolean;
  canConfigureSyntheticTests: boolean;
  canViewSyntheticTests: boolean;
  canConfigureGlobalApplicationSmartAlerts: boolean;
  canConfigureGlobalSyntheticSmartAlerts: boolean;
  canConfigureGlobalInfraSmartAlerts: boolean;
  canConfigureGlobalLogSmartAlerts: boolean;
  canConfigureUsers: boolean;
  canConfigureTeams: boolean;
  canConfigureAgents: boolean;
  canConfigureApiTokens: boolean;
  canDeleteLogs: boolean;
  canViewLogVolume: boolean;
  canConfigureIntegrations: boolean;
  canConfigureMobileAppMonitoring: boolean;
  canManuallyCloseIssue: boolean;
  canDeleteAutomationActionHistory: boolean;
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
declare interface InstanaGlobals {
  reportingData?: ReportingData;
  user?: User;
  settings?: UiSettings;
  numberLocale?: FormatLocaleDefinition;
  dev: any;
  tags: Tag[];
  permissions: string[];
  termsAndPrivacySettings: Record<string, any>;
}

declare global {
  const __DEV__: boolean;

  interface Window {
    instana: InstanaGlobals;
  }
}
