const defaultAggregation = 'mean';
const aggregationDefinitions = {
  // standard KPI metrics
  'count': 'sum',
  'error_count': 'sum',
  'duration.mean': 'stats',
  'duration.min': 'stats',
  'duration.25th': 'stats',
  'duration.50th': 'stats',
  'duration.75th': 'stats',
  'duration.95th': 'stats',
  'duration.98th': 'stats',
  'duration.99th': 'stats',
  'duration.max': 'stats'
};

export function setAggregation(metric, aggregation) {
  aggregationDefinitions[metric] = aggregation;
}

export function getAggregation(metric) {
  return aggregationDefinitions[metric] || defaultAggregation;
}
