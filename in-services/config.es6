const theConfig = window.instana.config;

export default theConfig;

export const config = theConfig;

export function isProductionEnvironment() {
  return window.instana.config.environment !== 'demo';
}

export function isDemoEnvironment() {
  return window.instana.config.environment === 'demo';
}
