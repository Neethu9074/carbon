import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Sessions',
    metric: getMetricMatch('sessions', 'activeSessions'),
    formatter: number.compact
  },
  {
    label: 'Average Response Time',
    metric: getMetricMatch('servlets', 'avgResponseTime'),
    formatter: millis.compact
  }
];
