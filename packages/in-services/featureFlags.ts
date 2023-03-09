/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
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
export const isSelfService = isFeatureFlagEnabled('isSelfService');
export const k8sClusterUsageEnabled = isFeatureFlagEnabled('k8sClusterUsageEnabled');
export const websiteUserBreakdownEnabled = isFeatureFlagEnabled('websiteUserBreakdownEnabled');
export const fullTermsConfigEnabled = isFeatureFlagEnabled('fullTermsConfigEnabled', true);
export const agentMonitoringIssuesEnabled = isFeatureFlagEnabled('agentMonitoringIssuesEnabled');
export const skipOnboardingDialog = isFeatureFlagEnabled('skipOnboardingDialog');
export const routeIdOverPathTplEnabled = isFeatureFlagEnabled('routeIdOverPathTplEnabled');
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
export const phmcEnabled = isFeatureFlagEnabled('phmcEnabled');
export const vsphereEnabled = isFeatureFlagEnabled('vsphereEnabled');
export const openstackEnabled = isFeatureFlagEnabled('openstackEnabled');
export const zhmcEnabled = isFeatureFlagEnabled('zhmcEnabled');
export const loggingEnabled = isFeatureFlagEnabled('loggingEnabled');

export const enableTroubleshootingMode = isFeatureFlagEnabled('enableTroubleshootingMode', false);
export const syntheticCallsEnabled = isFeatureFlagEnabled('syntheticCallsEnabled');
export const applicationHealthOverviewEnabled = isFeatureFlagEnabled('applicationHealthOverviewEnabled');
export const pseudoLanguageEnabled = isFeatureFlagEnabled('pseudoLanguageEnabled');

export const openFacetedSearchByDefault = isFeatureFlagEnabled('openFacetedSearchByDefault', false);

export const agentInstallViewRestrictedToIBMSaas = isFeatureFlagEnabled('agentInstallViewRestrictedToIBMSaas');

export const configMigrationFeatureEnabled = isFeatureFlagEnabled('configMigrationFeatureEnabled');

// SmartAlerts & AP Alert Migration related feature flags
export const applicationSmartAlertsEnabled = isFeatureFlagEnabled('applicationSmartAlertsEnabled');
export const builtInGlobalApplicationSmartAlertsEnabled =
  applicationSmartAlertsEnabled && isFeatureFlagEnabled('builtInGlobalApplicationSmartAlertsEnabled');
export const potentialProblemsEnabled =
  applicationSmartAlertsEnabled && isFeatureFlagEnabled('potentialProblemsEnabled', true);
export const kubernetesExploreEnabled = isFeatureFlagEnabled('kubernetesExploreEnabled', false);
export const kubernetesTeamEnabled = isFeatureFlagEnabled('kubernetesTeamEnabled', false);
export const deprecateAppDataLegacyEventsEnabled =
  applicationSmartAlertsEnabled && isFeatureFlagEnabled('deprecateAppDataLegacyEventsEnabled', true);
export const disallowAppDataLegacyEventsEnabled =
  applicationSmartAlertsEnabled && isFeatureFlagEnabled('disallowAppDataLegacyEventsEnabled');
export const hideAppDataLegacyEventsEnabled =
  applicationSmartAlertsEnabled && isFeatureFlagEnabled('hideAppDataLegacyEventsEnabled');
export const perEndpointAdaptiveBaselineEnabled =
  applicationSmartAlertsEnabled && isFeatureFlagEnabled('perEndpointAdaptiveBaselineEnabled', false);

export const websiteSloEnabled = isFeatureFlagEnabled('websiteSloEnabled', false);
export const sliCHClusterAccessEnabled = isFeatureFlagEnabled('sliCHClusterAccessEnabled');
export const apdexWidgetEnabled = isFeatureFlagEnabled('apdexWidgetEnabled', false);
export const applicationApdexEnabled = isFeatureFlagEnabled('applicationApdexEnabled', false);
export const sloV2Enabled = isFeatureFlagEnabled('sloV2Enabled', false);

export const websiteUploadConfigEnabled = isFeatureFlagEnabled('websiteUploadConfigEnabled', false);
export const mobileAppCrashBeaconEnabled = isFeatureFlagEnabled('mobileAppCrashBeaconEnabled', false);

export const traceIdFilterOverrideEnabled = isFeatureFlagEnabled('traceIdFilterOverrideEnabled', true);
// RBAC usability improvements
export const rbacImprovementEnabled = isFeatureFlagEnabled('rbacImprovementEnabled', false);

// EUM beacon query optimization
export const websiteBeaconQueryOptimizationEnabled = isFeatureFlagEnabled(
  'websiteBeaconQueryOptimizationEnabled',
  true
);

// SmartAlerts, Strontium-cloudberry:
// Logs-Blueprint behind FF, Closed-Beta, only for customers already using it
export const smartAlertsLogsBlueprintEnabled = isFeatureFlagEnabled('smartAlertsLogsBlueprintEnabled', false);

// Synthetics test and  dashboard
export const syntheticsEnabled = isFeatureFlagEnabled('syntheticsEnabled');

// Synthetic BrowserScript feature flag
export const syntheticBrowserScriptEnabled = isFeatureFlagEnabled('syntheticBrowserScriptEnabled');

// Synthetic SmartAlert feature flag
export const syntheticSmartAlertsEnabled = isFeatureFlagEnabled('syntheticSmartAlertsEnabled');

// Create Synthetic SmartAlert UI feature flag
export const syntheticCreateSmartAlertsUIEnabled = isFeatureFlagEnabled('syntheticCreateSmartAlertsUIEnabled');

// Create Synthetic Test in Advance Mode
export const syntheticCreateTestAdvanceModeEnabled = isFeatureFlagEnabled('syntheticCreateTestAdvanceModeEnabled');

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

export const perSecondAggregationEnabled = isFeatureFlagEnabled('perSecondAggregationEnabled', false);

export const actionAutomationEnabled = isFeatureFlagEnabled('actionAutomationEnabled', false);

export const pluginMetricStatisticsEnabled = isFeatureFlagEnabled('pluginMetricStatisticsEnabled', false);

export const controlPlaneEnabled = isFeatureFlagEnabled('controlPlaneEnabled', false);

export const largeTracesV2Enabled = isFeatureFlagEnabled('largeTracesV2Enabled', false);

export const oracleRacMonitoringEnabled = isFeatureFlagEnabled('oracleRacMonitoringEnabled', false);
