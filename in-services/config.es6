const theConfig = window.instana.config;

export default theConfig;

export const config = theConfig;

export function isProductionEnvironment() {
  return !isDemoEnvironment();
}

export function isDemoEnvironment() {
  return theConfig.environment === 'demo' &&
    theConfig.tenantUnit === 'demo' &&
    theConfig.tenant === 'instana';
}

export function isInternalEnvironment() {
  return theConfig.environment === 'internal';
}
