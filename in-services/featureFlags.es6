import { isInstanaEmployee } from 'in-stores/user';
import { config } from 'in-services/config';

const stagingTu = config.tenant === 'instana' && config.tenantUnit === 'staging';
const currentTu = config.tenant === 'instana' && config.tenantUnit === 'current';
const releaseTu = config.tenant === 'instana' && config.tenantUnit === 'release';
const trainingTu = config.tenant === 'training';
const onlyInternally =
  __DEV__ || (config.tenant === 'instana' && !stagingTu && !currentTu && !trainingTu && !releaseTu);

export const instanaInternalFeaturesEnabled = onlyInternally;
export const logViewEnabled = false;
export const objectivesEnabled = onlyInternally;
export const roleViewFilterEnabled = onlyInternally;
export const traceAnalyticsEnabled = false;
export const cockpitEnabled = false;
export const kubernetesEnabled = false;
export const agentNotificationsEnabled = false;
export const newServiceDashboardsEnabled = onlyInternally;
export const forecastsEnabled = config.tenant === 'edmunds' || onlyInternally;

export const blackListedSearchFieldKeywords = ['log'];
export const blackListedSearchFieldValues = {
  'trace.type': ['ios', 'iosError', 'android', 'androidError', 'xRay', 'python'],
  'span.type': ['ios', 'iosError', 'android', 'androidError', 'xRay', 'python'],
  'event.type': ['objectiveViolation', 'event'],
  'entity.type': ['agent']
};

// Charts will hide small gaps in timeseries data to account for infrastructure hiccups and delays.
// For example, the following configuration will hide up to 2.3s of missing data points.
// rollup = 1s
// allowedMultiplesOfRollupSizeMissingInCharts = 2.3
export const allowedMultiplesOfRollupSizeMissingInCharts =
  onlyInternally || (isInstanaEmployee() && !stagingTu && !currentTu && !trainingTu) ? 2.3 : 4;

export const maximumNumberOfTracesForAnalytics = 40;
