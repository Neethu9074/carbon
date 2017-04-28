import { config } from 'in-services/config';

const onlyInternally =
  config.tenant === 'instana' &&
  config.environment !== 'staging' &&
  config.tenantUnit !== 'current' &&
  config.tenantUnit.indexOf('training') === -1;

export const instanaInternalFeaturesEnabled = onlyInternally;

export const webVrEnabled = onlyInternally;
export const logViewEnabled = onlyInternally;
export const objectivesEnabled = onlyInternally;
export const roleViewFilterEnabled = onlyInternally;
export const cockpitEnabled = false;

export const blackListedSearchFieldKeywords = ['log'];
export const blackListedSearchFieldValues = {
  'trace.type': ['ios', 'iosError', 'android', 'androidError', 'xRay', 'python'],
  'event.type': ['objectiveViolation'],
  'entity.type': ['agent']
};

// Charts will hide small gaps in timeseries data to account for infrastructure hiccups and delays.
// For example, the following configuration will hide up to 2.3s of missing data points.
// rollup = 1s
// allowedMultiplesOfRollupSizeMissingInCharts = 2.3
export const allowedMultiplesOfRollupSizeMissingInCharts = config.tenant === 'edmunds' ? 50 : 2.3;
