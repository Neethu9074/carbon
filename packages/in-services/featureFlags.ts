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
export const assistmeEnabled = isFeatureFlagEnabled('assistmeEnabled', false);
export const ampEnabled = isFeatureFlagEnabled('ampEnabled', true);
export const pcfEnabled = isFeatureFlagEnabled('pcfEnabled');
export const phmcEnabled = isFeatureFlagEnabled('phmcEnabled');
export const vsphereEnabled = isFeatureFlagEnabled('vsphereEnabled');
export const openstackEnabled = isFeatureFlagEnabled('openstackEnabled');
export const zhmcEnabled = isFeatureFlagEnabled('zhmcEnabled');
export const powervcEnabled = isFeatureFlagEnabled('powervcEnabled');
export const sapEnabled = isFeatureFlagEnabled('sapEnabled');
export const loggingEnabled = isFeatureFlagEnabled('loggingEnabled');
export const logWidgetsEnabled = isFeatureFlagEnabled('logWidgetsEnabled');
export const logVolumePageEnabled = isFeatureFlagEnabled('logVolumePageEnabled');
export const logHomepageEnabled = isFeatureFlagEnabled('logHomepageEnabled');
export const carbonPillEnabled = isFeatureFlagEnabled('carbonPillEnabled');
export const logRetentionPageEnabled = isFeatureFlagEnabled('logRetentionPageEnabled');
export const notesAndActivityEnabled = isFeatureFlagEnabled('notesAndActivityEnabled');
export const carbonIconButtonEnabled = isFeatureFlagEnabled('carbonIconButtonEnabled');
export const carbonMoreMenuEnabled = isFeatureFlagEnabled('carbonMoreMenuEnabled');
export const carbonContentSwitcherEnabled = isFeatureFlagEnabled('carbonContentSwitcherEnabled');
export const carbonTabsEnabled = isFeatureFlagEnabled('carbonTabsEnabled');
export const carbonButtonEnabled = isFeatureFlagEnabled('carbonButtonEnabled', false);
export const carbonDescriptionListEnabled = isFeatureFlagEnabled('carbonDescriptionListEnabled');
export const carbonTooltipEnabled = isFeatureFlagEnabled('carbonTooltipEnabled');
export const carbonListEnabled = isFeatureFlagEnabled('carbonListEnabled');
export const carbonRadioButtonEnabled = isFeatureFlagEnabled('carbonRadioButtonEnabled', false);
export const carbonCheckboxEnabled = isFeatureFlagEnabled('carbonCheckboxEnabled', false);
export const carbonPaginationEnabled = isFeatureFlagEnabled('carbonPaginationEnabled');
export const carbonTableEnabled = isFeatureFlagEnabled('carbonTableEnabled');
export const carbonMenuEnabled = isFeatureFlagEnabled('carbonMenuEnabled', false);
export const carbonComboBoxEnabled = isFeatureFlagEnabled('carbonComboBoxEnabled');
export const carbonCodeEnabled = isFeatureFlagEnabled('carbonCodeEnabled');
export const carbonDateInputEnabled = isFeatureFlagEnabled('carbonDateInputEnabled');
export const carbonExpandableGroupEnabled = isFeatureFlagEnabled('carbonExpandableGroupEnabled');
export const carbonSideNavLinksEnabled = isFeatureFlagEnabled('carbonSideNavLinksEnabled');
export const carbonG10ThemeEnabled = isFeatureFlagEnabled('carbonG10ThemeEnabled');

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
export const kubernetesTeamEnabled = isFeatureFlagEnabled('kubernetesTeamEnabled', false);
export const kubernetesPrometheusMetricsEnabled = isFeatureFlagEnabled('kubernetesPrometheusMetricsEnabled', false);

export const apdexWidgetEnabled = isFeatureFlagEnabled('apdexWidgetEnabled', true);
// In self-hosted environments the feature flag had to be named differently:
// sliChClusterAccessEnabled
// compared to other places:
// sliCHClusterAccessEnabled
export const sliCHClusterAccessEnabled =
  isFeatureFlagEnabled('sliCHClusterAccessEnabled') || isFeatureFlagEnabled('sliChClusterAccessEnabled');
export const websiteSloEnabled = isFeatureFlagEnabled('websiteSloEnabled', true);
export const sloEnabled = isFeatureFlagEnabled('sloEnabled', true);
export const sloV2Enabled = isFeatureFlagEnabled('sloV2Enabled', true);
export const sloSmartAlertsEnabled = isFeatureFlagEnabled('sloSmartAlertsEnabled', true);
export const sloRebornWidgetEnabled = isFeatureFlagEnabled('sloRebornWidgetEnabled', true);
export const sloSyntheticsEnabled = isFeatureFlagEnabled('sloSyntheticsEnabled', false);

export const mobileAppCrashBeaconEnabled = isFeatureFlagEnabled('mobileAppCrashBeaconEnabled', true);
export const eumImpactedUsersForAppAlertEnabled = isFeatureFlagEnabled('eumImpactedUsersForAppAlertEnabled', false);

export const apiTokenExpirationEnabled = isFeatureFlagEnabled('apiTokenExpirationEnabled', true);

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

// Synthetic Custom Dashboard feature flag
export const syntheticCustomDashboardEnabled = isFeatureFlagEnabled('syntheticCustomDashboardEnabled');

// Synthetic Instana Hosted PoP feature flag
export const syntheticInstanaHostedPoPEnabled = isFeatureFlagEnabled('syntheticInstanaHostedPoPEnabled');

// Synthetic RBAC Limited Access feature flag
export const syntheticRbacLimitedEnabled = isFeatureFlagEnabled('syntheticRbacLimitedEnabled');

// Synthetic Credentials feature flag
export const syntheticCredentialsEnabled = isFeatureFlagEnabled('syntheticCredentialsEnabled');

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

// Infrastructure Smart Alerts
export const infraSmartAlertsEnabled = isFeatureFlagEnabled('infraSmartAlertsEnabled');
export const infraPredictiveDetectionEnabled = isFeatureFlagEnabled('infraPredictiveDetectionEnabled');
export const infraSmartAlertsPredictionsEnabled = isFeatureFlagEnabled('infraSmartAlertsPredictionsEnabled');

export const alertChannelPerSeverityInfraSaEnabled = isFeatureFlagEnabled('alertChannelPerSeverityInfraSaEnabled');

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
export const bizopsGenAIEnabled = isFeatureFlagEnabled('bizopsGenAIEnabled');
export const bizopsStandardInclusionEnabled = isFeatureFlagEnabled('bizopsStandardInclusionEnabled');
export const bizopsRbacLimitedEnabled = isFeatureFlagEnabled('bizopsRbacLimitedEnabled');
export const bizopsProcessFlowMapEnabled = isFeatureFlagEnabled('bizopsProcessFlowMapEnabled');
export const bizopsProcessStackEnabled = isFeatureFlagEnabled('bizopsProcessStackEnabled');
export const bizopsActivityStackEnabled = isFeatureFlagEnabled('bizopsActivityStackEnabled');

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
  true
);

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
export const eventFeedbackEnabled = isFeatureFlagEnabled('eventFeedbackEnabled', true);
export const incidentSummarizationEnabled = isFeatureFlagEnabled('incidentSummarizationEnabled', false);
export const manuallyCloseEventEnabled = isFeatureFlagEnabled('manuallyCloseEventEnabled', true);
export const disableEventConfigEnabled = isFeatureFlagEnabled('disableEventConfigEnabled', true);

export const flowMapEnabled = isFeatureFlagEnabled('flowMapEnabled', true);

export const enableCarbonIcons = isFeatureFlagEnabled('enableCarbonIcons', false);

export const welcomePageV2Enabled = isFeatureFlagEnabled('welcomePageV2Enabled', true);
export const shareAndInviteEnabled = isFeatureFlagEnabled('shareAndInviteEnabled', true);

export const agentInstallationV2Enabled = isFeatureFlagEnabled('agentInstallationV2Enabled', false);

export const serviceNowAutoCloseAndCustomPayloadsEnabled = isFeatureFlagEnabled(
  'serviceNowAutoCloseAndCustomPayloadsEnabled',
  false
);
export const serviceNowAdvancedEnabled = isFeatureFlagEnabled('serviceNowAdvancedEnabled', false);
export const automationActionInstanceFeedbackEnabled = isFeatureFlagEnabled(
  'automationActionInstanceFeedbackEnabled',
  false
);
export const resourceOptimizationActionsEnabled = isFeatureFlagEnabled('resourceOptimizationActionsEnabled', false);
export const carbonStepProgressBarEnabled = isFeatureFlagEnabled('carbonStepProgressBarEnabled', false);
export const carbonHorizontalIndicatorEnabled = isFeatureFlagEnabled('carbonHorizontalIndicatorEnabled', false);
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
export const carbonSliderEnabled = isFeatureFlagEnabled('carbonSliderEnabled', false);
export const customDashboardTopLevelFiltersEnabled = isFeatureFlagEnabled(
  'customDashboardTopLevelFiltersEnabled',
  false
);
