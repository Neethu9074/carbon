/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['documents.deleted', 'documents.inserted', 'documents.returned', 'documents.updated'],
    labels: [
      t('in-forge:plugins.mongoDb.deleted'),
      t('in-forge:plugins.mongoDb.inserted'),
      t('in-forge:plugins.mongoDb.returned'),
      t('in-forge:plugins.mongoDb.updated')
    ],
    min: 0,
    category: [t('in-forge:plugins.mongoDb.documents')],
    formatter: number
  },
  {
    metric: 'connections',
    label: t('in-forge:plugins.mongoDb.connections'),
    min: 0,
    formatter: number
  },
  {
    metrics: ['repl.apply_ops', 'repl.apply_bathes'],
    labels: [
      t('in-forge:plugins.mongoDb.replicationApplyOperations'),
      t('in-forge:plugins.mongoDb.replicationApplyBatches')
    ],
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.apply_bathes_total_ms',
    label: t('in-forge:plugins.mongoDb.replicationApplyBatchTotal'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: millis
  },
  {
    metric: 'repl.buffer_count',
    label: t('in-forge:plugins.mongoDb.replicationBufferCount'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.buffer_size_bytes',
    label: t('in-forge:plugins.mongoDb.replicationBufferSize'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: bytes
  },
  {
    metric: 'repl.network_ops',
    label: t('in-forge:plugins.mongoDb.replicationNetworkOps'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.network_bytes',
    label: t('in-forge:plugins.mongoDb.replicationNetworkTraffic'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: bytes
  },
  {
    metric: 'repl.preload_docs_num',
    label: t('in-forge:plugins.mongoDb.replicationPreloadDocs'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.preload_docs_total_ms',
    label: t('in-forge:plugins.mongoDb.replicationPreloadTotal'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: millis
  },
  {
    metric: 'repl.preload_idx_num',
    label: t('in-forge:plugins.mongoDb.replicationPreloadIndexes'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.preload_idx_total_ms',
    label: t('in-forge:plugins.mongoDb.replicationPreloadIndexesTotal'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: millis
  },
  {
    metric: 'repl.replication_lag',
    label: t('in-forge:plugins.mongoDb.replicationLag'),
    category: [t('in-forge:plugins.mongoDb.replicaSet')],
    formatter: millis
  },
  {
    metric: 'lockQueue',
    label: t('in-forge:plugins.mongoDb.lockQueueLength'),
    min: 0,
    formatter: number
  },
  {
    metric: 'journalWriteLock',
    label: t('in-forge:plugins.mongoDb.journalWriteLock'),
    min: 0,
    formatter: number
  },
  {
    metric: 'pageFaults',
    label: t('in-forge:plugins.mongoDb.numberOfPageFaults'),
    min: 0,
    formatter: number
  },
  {
    metric: 'backgroundFlushingLast',
    label: t('in-forge:plugins.mongoDb.lastBackgroundFlushingLatency'),
    min: 0,
    formatter: millis
  },
  {
    metrics: ['virtual', 'mapped'],
    labels: [t('in-forge:plugins.mongoDb.virtual'), t('in-forge:plugins.mongoDb.mapped')],
    min: 0,
    category: [t('in-forge:plugins.mongoDb.memory')],
    formatter: bytes
  }
];
