import { isInstanaEmail, isInstanaEngineer } from 'in-stores/user';
import { config, isFeatureFlagEnabled } from 'in-services/config';

// ########################################################################################
// Reusable helpers for feature (de-) activation
// ########################################################################################
const stagingTu = config.tenant === 'instana' && config.tenantUnit === 'staging';
const currentTu = config.tenant === 'instana' && config.tenantUnit === 'current';
const trainingTu = config.tenant === 'training';

const onlyInternally =
  __DEV__ || (config.tenant === 'instana' && config.tenantUnit === 'test') || config.tenant === 'instanaops';
const betaInstanaTus = onlyInternally || config.tenant === 'instana';

// ########################################################################################
// Regular feature flags
// ########################################################################################
export const instanaInternalFeaturesEnabled = onlyInternally;
export const roleViewFilterEnabled = onlyInternally;
export const forecastsEnabled = config.tenant === 'edmunds' || config.tenant === 'tipico' || betaInstanaTus;
export const tenantSwitcherEnabled = isFeatureFlagEnabled('tenantSwitcherEnabled');
export const releaseNotesEnabled = isFeatureFlagEnabled('releaseNotesEnabled');
export const maintenanceNotesEnabled = isFeatureFlagEnabled('maintenanceNotesEnabled');
export const useInstanaSaasEumTrackingUrlEnabled = isFeatureFlagEnabled('useInstanaSaasEumTrackingUrlEnabled');
export const onPremLicenseInformationEnabled = isFeatureFlagEnabled('onPremLicenseInformationEnabled');
export const isUsageInfoPopupEnabled = isFeatureFlagEnabled('isUsageInfoPopupEnabled', true);
export const kubernetesEnabled = isInstanaEngineer || isFeatureFlagEnabled('isKubernetesV2Enabled');
export const customEventsInWebsiteMonitoringEnabled = isFeatureFlagEnabled('customEventsInWebsiteMonitoringEnabled');
export const lastSevenDaysTimePresetEnabled = isFeatureFlagEnabled('lastSevenDaysTimePresetEnabled', true);
export const containerInfoEnabled = isFeatureFlagEnabled('containerInfoEnabled');
export const internalMonitoringUnit = isFeatureFlagEnabled('internalMonitoringUnit');
export const isAdhocMetricAggregationEnabled = isFeatureFlagEnabled('isAdhocMetricAggregationEnabled');
export const isRbacEnabled = isFeatureFlagEnabled('isRbacEnabled');
export const samplingIndicatorEnabled = isFeatureFlagEnabled('samplingIndicatorEnabled');
export const customDashboardsEnabled = isFeatureFlagEnabled('customDashboardsEnabled');
export const unmonitoredHostsEnabled = isFeatureFlagEnabled('unmonitoredHostsEnabled', true);
export const javaScriptStackTraceTranslationEnabled = isFeatureFlagEnabled(
  'javaScriptStackTraceTranslationEnabled',
  false
);

export const isSelfService = isFeatureFlagEnabled('isSelfService');

// ########################################################################################
// Dynamic focus keywords
// ########################################################################################
export function getBlackListedSearchFieldKeywords() {
  return ['selfMonitoring'];
}
export const blackListedSearchFieldValues = {
  'event.type': ['objectiveViolation', 'event', 'changeDetected', 'changeAndPresence'],
  'entity.type': ['agent'],
  'entity.selfType': ['steadyMetrics', 'tenantUnit', 'agentStatistics', 'entityStatistics']
};

// ########################################################################################
// Chart gap hiding
// ########################################################################################
export const allowedMillisGapsInOneSecondResolution =
  onlyInternally || (isInstanaEngineer && !stagingTu && !currentTu && !trainingTu) ? 2300 : 20000;

// Charts will hide small gaps in timeseries data to account for infrastructure hiccups and delays.
// For example, the following configuration will hide up to 11.5s of missing data points.
// rollup = 5s
// allowedMultiplesOfRollupSizeMissingInCharts = 2.3
export const allowedMultiplesOfRollupSizeMissingInCharts =
  onlyInternally || (isInstanaEngineer && !stagingTu && !currentTu && !trainingTu) ? 2.3 : 4;

//Flag which exposes the download button - enables the download of metrics from event view
export const allowDownloadMetricsFromCharts = isInstanaEmail && !currentTu;

// #####################################################################################################################
// TL;DR: Some tenants have a lot of rule bindings and rules. Loading the rule bindings settings page makes two http
// requests per rule binding. Users working with these pages a lot run into the API limit. This feature flag disables
// these http requests.
//
// This is a stop gap measure and can be removed after the merging of rules and rule bindings into event specifications.
//
// See https://instana.slack.com/archives/GC1J42ZSR/p1550591400029100 or ask the Stan team for details.
// #####################################################################################################################
export const ruleDeprecationValidationChecksEnabled = isFeatureFlagEnabled('ruleDeprecationValidationChecksEnabled');

export const addStaticJsonPayloadToEventsConfig = config.tenant === 'adptemp';
