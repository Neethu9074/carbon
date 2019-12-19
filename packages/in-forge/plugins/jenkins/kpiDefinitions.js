import { number, percentagePlain } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    label: 'Status of Last Build',
    metric: getMetricMatch('jobs', 'lastBuildStatus'),
    formatter: number.compact
  },
  {
    label: 'Health of Recent Builds',
    metric: getMetricMatch('jobs', 'healthScore'),
    formatter: percentagePlain
  }
];
