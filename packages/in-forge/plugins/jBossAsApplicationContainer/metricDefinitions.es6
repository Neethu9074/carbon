import { millis, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getMetricMatch('sessions', 'activeSessions'),
    label: 'Active Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('servlets', 'avgResponseTime'),
    label: 'Average Response Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('servlets', 'requests'),
    label: 'Requests',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectors', 'avgResponseTime'),
    label: 'Average Response Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('connectors', 'requests'),
    label: 'Requests',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectors', 'errors'),
    label: 'Errors',
    min: 0,
    formatter: number
  }
];
