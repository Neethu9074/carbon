import { millis, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    label: 'Average Requests',
    metric: getMetricMatch('core_stats', 'avg_requests'),
    formatter: number.compact
  },
  {
    label: 'Average Request Time',
    metric: getMetricMatch('core_stats', 'avg_time_request'),
    formatter: millis.detailed
  }
];
