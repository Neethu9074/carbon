/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { FormatLocaleDefinition } from 'd3-format';

// CreateTearsheet component has a bug in its props type definition for children, this allows using it without losing typesafety of other props
import '@instana/ibm-products';
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
  limitedBizOpsScope: boolean;
  // pre-evaluated permissions from backend
  canConfigureApplications: boolean;
  canConfigureSubtraces: boolean;
  canConfigureServiceLevelIndicators: boolean;
  canConfigureEventsAndAlerts: boolean;
  canConfigureMaintenanceWindows: boolean;
  canConfigureApplicationSmartAlerts: boolean;
  canConfigureWebsiteSmartAlerts: boolean;
  canConfigureMobileAppSmartAlerts: boolean;
  canConfigureGlobalAlertPayload: boolean;
  canConfigureDatabaseManagement: boolean;
  canConfigureAutomationActions: boolean;
  canConfigureAuthenticationMethods: boolean;
  canConfigureSessionSettings: boolean;
  canRunAutomationActions: boolean;
  canConfigureAutomationPolicies: boolean;
  canViewLogs: boolean;
  canViewTraceDetails: boolean;
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
  canViewAccountAndBillingInformation: boolean;
  canConfigureLogManagement: boolean;
  canInvokeAlertChannel: boolean;
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
  }
}

declare module '@instana/ibm-products' {
  interface CreateTearsheetProps {
    children?: React.ReactNode;
  }
}
