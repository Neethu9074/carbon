import { millis, number, percentagePlain } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [getMetricMatch('jobs', 'lastBuildStatus')],
    labels: ['Status of the last build'],
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('jobs', 'healthScore'),
    label: 'Health status of recent builds',
    min: 0,
    formatter: percentagePlain
  },
  {
    metric: getMetricMatch('jobs', 'lastBuildNumber'),
    label: 'Last build number',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('jobs', 'lastBuildDuration'),
    label: 'Last build duration',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('jobs', 'lastBuildEstimatedDuration'),
    label: 'Last build estimated duration',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('jobs', 'lastBuildTimestamp'),
    label: 'Last build timestamp',
    min: 0,
    formatter: millis
  }
];
