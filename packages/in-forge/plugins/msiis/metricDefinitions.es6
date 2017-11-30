import { number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getMetricMatch('siteperf', 'total_requests'),
    label: 'Total number of requests',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('siteperf', 'current_connections'),
    label: 'Current number of connections',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('siteperf', 'get_requests'),
    label: 'GET Requests',
    min: 0,
    category: ['Request'],
    formatter: number
  },
  {
    metric: getMetricMatch('siteperf', 'post_requests'),
    label: 'POST Requests',
    min: 0,
    category: ['Request'],
    formatter: number
  },
  {
    metric: getMetricMatch('siteperf', 'put_requests'),
    label: 'PUT Requests',
    min: 0,
    category: ['Request'],
    formatter: number
  },
  {
    metric: getMetricMatch('siteperf', 'bytes_sent'),
    label: 'Bytes sent',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('siteperf', 'bytes_received'),
    label: 'Bytes received',
    min: 0,
    formatter: number
  }
];
