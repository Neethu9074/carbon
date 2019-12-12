import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    label: 'Gauges',
    metric: getMetricMatch('metrics', 'gauges'),
    formatter: siPrefix
  },
  {
    label: 'Counters',
    metric: getMetricMatch('metrics', 'counters'),
    formatter: siPrefix
  }
];
