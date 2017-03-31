import { millis, number } from 'in-services/formatters/number';
import { isPerformanceDataAvailable } from 'in-forge/plugins/mySqlDatabase/util';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['status.COM_SELECT', 'status.COM_UPDATE', 'status.COM_INSERT', 'status.COM_DELETE', 'status.COM_OTHER'],
    labels: ['SELECTS', 'UPDATES', 'INSERTS', 'DELETES', 'OTHER'],
    min: 0,
    category: ['Queries'],
    formatter: number
  },
  {
    metrics: ['status.SLOW_QUERIES', 'status.COM_SHOW_ERRORS'],
    labels: [],
    min: 0,
    category: ['Slow Queries'],
    formatter: number
  },
  {
    metric: 'status.DB_QUERY_LATENCY',
    label: 'avg. Query Latency',
    min: 0,
    category: ['Latency'],
    formatter: millis,
    isAvailable(snapshot) {
      return isPerformanceDataAvailable(snapshot);
    }
  },
  {
    metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
    labels: ['Connections', 'Max used connections', 'Aborted connects'],
    min: 0,
    category: ['Clients'],
    formatter: number
  },
  {
    metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS', 'status.KEY_READS', 'status.KEY_WRITES'],
    labels: ['Read Requests', 'Write Requests', 'Reads', 'Writes'],
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('databases', 'avg_query_latency'),
    label: 'avg. Query Latency',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('databases', 'queries'),
    label: 'Queries',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('databases', 'select_count'),
    label: 'SELECTS',
    min: 0,
    category: ['Queries'],
    formatter: number
  },
  {
    metric: getMetricMatch('databases', 'insert_count'),
    label: 'INSERTS',
    min: 0,
    category: ['Queries'],
    formatter: number
  },
  {
    metric: getMetricMatch('databases', 'update_count'),
    label: 'UPDATES',
    min: 0,
    category: ['Queries'],
    formatter: number
  },
  {
    metric: getMetricMatch('databases', 'delete_count'),
    label: 'DELETES',
    min: 0,
    category: ['Queries'],
    formatter: number
  },
  {
    metric: getMetricMatch('databases', 'other_count'),
    label: 'OTHER',
    min: 0,
    category: ['Queries'],
    formatter: number
  }

  // TODO: Wait metric
];
