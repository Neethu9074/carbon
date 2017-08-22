const configuredForecasts = {
  'P9wdg-O_QgPAOgiqtk_ErPIUAzs': {
    metrics: ['count']
  },
  '0J6HRMZ4S94oAsBBy9bIVAOppeI': {
    metrics: ['duration.mean']
  }
};

export function getConfiguredMetrics(snapshotId) {
  const config = configuredForecasts[snapshotId];
  return config ? config.metrics : config;
}
