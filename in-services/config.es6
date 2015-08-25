const config = window.instana.config;

export default config;

export function isProductionEnvironment() {
  return window.instana.config.environment !== 'demo';
}

export function isDemoEnvironment() {
  return window.instana.config.environment === 'demo';
}
