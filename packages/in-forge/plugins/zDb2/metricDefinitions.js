/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['DB2_System_States.real_storage_used_by_db2', 'DB2_System_States.ecsa_used_by_db2'],
    labels: [t('in-forge:plugins.zDb2.realStorageUsedByDb2'), t('in-forge:plugins.zDb2.ecsaUsedByDb2')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      'DB2_System_States.lock_conflict_count',
      'DB2_System_States.current_thread_count',
      'DB2_System_States.transactions_per_second',
      'DB2_System_States.pages_read_from_bps',
      'DB2_System_States.pages_read_from_dasd'
    ],
    labels: [
      t('in-forge:plugins.zDb2.lockConflictCount'),
      t('in-forge:plugins.zDb2.currentThreadCount'),
      t('in-forge:plugins.zDb2.transactionsPerSecond'),
      t('in-forge:plugins.zDb2.pagesReadFromBps'),
      t('in-forge:plugins.zDb2.pagesReadFromDasd')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'DB2_CICS_Exceptions',
        'total_threads_maximum',
        t('in-forge:plugins.zDb2.cicsExceptions.totalThreadsMaximum')
      ),
      getDynamicMetricMatch(
        'DB2_CICS_Exceptions',
        'total_threads_inuse',
        t('in-forge:plugins.zDb2.cicsExceptions.totalThreadsInUse')
      ),
      getDynamicMetricMatch(
        'DB2_CICS_Exceptions',
        'pool_thread_maximum',
        t('in-forge:plugins.zDb2.cicsExceptions.poolThreadMaximum')
      ),
      getDynamicMetricMatch(
        'DB2_CICS_Exceptions',
        'pool_threads_inuse',
        t('in-forge:plugins.zDb2.cicsExceptions.poolThreadsInUse')
      ),
      getDynamicMetricMatch(
        'DB2_CICS_Exceptions',
        'pool_thread_waits',
        t('in-forge:plugins.zDb2.cicsExceptions.poolThreadWaits')
      )
    ],
    labels: [
      t('in-forge:plugins.zDb2.cicsExceptions.totalThreadsMaximum'),
      t('in-forge:plugins.zDb2.cicsExceptions.totalThreadsInUse'),
      t('in-forge:plugins.zDb2.cicsExceptions.poolThreadMaximum'),
      t('in-forge:plugins.zDb2.cicsExceptions.poolThreadsInUse'),
      t('in-forge:plugins.zDb2.cicsExceptions.poolThreadWaits')
    ],
    min: 0,
    formatter: number.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'DB2_IMS_Connections',
        'active_threads',
        t('in-forge:plugins.zDb2.imsConnections.activeThreads')
      )
    ],
    labels: [t('in-forge:plugins.zDb2.imsConnections.activeThreads')],
    min: 0,
    formatter: number.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'DB2_Lock_Contentions',
        'lock_elapsed_time',
        t('in-forge:plugins.zDb2.lockContentions.lockElapsedTime')
      )
    ],
    labels: [t('in-forge:plugins.zDb2.lockContentions.lockElapsedTime')],
    min: 0,
    formatter: number.detailed
  }
];
