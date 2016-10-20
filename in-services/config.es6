const theConfig = window.instana.config;

export default theConfig;

export const config = theConfig;

export function isInternalEnvironment() {
  return theConfig.environment === 'internal';
}

export function isOnPremise() {
  return theConfig.operationMode === 'on-prem';
}

export function isInstanaTenant() {
  return config.tenant === 'instana';
}
