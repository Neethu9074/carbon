/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isFeatureFlagEnabled } from 'in-services/config';
import { isInstanaEmail } from 'in-stores/user';

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
export const routeIdOverPathTplEnabled = isFeatureFlagEnabled('routeIdOverPathTplEnabled');
export const infraExplorePresentationEnabled = isFeatureFlagEnabled('infraExplorePresentationEnabled');
export const infraExploreDataEnabled = isFeatureFlagEnabled('infraExploreDataEnabled');
export const beeInstanaInfraMetricsEnabled = isFeatureFlagEnabled('beeInstanaInfraMetricsEnabled');
export const highResolutionInfrastructureMetricsEnabled = isFeatureFlagEnabled(
  'highResolutionInfrastructureMetricsEnabled',
  true
);
export const newApCreationEnabled = isFeatureFlagEnabled('newApCreationEnabled');
export const entityCountWidgetEnabled = isFeatureFlagEnabled('entityCountWidgetEnabled');
export const infraMetricsWidgetEnabled = isFeatureFlagEnabled('infraMetricsWidgetEnabled');
export const persistentVolumeSupportEnabled = isFeatureFlagEnabled('persistentVolumeSupportEnabled');
export const ampCompanyInfoEnabled = isFeatureFlagEnabled('ampCompanyInfoEnabled');
export const ampEnabled = isFeatureFlagEnabled('ampEnabled', true);
export const pcfEnabled = isFeatureFlagEnabled('pcfEnabled');
export const vsphereEnabled = isFeatureFlagEnabled('vsphereEnabled');
export const applicationSmartAlertsEnabled = isFeatureFlagEnabled('applicationSmartAlertsEnabled');
export const applicationSmartAlertsPerEndpointsEnabled = isFeatureFlagEnabled(
  'applicationSmartAlertsPerEndpointsEnabled'
);
export const loggingEnabled = isFeatureFlagEnabled('loggingEnabled');
export const containerLogsEnabled = isFeatureFlagEnabled('containerLogsEnabled');
export const loggingEnabledOnTrace = isFeatureFlagEnabled('loggingEnabledOnTrace');

export const showUserSettingInternalTagsInUA = isFeatureFlagEnabled('showUserSettingInternalTagsInUA', false);
export const languageSelectorEnabled = isFeatureFlagEnabled('languageSelectorEnabled');
export const authenticationOidcEnabled = isFeatureFlagEnabled('authenticationOidcEnabled', false);
export const syntheticCallsEnabled = isFeatureFlagEnabled('syntheticCallsEnabled');
export const applicationHealthOverviewEnabled = isFeatureFlagEnabled('applicationHealthOverviewEnabled');
export const pseudoLanguageEnabled = isFeatureFlagEnabled('pseudoLanguageEnabled');
export const hideEventSettings = isFeatureFlagEnabled('hideEventsSettings', false);
export const openFacetedSearchByDefault = isFeatureFlagEnabled('openFacetedSearchByDefault', false);

export const agentInstallViewRestrictedToIBMSaas = isFeatureFlagEnabled('agentInstallViewRestrictedToIBMSaas');

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
export const allowedMillisGapsInOneSecondResolution = 20000;

// Charts will hide small gaps in timeseries data to account for infrastructure hiccups and delays.
// For example, the following configuration will hide up to 11.5s of missing data points.
// rollup = 5s
export const allowedMultiplesOfRollupSizeMissingInCharts = 4;

//Flag which exposes the download button - enables the download of metrics from event view
export const allowDownloadMetricsFromCharts = isInstanaEmail;
