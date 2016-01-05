const theConfig = window.instana.config;

export default theConfig;

export const config = theConfig;

export function isProductionEnvironment() {
  return window.instana.config.environment !== 'demo';
}

export function isDemoEnvironment() {
  return window.instana.config.environment === 'demo';
}

export function isInstanaTenant() {
  return theConfig.tenant === 'instana';
}

export function isExperimentsEnabled() {
  return window && window.localStorage && window.localStorage.getItem('in-experiments') === 'true';
}
