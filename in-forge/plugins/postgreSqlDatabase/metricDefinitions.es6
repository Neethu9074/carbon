import {
  activity,
  hitRate,
  number
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


export default [
  {
    metrics: [
      'totalQueries',
      'totalCommittedTransactions'
    ],
    labels: [
      'Queries',
      'Committed Transactions'
    ],
    min: 0,
    formatter: activity,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK') === 'OK';
    }
  },
  {
    metric: getMetricMatch('databases', 'queries'),
    label: 'Queries',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'queries_select'),
    label: 'SELECT Queries',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'queries_update'),
    label: 'UPDATE Queries',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'queries_insert'),
    label: 'INSERT Queries',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'queries_delete'),
    label: 'DELETE Queries',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'queries_active'),
    label: 'Queries active',
    min: 0,
    formatter: activity
  },
  {
    metric: getMetricMatch('databases', 'queries_waiting'),
    label: 'Queries waiting',
    min: 0,
    formatter: activity
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
