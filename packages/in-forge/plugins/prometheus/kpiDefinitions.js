import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    label: 'Counters',
    metric: getMetricMatch('metrics', 'counters'),
    formatter: siPrefix
  },
  {
    label: 'Gauges',
    metric: getMetricMatch('metrics', 'gauges'),
    formatter: siPrefix
  }
];
