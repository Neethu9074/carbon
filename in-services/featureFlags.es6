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
export const cockpitEnabled = onlyInternally;

export const blackListedSearchFieldKeywords = ['log', 'span.content'];
export const blackListedSearchFieldValues = {
  'trace.type': ['ios', 'iosError', 'android', 'androidError', 'xRay', 'python']
};
