import { number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    label: 'Total Requests',
    metric: getMetricMatch('siteperf', 'total_requests'),
    formatter: number.compact
  },
  {
    label: 'Current Connections',
    metric: getMetricMatch('siteperf', 'current_connections'),
    formatter: number.compact
  }
];
