import { isInstanaEmployee } from 'in-stores/user';
import { config } from 'in-services/config';

const stagingTu = config.tenant === 'instana' && config.tenantUnit === 'staging';
const currentTu = config.tenant === 'instana' && config.tenantUnit === 'current';
const releaseTu = config.tenant === 'instana' && config.tenantUnit === 'release';
// const monitoringTu = config.tenant === 'instana' && config.tenantUnit === 'monitoring';
// const testTu = config.tenant === 'instana' && config.tenantUnit === 'test';
// const loadTu = config.tenant === 'instana' && config.tenantUnit === 'load';
const trainingTu = config.tenant === 'training';
const onlyInternally =
  __DEV__ || (config.tenant === 'instana' && !stagingTu && !currentTu && !trainingTu && !releaseTu);
const betaInstanaTus = onlyInternally || config.tenant === 'instana';

export const instanaInternalFeaturesEnabled = onlyInternally;
export const roleViewFilterEnabled = onlyInternally;
export const cockpitEnabled = false;
export const agentNotificationsEnabled = false;
export const newServiceDashboardsEnabled = onlyInternally;
export const forecastsEnabled = config.tenant === 'edmunds' || betaInstanaTus;

export const blackListedSearchFieldKeywords = ['log'];
export const blackListedSearchFieldValues = {
  'trace.type': ['ios', 'iosError', 'android', 'androidError', 'xRay', 'python'],
  'span.type': ['ios', 'iosError', 'android', 'androidError', 'xRay', 'python'],
  'event.type': ['objectiveViolation', 'event', 'changeDetected'],
  'entity.type': ['agent']
};

export const allowedMillisGapsInOneSecondResolution =
  onlyInternally || (isInstanaEmployee() && !stagingTu && !currentTu && !trainingTu) ? 2300 : 20000;
// Charts will hide small gaps in timeseries data to account for infrastructure hiccups and delays.
// For example, the following configuration will hide up to 11.5s of missing data points.
// rollup = 5s
// allowedMultiplesOfRollupSizeMissingInCharts = 2.3
export const allowedMultiplesOfRollupSizeMissingInCharts =
  onlyInternally || (isInstanaEmployee() && !stagingTu && !currentTu && !trainingTu) ? 2.3 : 4;
