import { isInstanaEmail, isInstanaEngineer } from 'in-stores/user';
import { config, isFeatureFlagEnabled } from 'in-services/config';

// ########################################################################################
// Reusable helpers for feature (de-) activation
// ########################################################################################
const stagingTu = config.tenant === 'instana' && config.tenantUnit === 'staging';
const currentTu = config.tenant === 'instana' && config.tenantUnit === 'current';
// const monitoringTu = config.tenant === 'instana' && config.tenantUnit === 'monitoring';
// const testTu = config.tenant === 'instana' && config.tenantUnit === 'test';
// const loadTu = config.tenant === 'instana' && config.tenantUnit === 'load';
const trainingTu = config.tenant === 'training';

const onlyInternally =
  __DEV__ || (config.tenant === 'instana' && config.tenantUnit === 'test') || config.tenant === 'instanaops';
const betaInstanaTus = onlyInternally || config.tenant === 'instana';

// ########################################################################################
// Regular feature flags
// ########################################################################################
export const instanaInternalFeaturesEnabled = onlyInternally;
export const roleViewFilterEnabled = onlyInternally;
export const cockpitEnabled = false;
export const newServiceDashboardsEnabled = false;
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
export const unifiedAlerting = isFeatureFlagEnabled('unifiedAlerting');
export const trackUrlPathChanges = isFeatureFlagEnabled('trackUrlPathChanges');
export const containerInfoEnabled = isFeatureFlagEnabled('containerInfoEnabled');

// ########################################################################################
// 2.0 versus 1.0 feature flags (plus hybrid mode/beta phase)
// ########################################################################################

// oneZeroAppDataEnabled is the deployment time feature flag that controls whether or not Instana 1.0 could possibly be
// shown. During the beta phase (when both oneZeroAppDataEnabled and twoZeroAppDataEnabled are true at the same time),
// the actual presentation of the Instana UI (1.0 or 2.0) depends on the the current mode that in turn depends on the
// v2 query param and/or the v2Enabled ui setting  of the current user.
export const oneZeroAppDataEnabled = isFeatureFlagEnabled('oneZeroAppDataPresentationEnabled');
export const oneZeroSupportedUntilMessageEnabled = isFeatureFlagEnabled('oneZeroSupportedUntilMessageEnabled', true);

// twoZeroAppDataPresentationEnabled is the deployment time feature flag that controls whether or not Instana 2.0 could possibly be
// shown. During the beta phase (when both oneZeroAppDataEnabled and twoZeroAppDataEnabled are true at the same time),
// the actual presentation of the Instana UI (1.0 or 2.0) depends on the the current mode that in turn depends on the
// v2 query param and/or the v2Enabled ui setting of the current user.
export const twoZeroAppDataEnabled =
  isFeatureFlagEnabled('twoZeroAppDataPresentationEnabled') ||
  (isFeatureFlagEnabled('twoZeroAppDataEnabled') && isInstanaEngineer);

export const twoZeroLearnMoreButtonEnabled = isFeatureFlagEnabled('twoZeroLearnMoreButtonEnabled');
export const particlesInFlowMapEnabled = isFeatureFlagEnabled('particlesInFlowMapEnabled');

export const isSelfService = isFeatureFlagEnabled('isSelfService');

export const isTwoZeroBetaPhase = oneZeroAppDataEnabled && twoZeroAppDataEnabled;

const v2EnabledUserPreference =
  window.instana.settings && window.instana.settings.v2Enabled != null ? window.instana.settings.v2Enabled : false;
const v2EnabledViaQueryParam = window.location.hash && window.location.hash.indexOf('v2=true') >= 0;
const v2DisabledViaQueryParam = window.location.hash && window.location.hash.indexOf('v2=false') >= 0;

// twoZeroModeEnabled controls the actual Instana mode (1.0 or 2.0) for the user given the value of the v2 query
// parameter and user's v2Enabled ui setting.
export const twoZeroModeEnabled =
  // tenant not in beta phase, only 2.0 available
  (!oneZeroAppDataEnabled && twoZeroAppDataEnabled) ||
  // tenant in beta phase and 2.0 specified via URL query param
  (oneZeroAppDataEnabled && twoZeroAppDataEnabled && v2EnabledViaQueryParam) ||
  // tenant in beta phase, 1.0/2.0 not specified via URL query param, 2.0 enabled in user's ui settings.
  (oneZeroAppDataEnabled && twoZeroAppDataEnabled && !v2DisabledViaQueryParam && v2EnabledUserPreference);

// ########################################################################################
// Dynamic focus keywords
// ########################################################################################
export function getBlackListedSearchFieldKeywords(searchContext) {
  if (twoZeroModeEnabled && searchContext !== 'traces') {
    return ['log', 'span', 'trace'];
  } else {
    return ['log'];
  }
}
export const blackListedSearchFieldValues = {
  'trace.type': ['ios', 'iosError', 'android', 'androidError', 'xRay', 'python'],
  'span.type': ['ios', 'iosError', 'android', 'androidError', 'xRay', 'python'],
  'event.type': ['objectiveViolation', 'event', 'changeDetected', 'changeAndPresence'],
  'entity.type': ['agent']
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
