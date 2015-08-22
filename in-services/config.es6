const config = window.instana.config;

export default config;

export function isProductionEnvironment() {
  return instana.config.environment !== 'demo';
}

export function isDemoEnvironment() {
  return instana.config.environment === 'demo';
}
