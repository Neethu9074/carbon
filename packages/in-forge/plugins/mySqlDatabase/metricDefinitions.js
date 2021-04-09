/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['status.COM_SELECT', 'status.COM_UPDATE', 'status.COM_INSERT', 'status.COM_DELETE', 'status.COM_OTHER'],
    labels: [
      t('in-forge:plugins.mySqlDatabase.selects'),
      t('in-forge:plugins.mySqlDatabase.updates'),
      t('in-forge:plugins.mySqlDatabase.inserts'),
      t('in-forge:plugins.mySqlDatabase.deletes'),
      t('in-forge:plugins.mySqlDatabase.other')
    ],
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.queries')],
    formatter: number
  },
  {
    metrics: ['status.SLOW_QUERIES', 'status.COM_SHOW_ERRORS'],
    labels: [],
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.slowQueries')],
    formatter: number
  },
  {
    metric: 'status.DB_QUERY_LATENCY',
    label: t('in-forge:plugins.mySqlDatabase.avgQueryLatency'),
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.latency')],
    formatter: millis
  },
  {
    metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
    labels: [
      t('in-forge:plugins.mySqlDatabase.threadsCconnected'),
      t('in-forge:plugins.mySqlDatabase.maxUsedConnections'),
      t('in-forge:plugins.mySqlDatabase.abortedConnects')
    ],
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.clients')],
    formatter: number
  },
  {
    metrics: ['replica.slave_io_running', 'replica.slave_sql_running'],
    labels: [
      t('in-forge:plugins.mySqlDatabase.replicationIOThreadRunning'),
      t('in-forge:plugins.mySqlDatabase.replicationSqlThreadRunning')
    ],
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.mySqlDatabase.replication')],
    formatter: number
  },
  {
    metrics: ['replica.last_io_error_no', 'replica.last_sql_error_no'],
    labels: [
      t('in-forge:plugins.mySqlDatabase.replicationLastIOErrorCode'),
      t('in-forge:plugins.mySqlDatabase.replicationLastSqlErrorCode')
    ],
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.replication')],
    formatter: number
  },
  {
    metrics: ['replica.seconds_behind_master'],
    labels: [t('in-forge:plugins.mySqlDatabase.secondsBehindMaster')],
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.replication')],
    formatter: seconds
  },
  {
    metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS', 'status.KEY_READS', 'status.KEY_WRITES'],
    labels: [
      t('in-forge:plugins.mySqlDatabase.readRequests'),
      t('in-forge:plugins.mySqlDatabase.writeRequests'),
      t('in-forge:plugins.mySqlDatabase.reads'),
      t('in-forge:plugins.mySqlDatabase.writes')
    ],
    category: [t('in-forge:plugins.mySqlDatabase.keyAccess')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'avg_query_latency', t('in-forge:plugins.mySqlDatabase.schema')),
    label: t('in-forge:plugins.mySqlDatabase.avgQueryLatency'),
    category: [t('in-forge:plugins.mySqlDatabase.schemas')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('databases', 'queries', t('in-forge:plugins.mySqlDatabase.schema')),
    label: t('in-forge:plugins.mySqlDatabase.queries'),
    category: [t('in-forge:plugins.mySqlDatabase.schemas')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'select_count', t('in-forge:plugins.mySqlDatabase.schema')),
    label: t('in-forge:plugins.mySqlDatabase.selects'),
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.schemas')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'insert_count', t('in-forge:plugins.mySqlDatabase.schema')),
    label: t('in-forge:plugins.mySqlDatabase.inserts'),
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.schemas')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'update_count', t('in-forge:plugins.mySqlDatabase.schema')),
    label: t('in-forge:plugins.mySqlDatabase.updates'),
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.schemas')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'delete_count', t('in-forge:plugins.mySqlDatabase.schema')),
    label: t('in-forge:plugins.mySqlDatabase.deletes'),
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.schemas')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('databases', 'other_count', t('in-forge:plugins.mySqlDatabase.schema')),
    label: t('in-forge:plugins.mySqlDatabase.other'),
    min: 0,
    category: [t('in-forge:plugins.mySqlDatabase.schemas')],
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
      t('in-forge:plugins.mySqlDatabase.waitIoFile'),
      t('in-forge:plugins.mySqlDatabase.waitIoSocket'),
      t('in-forge:plugins.mySqlDatabase.waitIoTable'),
      t('in-forge:plugins.mySqlDatabase.waitLockTable'),
      t('in-forge:plugins.mySqlDatabase.waitSynchCond'),
      t('in-forge:plugins.mySqlDatabase.waitSynchMutex'),
      t('in-forge:plugins.mySqlDatabase.waitSynchRwlock')
    ],
    category: [t('in-forge:plugins.mySqlDatabase.waitEvents')],
    min: 0,
    formatter: number
  }
];
