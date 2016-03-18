const theConfig = window.instana.config;

export default theConfig;

export const config = theConfig;

export function isProductionEnvironment() {
  return theConfig.environment !== 'demo';
}

export function isDemoEnvironment() {
  return theConfig.environment === 'demo';
}

export function isInternalEnvironment() {
  return theConfig.environment === 'internal';
}
