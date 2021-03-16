/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { siPrefix, number, bytes, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'nodeCount',
    label: t('in-forge:plugins.mongoDbReplicaSet.nodes'),
    min: 0,
    formatter: siPrefix
  },
  {
    metrics: ['documents.deleted', 'documents.inserted', 'documents.returned', 'documents.updated'],
    labels: [
      t('in-forge:plugins.mongoDbReplicaSet.deleted'),
      t('in-forge:plugins.mongoDbReplicaSet.inserted'),
      t('in-forge:plugins.mongoDbReplicaSet.returned'),
      t('in-forge:plugins.mongoDbReplicaSet.updated')
    ],
    min: 0,
    category: [t('in-forge:plugins.mongoDbReplicaSet.documents')],
    formatter: number
  },
  {
    metric: 'connections',
    label: t('in-forge:plugins.mongoDbReplicaSet.connections'),
    min: 0,
    formatter: number
  },
  {
    metrics: ['repl.apply_ops', 'repl.apply_bathes'],
    labels: [
      t('in-forge:plugins.mongoDbReplicaSet.replicationApplyOperations'),
      t('in-forge:plugins.mongoDbReplicaSet.replicationApplyBatches')
    ],
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.apply_bathes_total_ms',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationApplyBatchTotal'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: millis
  },
  {
    metric: 'repl.buffer_count',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationBufferCount'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.buffer_size_bytes',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationBufferSize'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: bytes
  },
  {
    metric: 'repl.network_ops',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationNetworkOps'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.network_bytes',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationNetworkTraffic'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: bytes
  },
  {
    metric: 'repl.preload_docs_num',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationPreloadDocs'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.preload_docs_total_ms',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationPreloadTotal'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: millis
  },
  {
    metric: 'repl.preload_idx_num',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationPreloadIndexes'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.preload_idx_total_ms',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationPreloadIndexesTotal'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: millis
  },
  {
    metric: 'repl.replication_lag',
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationLag'),
    category: [t('in-forge:plugins.mongoDbReplicaSet.replicaSet')],
    formatter: millis
  },
  {
    metric: 'health.cpu',
    label: t('in-forge:plugins.mongoDbReplicaSet.memberCpuHealth'),
    min: 0,
    formatter: number
  },
  {
    metric: 'slaveDelaysCount',
    label: t('in-forge:plugins.mongoDbReplicaSet.slaveDelaysCount'),
    min: 0,
    formatter: number
  },
  {
    metric: 'optimesCount',
    label: t('in-forge:plugins.mongoDbReplicaSet.optimesCount'),
    min: 0,
    formatter: number
  },
  {
    metric: 'monitoredMembersCount',
    label: t('in-forge:plugins.mongoDbReplicaSet.monitoredMembersCount'),
    min: 0,
    formatter: number
  },
  {
    metric: 'slaveDelays',
    label: t('in-forge:plugins.mongoDbReplicaSet.slaveDelays'),
    min: 0,
    formatter: millis
  },
  {
    metric: 'optimes',
    label: t('in-forge:plugins.mongoDbReplicaSet.optimes'),
    min: 0,
    formatter: millis
  }
];
