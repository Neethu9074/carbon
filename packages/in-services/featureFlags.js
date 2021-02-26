/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isInstanaEmail, isInstanaEngineer } from 'in-stores/user';
import { isFeatureFlagEnabled } from 'in-services/config';

// ########################################################################################
// Regular feature flags
// ########################################################################################
export const tenantSwitcherEnabled = isFeatureFlagEnabled('tenantSwitcherEnabled');
export const releaseNotesEnabled = isFeatureFlagEnabled('releaseNotesEnabled');
export const maintenanceNotesEnabled = isFeatureFlagEnabled('maintenanceNotesEnabled');
export const useInstanaSaasEumTrackingUrlEnabled = isFeatureFlagEnabled('useInstanaSaasEumTrackingUrlEnabled');
export const onPremLicenseInformationEnabled = isFeatureFlagEnabled('onPremLicenseInformationEnabled');
export const isUsageInfoPopupEnabled = isFeatureFlagEnabled('isUsageInfoPopupEnabled', true);
export const containerInfoEnabled = isFeatureFlagEnabled('containerInfoEnabled');
export const internalMonitoringUnit = isFeatureFlagEnabled('internalMonitoringUnit');
export const samplingIndicatorEnabled = isFeatureFlagEnabled('samplingIndicatorEnabled');
export const isSelfService = isFeatureFlagEnabled('isSelfService');
export const k8sClusterUsageEnabled = isFeatureFlagEnabled('k8sClusterUsageEnabled');
export const websiteUserBreakdownEnabled = isFeatureFlagEnabled('websiteUserBreakdownEnabled');
export const fullTermsConfigEnabled = isFeatureFlagEnabled('fullTermsConfigEnabled', true);
export const contextGuideEnabled = isFeatureFlagEnabled('contextGuideEnabled');
export const agentMonitoringIssuesEnabled = isFeatureFlagEnabled('agentMonitoringIssuesEnabled');
export const skipOnboardingDialog = isFeatureFlagEnabled('skipOnboardingDialog');
export const sloWidgetEnabled = isFeatureFlagEnabled('sloWidgetEnabled', true);
export const routeIdOverPathTplEnabled = isFeatureFlagEnabled('routeIdOverPathTplEnabled');
export const infraExplorePresentationEnabled = isFeatureFlagEnabled('infraExplorePresentationEnabled');
export const infraExploreDataEnabled = isFeatureFlagEnabled('infraExploreDataEnabled');
export const newApCreationEnabled = isFeatureFlagEnabled('newApCreationEnabled');
export const entityCountWidgetEnabled = isFeatureFlagEnabled('entityCountWidgetEnabled');
export const infraMetricsWidgetEnabled = isFeatureFlagEnabled('infraMetricsWidgetEnabled');
export const persistentVolumeSupportEnabled = isFeatureFlagEnabled('persistentVolumeSupportEnabled');
export const smartAlertsQB2Enabled = isFeatureFlagEnabled('smartAlertsQB2Enabled');
export const qb2InCustomDashboardsEnabled = isFeatureFlagEnabled('qb2InCustomDashboardsEnabled');
export const ampCompanyInfoEnabled = isFeatureFlagEnabled('ampCompanyInfoEnabled');
export const newAnalyticsEnabled = isFeatureFlagEnabled('newAnalyticsEnabled');
export const pcfEnabled = isFeatureFlagEnabled('pcfEnabled');
export const vsphereEnabled = isFeatureFlagEnabled('vsphereEnabled');
export const applicationSmartAlertsEnabled = isFeatureFlagEnabled('applicationSmartAlertsEnabled');
export const webMobileQb2AnalyzeEnabled = isFeatureFlagEnabled('webMobileQb2AnalyzeEnabled');
export const loggingEnabled = isFeatureFlagEnabled('loggingEnabled');
export const smartAlertsAdvancedEntitySelectionEnabled = isFeatureFlagEnabled(
  'smartAlertsAdvancedEntitySelectionEnabled',
  true
);
export const showUserSettingInternalTagsInUA = isFeatureFlagEnabled('showUserSettingInternalTagsInUA', false);
export const qb2InAPCreationEnabled = isFeatureFlagEnabled('qb2InAPCreationEnabled');
export const languageSelectorEnabled = isFeatureFlagEnabled('languageSelectorEnabled');
export const oidcEnabled = isFeatureFlagEnabled('oidcEnabled');
export const syntheticCallsEnabled = isFeatureFlagEnabled('syntheticCallsEnabled');

// ########################################################################################
// Dynamic focus keywords
// ########################################################################################
export function getHiddenSearchFieldKeywords() {
  return ['selfMonitoring'];
}
export const hiddenSearchFieldValues = {
  'event.type': ['objectiveViolation', 'event', 'changeDetected', 'changeAndPresence'],
  'entity.type': ['agent', 'beeinstana'],
  'entity.selfType': ['beeinstana', 'steadyMetrics', 'tenantUnit', 'agentStatistics', 'entityStatistics', 'region']
};

// ########################################################################################
// Chart gap hiding
// ########################################################################################
export const allowedMillisGapsInOneSecondResolution = isInstanaEngineer ? 2300 : 20000;

// Charts will hide small gaps in timeseries data to account for infrastructure hiccups and delays.
// For example, the following configuration will hide up to 11.5s of missing data points.
// rollup = 5s
// allowedMultiplesOfRollupSizeMissingInCharts = 2.3
export const allowedMultiplesOfRollupSizeMissingInCharts = isInstanaEngineer ? 2.3 : 4;

//Flag which exposes the download button - enables the download of metrics from event view
export const allowDownloadMetricsFromCharts = isInstanaEmail;

// QB2 in SmartAlerts is only effectively enabled when UA2 is also enabled
export const isQB2ModeInSmartAlertsEnabled = newAnalyticsEnabled && smartAlertsQB2Enabled;
