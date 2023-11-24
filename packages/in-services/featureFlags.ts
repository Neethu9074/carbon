/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
export const beeinstanaHistogramsEnabled = isFeatureFlagEnabled('beeinstanaHistogramsEnabled');
export const highResolutionInfrastructureMetricsEnabled = isFeatureFlagEnabled(
  'highResolutionInfrastructureMetricsEnabled',
  true
);
export const infraMetricsWidgetEnabled = isFeatureFlagEnabled('infraMetricsWidgetEnabled');
export const persistentVolumeSupportEnabled = isFeatureFlagEnabled('persistentVolumeSupportEnabled');
export const ampCompanyInfoEnabled = isFeatureFlagEnabled('ampCompanyInfoEnabled');
export const ampEnabled = isFeatureFlagEnabled('ampEnabled', true);
export const pcfEnabled = isFeatureFlagEnabled('pcfEnabled');
export const phmcEnabled = isFeatureFlagEnabled('phmcEnabled');
export const vsphereEnabled = isFeatureFlagEnabled('vsphereEnabled');
export const openstackEnabled = isFeatureFlagEnabled('openstackEnabled');
export const zhmcEnabled = isFeatureFlagEnabled('zhmcEnabled');
export const powervcEnabled = isFeatureFlagEnabled('powervcEnabled');
export const sapEnabled = isFeatureFlagEnabled('sapEnabled');
export const loggingEnabled = isFeatureFlagEnabled('loggingEnabled');

export const enableTroubleshootingMode = isFeatureFlagEnabled('enableTroubleshootingMode', false);
export const applicationHealthOverviewEnabled = isFeatureFlagEnabled('applicationHealthOverviewEnabled');
export const pseudoLanguageEnabled = isFeatureFlagEnabled('pseudoLanguageEnabled');

export const agentInstallViewRestrictedToIBMSaas = isFeatureFlagEnabled('agentInstallViewRestrictedToIBMSaas');

// SmartAlerts & AP Alert Migration related feature flags
export const builtInGlobalApplicationSmartAlertsEnabled = isFeatureFlagEnabled(
  'builtInGlobalApplicationSmartAlertsEnabled'
);
export const potentialProblemsEnabled = isFeatureFlagEnabled('potentialProblemsEnabled', true);
export const deprecateAppDataLegacyEventsEnabled = isFeatureFlagEnabled('deprecateAppDataLegacyEventsEnabled', true);
export const disallowAppDataLegacyEventsEnabled = isFeatureFlagEnabled('disallowAppDataLegacyEventsEnabled');
export const hideAppDataLegacyEventsEnabled = isFeatureFlagEnabled('hideAppDataLegacyEventsEnabled');
export const perEndpointAdaptiveBaselineEnabled = isFeatureFlagEnabled('perEndpointAdaptiveBaselineEnabled', false);

export const kubernetesExploreEnabled = isFeatureFlagEnabled('kubernetesExploreEnabled', false);
export const kubernetesTeamEnabled = isFeatureFlagEnabled('kubernetesTeamEnabled', false);

export const sloEnabled = isFeatureFlagEnabled('sloEnabled', true);
export const websiteSloEnabled = isFeatureFlagEnabled('websiteSloEnabled', true);
export const sliCHClusterAccessEnabled = isFeatureFlagEnabled('sliCHClusterAccessEnabled');
export const apdexWidgetEnabled = isFeatureFlagEnabled('apdexWidgetEnabled', true);
export const sloV2Enabled = isFeatureFlagEnabled('sloV2Enabled', false);

export const mobileAppCrashBeaconEnabled = isFeatureFlagEnabled('mobileAppCrashBeaconEnabled', false);

export const apiTokenDialogEnabled = isFeatureFlagEnabled('apiTokenDialogEnabled', false);

export const disableInvitesWithIdpEnabled = isFeatureFlagEnabled('disableInvitesWithIdpEnabled', true);

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

// Synthetic BrowserScript feature flags
export const syntheticBrowserScriptEnabled = isFeatureFlagEnabled('syntheticBrowserScriptEnabled');
export const syntheticBrowserCreateTestEnabled = isFeatureFlagEnabled('syntheticBrowserCreateTestEnabled');

// Synthetic credential feature flag
export const syntheticsKeystoreEnabled = isFeatureFlagEnabled('syntheticsKeystoreEnabled');

// Synthetic RBAC feature flag
export const syntheticRbacEnabled = isFeatureFlagEnabled('syntheticRbacEnabled');

// Synthetic Custom Dashboard feature flag
export const syntheticCustomDashboardEnabled = isFeatureFlagEnabled('syntheticCustomDashboardEnabled');

// Synthetic Instana Hosted PoP feature flag
export const syntheticInstanaHostedPoPEnabled = isFeatureFlagEnabled('syntheticInstanaHostedPoPEnabled');

// MobileApp Smart Alerts
export const mobileAppSmartAlertsEnabled = isFeatureFlagEnabled('mobileAppSmartAlertsEnabled');
export const mobileAppSmartAlertsAdaptiveBaselineEnabled = isFeatureFlagEnabled(
  'mobileAppSmartAlertsAdaptiveBaselineEnabled'
);

// Table custom widget
export const customWidgetEventsTableEnabled = isFeatureFlagEnabled('customWidgetEventsTableEnabled');
export const customWidgetTableInfraDataSourceEnabled = isFeatureFlagEnabled('customWidgetTableInfraDataSourceEnabled');

// Infrastructure Smart Alerts
export const infraSmartAlertsEnabled = isFeatureFlagEnabled('infraSmartAlertsEnabled');
export const infraSmartAlertsPredictionsEnabled = isFeatureFlagEnabled('infraSmartAlertsPredictionsEnabled');

export const alertsHubEnabled = isFeatureFlagEnabled('alertsHubEnabled');

export const regexMetricSelectionEnabled = isFeatureFlagEnabled('regexMetricSelectionEnabled');

export const autoFormatterTimeSeriesEnabled = isFeatureFlagEnabled('autoFormatterTimeSeriesEnabled');

export const multiGroupTimeSeriesEnabled = isFeatureFlagEnabled('multiGroupTimeSeriesEnabled');

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
// Business Observability and Monitoring (BizOps) flags
// ########################################################################################
export const businessObservabilityEnabled = isFeatureFlagEnabled('businessObservabilityEnabled');
export const bizopsFeatureEnabled = isFeatureFlagEnabled('bizopsFeatureEnabled');

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

export const limitVisibleNestingLevelsInTraceEnabled = isFeatureFlagEnabled(
  'limitVisibleNestingLevelsInTraceEnabled',
  false
);

export const kongEnabled = isFeatureFlagEnabled('kongEnabled', false);
// Recurrent Maintenance Window Flag
export const playwithEnabled = isFeatureFlagEnabled('playwithEnabled', false);
export const recurrentMaintenanceWindowEnabled = isFeatureFlagEnabled('recurrentMaintenanceWindowsEnabled', true);
export const recurrentMaintenanceWindowsTabsEnabled = isFeatureFlagEnabled(
  'recurrentMaintenanceWindowsTabsEnabled',
  false
);
export const syntheticsFilterForMaintenanceWindowsEnabled = isFeatureFlagEnabled(
  'syntheticsFilterForMaintenanceWindowsEnabled',
  false
);

export const systemRuleEntityCountEnabled = isFeatureFlagEnabled('systemRuleEntityCountEnabled', false);

export const userSettingsThemeEnabled = isFeatureFlagEnabled('userSettingsThemeEnabled', false);

export const oneMinuteGranularityForStaticThresholdEnabled = isFeatureFlagEnabled(
  'oneMinuteGranularityForStaticThresholdEnabled',
  true
);
export const playwithTestEnabled = isFeatureFlagEnabled('playwithTestEnabled', false);
export const playWithReleaseEnabled = isFeatureFlagEnabled('playWithReleaseEnabled', false);
export const logDeletionEnabled = isFeatureFlagEnabled('logDeletionEnabled', true);

export const rcaUIEnabled = isFeatureFlagEnabled('rcaUIEnabled', false);
export const eventFeedbackEnabled = isFeatureFlagEnabled('eventFeedbackEnabled', true);
export const incidentSummarizationEnabled = isFeatureFlagEnabled('incidentSummarizationEnabled', false);
export const incidentSummarizationTimelineEnabled = isFeatureFlagEnabled('incidentSummarizationTimelineEnabled', true);

export const applicationContributionFilterEnabled = isFeatureFlagEnabled('applicationContributionFilterEnabled', false);
