export const configuredForecasts = [
  {
    snapshotId: 'P9wdg-O_QgPAOgiqtk_ErPIUAzs',
    metricName: 'count',
    name: 'shop model',
    sensitivity: '99',
    lastUpdate: Date.now()
  },
  {
    snapshotId: '0J6HRMZ4S94oAsBBy9bIVAOppeI',
    metricName: 'duration.mean',
    name: 'doesntexist model',
    sensitivity: '95',
    lastUpdate: Date.now() - 1000 * 60
  }
];

export function getConfiguredMetrics(snapshotId) {
  const metrics = [];

  for (let i = 0, length = configuredForecasts.length; i < length; i++) {
    const config = configuredForecasts[i];
    if (config.snapshotId === snapshotId) {
      metrics.push(config.metricName);
    }
  }

  return metrics;
}
