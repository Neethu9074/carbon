import { percentage, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getMetricMatch('core_stats', 'avg_requests'),
    label: 'Average Requests',
    min: 0,
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'avg_time_request'),
    label: 'Average Request Time',
    min: 0,
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'lookups'),
    label: 'Lookups',
    min: 0,
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'hitratio'),
    label: 'Hit-rate',
    min: 0,
    formatter: percentage,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'inserts'),
    label: 'Inserts',
    min: 0,
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'evictions'),
    label: 'Evictions',
    min: 0,
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'errors'),
    label: 'Errors',
    min: 0,
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'timeouts'),
    label: 'Timeouts',
    min: 0,
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'docs_added'),
    label: 'Documents added',
    min: 0,
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('core_stats', 'docs_pending'),
    label: 'Documents pending',
    min: 0,
    formatter: number,
    isAvailable
  }
];

function isAvailable(snapshot) {
  return snapshot.getIn(['data', 'version'], false);
}
