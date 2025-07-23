/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/**
 * Base readonly-object for maintaining the schema of pre-evaluated permissions
 * and their default values. The correct types will be automatically derived
 * from it in `in-stores/global`.
 **/
export const PRE_EVALUATED_PERMISSION_DEFAULTS = Object.freeze({
  // instana internal permissions
  canAccessAllUnits: false,
  canSeeInternalTags: false,
  canSetAgentTraceLogLevel: false,
  canSeeExtendedInternalMonitoring: false,
  limitedInfrastructureScope: false,
  limitedAutomationScope: false,
  limitedBizOpsScope: false,
  // pre-evaluated permissions from backend
  canConfigureApplications: false,
  canConfigureSubtraces: false,
  canConfigureServiceLevelIndicators: false,
  canConfigureEventsAndAlerts: false,
  canConfigureMaintenanceWindows: false,
  canConfigureApplicationSmartAlerts: false,
  canConfigureWebsiteSmartAlerts: false,
  canConfigureMobileAppSmartAlerts: false,
  canConfigureGlobalAlertPayload: false,
  canConfigureDatabaseManagement: false,
  canConfigureAutomationActions: false,
  canConfigureAuthenticationMethods: false,
  canConfigureSessionSettings: false,
  canRunAutomationActions: false,
  canConfigureAutomationPolicies: false,
  canViewLogs: false,
  canViewTraceDetails: false,
  canConfigureLogRetentionPeriod: false,
  canViewAuditLog: false,
  canConfigureSyntheticCredentials: false,
  canUseSyntheticCredentials: false,
  canConfigureSyntheticLocations: false,
  canConfigureSyntheticTests: false,
  canViewSyntheticTests: false,
  canConfigureGlobalApplicationSmartAlerts: false,
  canConfigureGlobalSyntheticSmartAlerts: false,
  canConfigureGlobalInfraSmartAlerts: false,
  canConfigureGlobalLogSmartAlerts: false,
  canConfigureUsers: false,
  canConfigureTeams: false,
  canConfigureAgents: false,
  canConfigureApiTokens: false,
  canDeleteLogs: false,
  canViewLogVolume: false,
  canConfigureIntegrations: false,
  canConfigureMobileAppMonitoring: false,
  canManuallyCloseIssue: false,
  canDeleteAutomationActionHistory: false,
  canViewAccountAndBillingInformation: false,
  canConfigureLogManagement: false,
  canInvokeAlertChannel: false
} as const);

export const DEFAULT_ROLE = Object.freeze({
  id: '',
  name: '',
  teamId: '',
  permissions: [] as string[],
  ...PRE_EVALUATED_PERMISSION_DEFAULTS
} as const);
