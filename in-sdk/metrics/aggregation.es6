const statAggregationMetricSuffixes = ['.mean', '.min', '.25th', '.50th', '.75th', '.95th', '.98th', '.99th', '.max'];

const defaultAggregation = 'mean';
const dynamicAggregationDefinitions = [
  {
    regex: /^endpoint\..*\.duration\.(mean|min|25th|50th|75th|95th|98th|99th|max)+$/i,
    aggregation: 'stats'
  },
  {
    regex: /^endpoint\..*\.count$/i,
    aggregation: 'sum'
  }
];
const aggregationDefinitions = {
  // standard KPI metrics
  // 'count': 'sum',
  // 'error_count': 'sum',
  // 'duration.min': 'stats',
  // 'duration.25th': 'stats',
  // 'duration.50th': 'stats',
  // 'duration.75th': 'stats',
  // 'duration.95th': 'stats',
  // 'duration.98th': 'stats',
  // 'duration.99th': 'stats',
  // 'duration.max': 'stats',
};

setAggregation('count', 'sum');
setAggregation('error_count', 'sum');
setStatAggregation('duration');

export function setAggregation(metric, aggregation) {
  aggregationDefinitions[metric] = aggregation;
}

export function setStatAggregation(metric) {
  for (let i = 0, len = statAggregationMetricSuffixes.length; i < len; i++) {
    const suffix = statAggregationMetricSuffixes[i];
    setAggregation(metric + suffix, 'stats');
  }
}

export function setDynamicAggregation(metricMatcher, aggregation) {
  dynamicAggregationDefinitions.push({
    regex: metricMatcher,
    aggregation
  });
}

export function getAggregation(metric) {
  const definition = aggregationDefinitions[metric];
  if (definition) {
    return definition;
  }

  for (let i = 0, length = dynamicAggregationDefinitions.length; i < length; i++) {
    const dynamicDefinition = dynamicAggregationDefinitions[i];
    if (metric.match(dynamicDefinition.regex)) {
      return dynamicDefinition.aggregation;
    }
  }

  return defaultAggregation;
}
