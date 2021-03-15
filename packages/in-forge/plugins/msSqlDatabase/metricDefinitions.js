/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number, millis, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['generalstats._total.user_connections'],
    labels: [t('in-forge:plugins.msSqlDatabase.userConnections')],
    min: 0,
    category: [t('in-forge:plugins.msSqlDatabase.connectionsAmpUsers')],
    formatter: number
  },
  {
    metrics: [
      'waitstats.PAGEIOLATCH_EX.wait_time_ms',
      'waitstats.PAGEIOLATCH_SH.wait_time_ms',
      'waitstats.ASYNC_NETWORK_IO.wait_time_ms',
      'waitstats.CXPACKET.wait_time_ms',
      'waitstats.WRITELOG.wait_time_ms'
    ],
    labels: [
      'Page IO-Latch EX',
      'Page IO-Latch SH',
      t('in-forge:plugins.msSqlDatabase.asyncNetworkIo'),
      'CX-Packet',
      t('in-forge:plugins.msSqlDatabase.writelog')
    ],
    min: 0,
    category: [t('in-forge:plugins.msSqlDatabase.waitTimes')],
    formatter: millis
  },
  {
    metrics: ['iostats._total.num_of_bytes_read', 'iostats._total.num_of_bytes_written'],
    labels: [t('in-forge:plugins.msSqlDatabase.reads'), t('in-forge:plugins.msSqlDatabase.writes')],
    category: [t('in-forge:plugins.msSqlDatabase.virtualFileReadsAmpWrites')],
    formatter: bytes
  },
  {
    metrics: ['perfcounters.databases._total.write_transactions_sec'],
    labels: [t('in-forge:plugins.msSqlDatabase.writeTransactions')],
    category: [t('in-forge:plugins.msSqlDatabase.transactions')],
    formatter: number
  },
  {
    metrics: [
      'perfcounters.sql_errors.user_errors.errors_sec',
      'perfcounters.sql_errors.db_offline_errors.errors_sec',
      'perfcounters.sql_errors.kill_connection_errors.errors_sec'
    ],
    labels: [
      t('in-forge:plugins.msSqlDatabase.userErrors'),
      t('in-forge:plugins.msSqlDatabase.dbOfflineErrors'),
      t('in-forge:plugins.msSqlDatabase.killConnectionErrors')
    ],
    min: 0,
    category: [t('in-forge:plugins.msSqlDatabase.errors')],
    formatter: number
  },
  {
    metrics: ['perfcounters.locks._total.lock_requests_sec'],
    labels: [t('in-forge:plugins.msSqlDatabase.lockRequests')],
    category: [t('in-forge:plugins.msSqlDatabase.locks')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['perfcounters.locks._total.number_of_deadlocks_sec'],
    labels: [t('in-forge:plugins.msSqlDatabase.numberOfDeadlocks')],
    category: [t('in-forge:plugins.msSqlDatabase.locks')],
    formatter: zeroDecimalPlaces
  }
];
