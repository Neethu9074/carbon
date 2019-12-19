import { twoDecimalPlaces } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    label: 'Accepted Connections',
    metric: getMetricMatch('worker_pool', 'accepted_conn'),
    formatter: twoDecimalPlaces
  },
  {
    label: 'Active Processes',
    metric: getMetricMatch('worker_pool', 'active_processes'),
    formatter: twoDecimalPlaces
  }
];
