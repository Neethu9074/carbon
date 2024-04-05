/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['stats.connCount'],
    labels: [t('in-forge:plugins.sybase.titleConnections')],
    min: 0,
    category: [t('in-forge:plugins.sybase.titleConnections')],
    formatter: number
  },
  {
    metrics: ['stats.diskRead', 'stats.diskWrite'],
    labels: [t('in-forge:plugins.sybase.labelDiskReads'), t('in-forge:plugins.sybase.labelDiskWrites')],
    min: 0,
    category: [t('in-forge:plugins.sybase.titleDiskReadsWrites')],
    formatter: number
  },
  {
    metrics: ['stats.bytesReceived', 'stats.bytesSent'],
    labels: [t('in-forge:plugins.sybase.labelBytesReceived'), t('in-forge:plugins.sybase.labelBytesSent')],
    min: 0,
    category: [t('in-forge:plugins.sybase.titleBytesReceivedSent')],
    formatter: bytes
  },
  {
    metrics: ['stats.threadDeadlocksAvoided', 'stats.threadDeadlocksReported'],
    labels: [
      t('in-forge:plugins.sybase.labelThreadDeadLocksAvoided'),
      t('in-forge:plugins.sybase.labelThreadDeadLocksReported')
    ],
    min: 0,
    category: [t('in-forge:plugins.sybase.titleThreadDeadLocksAvoidedReported')],
    formatter: number
  },
  {
    metrics: ['databases.connCount'],
    labels: [t('in-forge:plugins.sybase.labelDatabaseConnections')],
    min: 0,
    category: [t('in-forge:plugins.sybase.titleConnections')],
    formatter: number
  },
  {
    metrics: ['databases.diskRead', 'databases.diskWrite'],
    labels: [t('in-forge:plugins.sybase.labelDatabaseDiskReads'), t('in-forge:plugins.sybase.labelDatabaseDiskWrites')],
    min: 0,
    category: [t('in-forge:plugins.sybase.categoryDatabaseDiskReadsWrites')],
    formatter: number
  },
  {
    metrics: ['databases.bytesReceived', 'databases.bytesSent'],
    labels: [
      t('in-forge:plugins.sybase.labelDatabaseBytesReceived'),
      t('in-forge:plugins.sybase.labelDatabaseBytesSent')
    ],
    min: 0,
    category: [t('in-forge:plugins.sybase.categoryDatabaseBytesReceivedSent')],
    formatter: bytes
  }
];
