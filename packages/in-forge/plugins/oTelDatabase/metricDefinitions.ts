/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error Could not find a declaration file for module
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { percentage, number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['db.status'],
    labels: [t('in-forge:plugins.oTelDatabase.db_status')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Availability')],
    formatter: number
  },
  {
    metrics: ['db.instance.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_instance_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Availability')],
    formatter: number
  },
  {
    metrics: ['db.instance.active.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_instance_active_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Availability')],
    formatter: number
  },
  {
    metrics: ['db.database.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_database_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Availability')],
    formatter: number
  },
  {
    metrics: ['db.instance.active.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_instance_active_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Availability')],
    formatter: number
  },
  {
    metrics: ['db.session.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_session_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.session.active.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_session_active_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.transaction.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_transaction_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.transaction.rate'],
    labels: [t('in-forge:plugins.oTelDatabase.db_transaction_rate')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.transaction.latency'],
    labels: [t('in-forge:plugins.oTelDatabase.db_transaction_latency')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.sql.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_sql_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.sql.rate'],
    labels: [t('in-forge:plugins.oTelDatabase.db_sql_rate')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.sql.latency'],
    labels: [t('in-forge:plugins.oTelDatabase.db_sql_latency')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.io.read.rate'],
    labels: [t('in-forge:plugins.oTelDatabase.db_io_read_rate')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.io.write.rate'],
    labels: [t('in-forge:plugins.oTelDatabase.db_io_write_rate')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.task.wait_count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_task_wait_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metrics: ['db.task.avg_wait_time'],
    labels: [t('in-forge:plugins.oTelDatabase.db_task_avg_wait_time')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Throughput')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('db.cache.hit', null, '_'),
    label: t('in-forge:plugins.oTelDatabase.db_cache_hit'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelDatabase.label_category_Performance')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('db.lock.count', null, '_'),
    label: t('in-forge:plugins.oTelDatabase.db_lock_count'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelDatabase.label_category_Performance')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('db.tablespace.size', null, '_'),
    label: t('in-forge:plugins.oTelDatabase.db_tablespace_size'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelDatabase.label_category_Resource_Usage')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('db.tablespace.used', null, '_'),
    label: t('in-forge:plugins.oTelDatabase.db_tablespace_used'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelDatabase.label_category_Resource_Usage')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('db.tablespace.utilization', null, '_'),
    label: t('in-forge:plugins.oTelDatabase.db_tablespace_utilization'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelDatabase.label_category_Resource_Usage')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('db.tablespace.max', null, '_'),
    label: t('in-forge:plugins.oTelDatabase.db_tablespace_max'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.oTelDatabase.label_category_Resource_Usage')],
    formatter: bytes
  },
  {
    metrics: ['db.disk.read.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_disk_read_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Resource_Usage')],
    formatter: number
  },
  {
    metrics: ['db.disk.write.count'],
    labels: [t('in-forge:plugins.oTelDatabase.db_disk_write_count')],
    category: [t('in-forge:plugins.oTelDatabase.label_category_Resource_Usage')],
    formatter: number
  }
];
