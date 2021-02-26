/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number, seconds } from 'in-services/formatters/number';

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
    formatter: millis
  },
  {
    metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
    labels: ['Threads connected', 'Max used connections', 'Aborted connects'],
    min: 0,
    category: ['Clients'],
    formatter: number
  },
  {
    metrics: ['replica.slave_io_running', 'replica.slave_sql_running'],
    labels: ['Replication I/O thread running', 'Replication SQL thread running'],
    min: 0,
    max: 1,
    category: ['Replication'],
    formatter: number
  },
  {
    metrics: ['replica.last_io_error_no', 'replica.last_sql_error_no'],
    labels: ['Replication last I/O error code', 'Replication last SQL error code'],
    min: 0,
    category: ['Replication'],
    formatter: number
  },
  {
    metrics: ['replica.seconds_behind_master'],
    labels: ['Seconds behind master'],
    min: 0,
    category: ['Replication'],
    formatter: seconds
  },
  {
    metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS', 'status.KEY_READS', 'status.KEY_WRITES'],
    labels: ['Read Requests', 'Write Requests', 'Reads', 'Writes'],
    category: ['Key Access'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'avg_query_latency', 'Schema'),
    label: 'avg. Query Latency',
    category: ['Schemas'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('databases', 'queries', 'Schema'),
    label: 'Queries',
    category: ['Schemas'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'select_count', 'Schema'),
    label: 'SELECTS',
    min: 0,
    category: ['Schemas'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'insert_count', 'Schema'),
    label: 'INSERTS',
    min: 0,
    category: ['Schemas'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'update_count', 'Schema'),
    label: 'UPDATES',
    min: 0,
    category: ['Schemas'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'delete_count', 'Schema'),
    label: 'DELETES',
    min: 0,
    category: ['Schemas'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'other_count', 'Schema'),
    label: 'OTHER',
    min: 0,
    category: ['Schemas'],
    formatter: number
  },
  {
    metrics: [
      'wait_events.wait/io/file',
      'wait_events.wait/io/socket',
      'wait_events.wait/io/table',
      'wait_events.wait/lock/table',
      'wait_events.wait/synch/cond',
      'wait_events.wait/synch/mutex',
      'wait_events.wait/synch/rwlock'
    ],
    labels: [
      'wait/io/file',
      'wait/io/socket',
      'wait/io/table',
      'wait/lock/table',
      'wait/synch/cond',
      'wait/synch/mutex',
      'wait/synch/rwlock'
    ],
    category: ['Wait Events'],
    min: 0,
    formatter: number
  }
];
