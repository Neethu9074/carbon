/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { siPrefix, number, bytes, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'nodeCount',
    label: 'Nodes',
    min: 0,
    formatter: siPrefix
  },
  {
    metrics: ['documents.deleted', 'documents.inserted', 'documents.returned', 'documents.updated'],
    labels: ['Deleted', 'Inserted', 'Returned', 'Updated'],
    min: 0,
    category: ['Documents'],
    formatter: number
  },
  {
    metric: 'connections',
    label: 'Connections',
    min: 0,
    formatter: number
  },
  {
    metrics: ['repl.apply_ops', 'repl.apply_bathes'],
    labels: ['Replication Apply Operations', 'Replication Apply Batches'],
    category: ['Replica Set'],
    formatter: number
  },
  {
    metric: 'repl.apply_bathes_total_ms',
    label: 'Replication Apply Batch Total',
    category: ['Replica Set'],
    formatter: millis
  },
  {
    metric: 'repl.buffer_count',
    label: 'Replication Buffer Count',
    category: ['Replica Set'],
    formatter: number
  },
  {
    metric: 'repl.buffer_size_bytes',
    label: 'Replication Buffer Size',
    category: ['Replica Set'],
    formatter: bytes
  },
  {
    metric: 'repl.network_ops',
    label: 'Replication Network Ops',
    category: ['Replica Set'],
    formatter: number
  },
  {
    metric: 'repl.network_bytes',
    label: 'Replication Network Traffic',
    category: ['Replica Set'],
    formatter: bytes
  },
  {
    metric: 'repl.preload_docs_num',
    label: 'Replication Preload Docs',
    category: ['Replica Set'],
    formatter: number
  },
  {
    metric: 'repl.preload_docs_total_ms',
    label: 'Replication Preload Total',
    category: ['Replica Set'],
    formatter: millis
  },
  {
    metric: 'repl.preload_idx_num',
    label: 'Replication Preload Indexes',
    category: ['Replica Set'],
    formatter: number
  },
  {
    metric: 'repl.preload_idx_total_ms',
    label: 'Replication Preload Indexes Total',
    category: ['Replica Set'],
    formatter: millis
  },
  {
    metric: 'repl.replication_lag',
    label: 'Replication Lag',
    category: ['Replica Set'],
    formatter: millis
  },
  {
    metric: 'health.cpu',
    label: 'Member CPU Health',
    min: 0,
    formatter: number
  },
  {
    metric: 'slaveDelaysCount',
    label: 'Slave Delays Count',
    min: 0,
    formatter: number
  },
  {
    metric: 'optimesCount',
    label: 'Optimes Count',
    min: 0,
    formatter: number
  },
  {
    metric: 'monitoredMembersCount',
    label: 'Monitored Members Count',
    min: 0,
    formatter: number
  },
  {
    metric: 'slaveDelays',
    label: 'Slave Delays',
    min: 0,
    formatter: millis
  },
  {
    metric: 'optimes',
    label: 'Optimes',
    min: 0,
    formatter: millis
  }
];
