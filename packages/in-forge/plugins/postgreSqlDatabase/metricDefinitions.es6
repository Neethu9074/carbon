import { activity, hitRate, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['totalCommittedTransactions'],
    labels: ['Committed Transactions'],
    min: 0,
    formatter: activity,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK') === 'OK';
    }
  },
  {
    metric: getMetricMatch('databases', 'xact_commit'),
    label: 'Committed transactions',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'xact_rollback'),
    label: 'Rolled back transactions',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'blks_hit_rate'),
    label: 'Cache Hit Ratio',
    min: 0,
    formatter: hitRate
  },
  {
    metric: getMetricMatch('databases', 'conflicts'),
    label: 'Standby Conflicts',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('databases', 'idx_tup_read'),
    label: 'Tuple read',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'idx_tup_fetch'),
    label: 'Tuple fetch',
    min: 0,
    formatter: activity
  }
];
