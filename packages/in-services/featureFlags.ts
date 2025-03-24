/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

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
export const isSelfService = isFeatureFlagEnabled('isSelfService');
export const k8sClusterUsageEnabled = isFeatureFlagEnabled('k8sClusterUsageEnabled');
export const websiteUserBreakdownEnabled = isFeatureFlagEnabled('websiteUserBreakdownEnabled');
export const fullTermsConfigEnabled = isFeatureFlagEnabled('fullTermsConfigEnabled', true);
export const agentMonitoringIssuesEnabled = isFeatureFlagEnabled('agentMonitoringIssuesEnabled');
export const cveIssueEnabled = isFeatureFlagEnabled('cveIssueEnabled');
export const prcIssueEnabled = isFeatureFlagEnabled('prcIssueEnabled');
export const vulnerabilityCenterEnabled = isFeatureFlagEnabled('vulnerabilityCenterEnabled');
export const skipOnboardingDialog = isFeatureFlagEnabled('skipOnboardingDialog');
export const routeIdOverPathTplEnabled = isFeatureFlagEnabled('routeIdOverPathTplEnabled');
export const infraExploreDataEnabled = isFeatureFlagEnabled('infraExploreDataEnabled');
export const infrastructureExploreTagColumnsEnabled = isFeatureFlagEnabled('infrastructureExploreTagColumnsEnabled');
export const beeInstanaInfraMetricsEnabled = isFeatureFlagEnabled('beeInstanaInfraMetricsEnabled');
export const beeinstanaHistogramsEnabled = isFeatureFlagEnabled('beeinstanaHistogramsEnabled');
export const beeinstanaInfraMetricsWithTimeshiftEnabled = isFeatureFlagEnabled(
  'beeinstanaInfraMetricsWithTimeshiftEnabled'
);
export const highResolutionInfrastructureMetricsEnabled = isFeatureFlagEnabled(
  'highResolutionInfrastructureMetricsEnabled',
  true
);
export const infraMetricsWidgetEnabled = isFeatureFlagEnabled('infraMetricsWidgetEnabled');
export const infraExploreFilterEmptyValueEnabled = isFeatureFlagEnabled('infraExploreFilterEmptyValueEnabled');
export const persistentVolumeSupportEnabled = isFeatureFlagEnabled('persistentVolumeSupportEnabled');
export const ampCompanyInfoEnabled = isFeatureFlagEnabled('ampCompanyInfoEnabled');
export const segmentAnalyticsEnabled = isFeatureFlagEnabled('segmentAnalyticsEnabled', false);
export const amplitudeExperimentEnabled = isFeatureFlagEnabled('amplitudeExperimentEnabled', false);
export const ibmCommonEnabled = isFeatureFlagEnabled('ibmCommonEnabled', false);
export const dataUsageNotificationEnabled = isFeatureFlagEnabled('dataUsageNotificationEnabled', false);
export const ampEnabled = isFeatureFlagEnabled('ampEnabled', true);
export const pcfEnabled = isFeatureFlagEnabled('pcfEnabled');
export const phmcEnabled = isFeatureFlagEnabled('phmcEnabled');
export const vsphereEnabled = isFeatureFlagEnabled('vsphereEnabled');
export const openstackEnabled = isFeatureFlagEnabled('openstackEnabled');
export const zhmcEnabled = isFeatureFlagEnabled('zhmcEnabled');
export const powervcEnabled = isFeatureFlagEnabled('powervcEnabled');
export const sapEnabled = isFeatureFlagEnabled('sapEnabled');
export const loggingEnabled = isFeatureFlagEnabled('loggingEnabled');
export const deleteLogsV3Enabled = isFeatureFlagEnabled('deleteLogsV3Enabled');
export const logVolumePageEnabled = isFeatureFlagEnabled('logVolumePageEnabled');
export const notesAndActivityEnabled = isFeatureFlagEnabled('notesAndActivityEnabled');
export const carbonTooltipEnabled = isFeatureFlagEnabled('carbonTooltipEnabled');
export const carbonTableEnabled = isFeatureFlagEnabled('carbonTableEnabled');

export const enableTroubleshootingMode = isFeatureFlagEnabled('enableTroubleshootingMode', false);
export const applicationHealthOverviewEnabled = isFeatureFlagEnabled('applicationHealthOverviewEnabled');
export const pseudoLanguageEnabled = isFeatureFlagEnabled('pseudoLanguageEnabled');

export const agentInstallViewRestrictedToIBMSaas = isFeatureFlagEnabled('agentInstallViewRestrictedToIBMSaas');
export const nutanixEnabled = isFeatureFlagEnabled('nutanixEnabled');

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
export const kubernetesPrometheusMetricsEnabled = isFeatureFlagEnabled('kubernetesPrometheusMetricsEnabled', false);
export const kubernetesCloudNativeExperience = isFeatureFlagEnabled('kubernetesCloudNativeExperience', false);

export const mobileAppCrashBeaconEnabled = isFeatureFlagEnabled('mobileAppCrashBeaconEnabled', true);
export const mobileAppPerfBeaconEnabled = isFeatureFlagEnabled('mobileAppPerfBeaconEnabled', true);
export const mobileAppPerformanceTabEnabled = isFeatureFlagEnabled('mobileAppPerformanceTabEnabled', true);
export const mobileAppDroppedBeaconsEnabled = isFeatureFlagEnabled('mobileAppDroppedBeaconsEnabled', true);
export const eumImpactedUsersForAppAlertEnabled = isFeatureFlagEnabled('eumImpactedUsersForAppAlertEnabled', false);

export const apiTokenExpirationEnabled = isFeatureFlagEnabled('apiTokenExpirationEnabled', true);

export const disableInvitesWithIdpEnabled = isFeatureFlagEnabled('disableInvitesWithIdpEnabled', true);

// EUM beacon query optimization
export const websiteBeaconQueryOptimizationEnabled = isFeatureFlagEnabled(
  'websiteBeaconQueryOptimizationEnabled',
  true
);

export const timeOutSessionEnabled = isFeatureFlagEnabled('timeOutSessionEnabled', false);

export const iframeEnabled = isFeatureFlagEnabled('iframeEnabled', false);

// SmartAlerts, Strontium-cloudberry:
// Logs-Blueprint behind FF, Closed-Beta, only for customers already using it
export const smartAlertsLogsBlueprintEnabled = isFeatureFlagEnabled('smartAlertsLogsBlueprintEnabled', false);

// Synthetics test and  dashboard
export const syntheticsEnabled = isFeatureFlagEnabled('syntheticsEnabled');

// Synthetic Custom Dashboard feature flag
export const syntheticCustomDashboardEnabled = isFeatureFlagEnabled('syntheticCustomDashboardEnabled');

// Synthetic Instana Hosted PoP feature flag
export const syntheticInstanaHostedPoPEnabled = isFeatureFlagEnabled('syntheticInstanaHostedPoPEnabled');

// Synthetic RBAC Limited Access feature flag
export const syntheticRbacLimitedEnabled = isFeatureFlagEnabled('syntheticRbacLimitedEnabled');

// Synthetic DNS feature flag
export const syntheticDNSEnabled = isFeatureFlagEnabled('syntheticDNSEnabled');

// MobileApp Smart Alerts
export const mobileAppSmartAlertsAdaptiveBaselineEnabled = isFeatureFlagEnabled(
  'mobileAppSmartAlertsAdaptiveBaselineEnabled'
);

// Table custom widget
export const customWidgetEventsTableEnabled = isFeatureFlagEnabled('customWidgetEventsTableEnabled');
export const customWidgetTableInfraDataSourceEnabled = isFeatureFlagEnabled('customWidgetTableInfraDataSourceEnabled');

// Custom Dashboards
export const thresholdCustomDashboardsEnabled = isFeatureFlagEnabled('thresholdCustomDashboardsEnabled');
export const thresholdCustomDashboardsTableWidgetEnabled = isFeatureFlagEnabled(
  'thresholdCustomDashboardsTableWidgetEnabled'
);
export const customDashboardsExportPdfWidget = isFeatureFlagEnabled('customDashboardsExportPdfWidget');
export const customDashboardsExportPdfEntireDashboard = isFeatureFlagEnabled(
  'customDashboardsExportPdfEntireDashboard'
);

export const customDashboardsFastQueryModeEnabled = isFeatureFlagEnabled('customDashboardsFastQueryModeEnabled', false);

// Infrastructure Smart Alerts
export const infraSmartAlertsEnabled = isFeatureFlagEnabled('infraSmartAlertsEnabled');
export const infraPredictiveDetectionEnabled = isFeatureFlagEnabled('infraPredictiveDetectionEnabled');
export const infraSmartAlertsPredictionsEnabled = isFeatureFlagEnabled('infraSmartAlertsPredictionsEnabled');

export const alertChannelPerSeverityInfraSaEnabled = isFeatureFlagEnabled('alertChannelPerSeverityInfraSaEnabled');
export const alertChannelPerSeverityApplicationSaEnabled = isFeatureFlagEnabled(
  'alertChannelPerSeverityApplicationSaEnabled'
);
export const alertChannelPerSeverityWebsiteSaEnabled = isFeatureFlagEnabled('alertChannelPerSeverityWebsiteSaEnabled');
export const alertChannelPerSeverityMobileAppSaEnabled = isFeatureFlagEnabled(
  'alertChannelPerSeverityMobileAppSaEnabled'
);
export const alertChannelPerSeverityLogSaEnabled = isFeatureFlagEnabled('alertChannelPerSeverityLogSaEnabled');
export const perEntityInfraSmartAlertsEnabled = isFeatureFlagEnabled('perEntityInfraSmartAlertsEnabled');

export const regexMetricSelectionEnabled = isFeatureFlagEnabled('regexMetricSelectionEnabled');

export const autoFormatterTimeSeriesEnabled = isFeatureFlagEnabled('autoFormatterTimeSeriesEnabled');

export const multiGroupTimeSeriesEnabled = isFeatureFlagEnabled('multiGroupTimeSeriesEnabled');

export const zoomWidgetEnabled = isFeatureFlagEnabled('zoomWidgetEnabled');

export const lastValueForNonTimeSeriesWidgetEnabled = isFeatureFlagEnabled('lastValueForNonTimeSeriesWidgetEnabled');

export const logSmartAlertsEnabled = isFeatureFlagEnabled('logSmartAlertsEnabled');

export const weaselSubresourceIntegrityEnabled = isFeatureFlagEnabled('weaselSubresourceIntegrityEnabled');

//New Smart alert Design implementation

export const applicationSmartAlertFullScreenDesignEnabled = isFeatureFlagEnabled(
  'applicationSmartAlertFullScreenDesignEnabled'
);

export const applicationSmartAlertDialogView = isFeatureFlagEnabled('applicationSmartAlertDialogView');

// infra SA full screen design
export const infraSmartAlertFullScreenDesignEnabled = isFeatureFlagEnabled('infraSmartAlertFullScreenDesignEnabled');
// Full screen design for Log SA
export const logSmartAlertFullScreenDesignEnabled = isFeatureFlagEnabled('logSmartAlertFullScreenDesignEnabled');
// Full screen design for Synthetic SA
export const syntheticSmartAlertFullScreenDesignEnabled = isFeatureFlagEnabled(
  'syntheticSmartAlertFullScreenDesignEnabled'
);

// websites SA full screen design
export const websitesSmartAlertFullScreenDesignEnabled = isFeatureFlagEnabled(
  'websitesSmartAlertFullScreenDesignEnabled'
);

// mobile app SA full screen design
export const mobileAppSmartAlertFullScreenDesignEnabled = isFeatureFlagEnabled(
  'mobileAppSmartAlertFullScreenDesignEnabled'
);

// Dialog view default for all smart alert
export const isSmartAlertDialogViewDefaultEnabled = isFeatureFlagEnabled('isSmartAlertDialogViewDefaultEnabled');

// Dialog view for log smart alert
export const logSmartAlertDialogViewEnabled = isFeatureFlagEnabled('logSmartAlertDialogViewEnabled');

// SA carbon table
export const smartAlertCarbonTableEnabled = isFeatureFlagEnabled('smartAlertCarbonTableEnabled');

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
export const bizopsProcessIdColumnEnabled = isFeatureFlagEnabled('bizopsProcessIdColumnEnabled');
export const bizopsGenAIEnabled = isFeatureFlagEnabled('bizopsGenAIEnabled');
export const bizopsProcessFlowMapEnabled = isFeatureFlagEnabled('bizopsProcessFlowMapEnabled');
export const bizopsProcessFlowMapHealthOverlayEnabled = isFeatureFlagEnabled(
  'bizopsProcessFlowMapHealthOverlayEnabled'
);
export const bizopsCustomDashboardEnabled = isFeatureFlagEnabled('bizopsCustomDashboardEnabled');
export const bizopsVersionColumnEnabled = isFeatureFlagEnabled('bizopsVersionColumnEnabled');

// ########################################################################################
// Chart gap hiding
// ########################################################################################
export const allowedMillisGapsInOneSecondResolution = 20000;

// Charts will hide small gaps in timeseries data to account for infrastructure hiccups and delays.
// For example, the following configuration will hide up to 11.5s of missing data points.
// rollup = 5s
export const allowedMultiplesOfRollupSizeMissingInCharts = 4;

export const perSecondAggregationEnabled = isFeatureFlagEnabled('perSecondAggregationEnabled', false);

export const actionAutomationEnabled = isFeatureFlagEnabled('actionAutomationEnabled', false);

export const pluginMetricStatisticsEnabled = isFeatureFlagEnabled('pluginMetricStatisticsEnabled', false);

export const controlPlaneEnabled = isFeatureFlagEnabled('controlPlaneEnabled', false);
export const kubecostEnabled = isFeatureFlagEnabled('kubecostEnabled', true);

export const limitVisibleNestingLevelsInTraceEnabled = isFeatureFlagEnabled(
  'limitVisibleNestingLevelsInTraceEnabled',
  false
);

export const kongEnabled = isFeatureFlagEnabled('kongEnabled', false);

export const playwithEnabled = isFeatureFlagEnabled('playwithEnabled', false);
export const assistmeEnabled = isFeatureFlagEnabled('assistmeEnabled', false);
// Recurrent Maintenance Window Flag
export const recurrentMaintenanceWindowEnabled = isFeatureFlagEnabled('recurrentMaintenanceWindowsEnabled', true);
export const recurrentMaintenanceWindowsTabsEnabled = isFeatureFlagEnabled(
  'recurrentMaintenanceWindowsTabsEnabled',
  false
);
export const syntheticsFilterForMaintenanceWindowsEnabled = isFeatureFlagEnabled(
  'syntheticsFilterForMaintenanceWindowsEnabled',
  true
);
export const retriggerOpenAlertsEnabled = isFeatureFlagEnabled('retriggerOpenAlertsEnabled', false);

export const systemRuleEntityCountEnabled = isFeatureFlagEnabled('systemRuleEntityCountEnabled', false);

export const userSettingsThemeEnabled = isFeatureFlagEnabled('userSettingsThemeEnabled', false);

export const oneMinuteGranularityForStaticThresholdEnabled = isFeatureFlagEnabled(
  'oneMinuteGranularityForStaticThresholdEnabled',
  true
);
export const playwithTestEnabled = isFeatureFlagEnabled('playwithTestEnabled', false);
export const playWithReleaseEnabled = isFeatureFlagEnabled('playWithReleaseEnabled', false);

export const rcaUIEnabled = isFeatureFlagEnabled('rcaUIEnabled', true);
export const rcaLogsEnabled = isFeatureFlagEnabled('rcaLogsEnabled', true);
export const rcaFailedStateEnabled = isFeatureFlagEnabled('rcaFailedStateEnabled', false);
export const rcaTopologyEnabled = isFeatureFlagEnabled('rcaTopologyEnabled', false);
export const eventFeedbackEnabled = isFeatureFlagEnabled('eventFeedbackEnabled', true);
export const incidentSummarizationEnabled = isFeatureFlagEnabled('incidentSummarizationEnabled', false);
export const eventsAIChatEnabled = isFeatureFlagEnabled('eventsAIChatEnabled', false);
export const disableEventConfigEnabled = isFeatureFlagEnabled('disableEventConfigEnabled', true);

export const flowMapEnabled = isFeatureFlagEnabled('flowMapEnabled', true);

export const agentInstallationV2Enabled = isFeatureFlagEnabled('agentInstallationV2Enabled', false);

export const serviceNowAdvancedEnabled = isFeatureFlagEnabled('serviceNowAdvancedEnabled', true);
export const automationActionInstanceFeedbackEnabled = isFeatureFlagEnabled(
  'automationActionInstanceFeedbackEnabled',
  false
);
export const multiCloseEnabled = isFeatureFlagEnabled('multiCloseEnabled', false);
export const resourceOptimizationActionsEnabled = isFeatureFlagEnabled('resourceOptimizationActionsEnabled', true);
export const analyzeRelatedInstancesButtonEnabled = isFeatureFlagEnabled('analyzeRelatedInstancesButtonEnabled', false);
export const maxMetricsLimitForBeeinstanaEnabled = isFeatureFlagEnabled('maxMetricsLimitForBeeinstanaEnabled', false);
export const serverSideInfraTagSearchEnabled = isFeatureFlagEnabled('serverSideInfraTagSearchEnabled', false);
export const preAggregatedMetricsQueryEnabled = isFeatureFlagEnabled('preAggregatedMetricsQueryEnabled', false);
export const userProfileMenuEnabled = isFeatureFlagEnabled('userProfileMenuEnabled', true);
export const unitForInfraMetricsEnabled = isFeatureFlagEnabled('unitForInfraMetricsEnabled', false);
export const graphViewFromAboutInstanaEnabled = isFeatureFlagEnabled('graphViewFromAboutInstanaEnabled', false);
export const graphViewFromInfraMapEnabled = isFeatureFlagEnabled('graphViewFromInfraMapEnabled', false);
export const extrapolateMissingStackedAreaValuesEnabled = isFeatureFlagEnabled('extrapolateMissingStackedAreaValues');
export const automationActionAiGenerationUnitEnabled = isFeatureFlagEnabled(
  'automationActionAiGenerationUnitEnabled',
  false
);
export const graphTabEnabled = isFeatureFlagEnabled('graphTabEnabled', true);
export const applicationSubtracesEnabled = isFeatureFlagEnabled('applicationSubtracesEnabled', false);
export const applicationSaveFiltersEnabled = isFeatureFlagEnabled('applicationSaveFiltersEnabled', false);
export const customDashboardTopLevelFiltersEnabled = isFeatureFlagEnabled(
  'customDashboardTopLevelFiltersEnabled',
  false
);
export const aqmDisableConfigOnEventViewEnabled = isFeatureFlagEnabled('aqmDisableConfigOnEventViewEnabled', false);
export const aqmDataGridEventTableEnabled = isFeatureFlagEnabled('aqmDataGridEventTableEnabled', false);
export const openTelemetryKubernetes = isFeatureFlagEnabled('openTelemetryKubernetesEnabled', false);
export const rbacTeamsEnabled = isFeatureFlagEnabled('rbacTeamsEnabled', false);
export const accessControlCarbonTable = isFeatureFlagEnabled('accessControlCarbonTable', false);
export const idpConfigV2Enabled = isFeatureFlagEnabled('idpConfigV2Enabled', false);
export const sloLiteEnabled = isFeatureFlagEnabled('sloLiteEnabled', false);
export const sloFullEnabled = isFeatureFlagEnabled('sloFullEnabled', true);
export const tealiumPrivacyEnabled = isFeatureFlagEnabled('tealiumPrivacyEnabled', false);
