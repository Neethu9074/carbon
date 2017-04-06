import { config } from 'in-services/config';

const onlyInternally = config.tenant === 'instana' &&
  config.environment !== 'staging' &&
  config.tenantUnit !== 'current' &&
  !config.tenantUnit.indexOf('training') === 0;

export const instanaInternalFeaturesEnabled = onlyInternally;

export const webVrEnabled = onlyInternally;
export const eumStatisticsEnabled = onlyInternally;
export const logViewEnabled = onlyInternally;
export const objectivesEnabled = onlyInternally;
export const roleViewFilterEnabled = onlyInternally;
export const cockpitEnabled = false;

// hide the following trace type auto completions: iosError, ios, android, androidError, xRay, python
export const blackListedSearchFieldKeywords = ['log', 'span.content'];
export const blackListedSearchFieldValues = {
  'trace.type': ['ios', 'ios.error', 'android', 'android.error', 'xRay', 'python']
};
