import { number, bytes, millis } from 'in-services/formatters/number';

export default [
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
    metric: 'lockQueue',
    label: 'Lock Queue Length',
    min: 0,
    formatter: number
  },
  {
    metric: 'journalWriteLock',
    label: 'Journal Write Lock',
    min: 0,
    formatter: number
  },
  {
    metric: 'pageFaults',
    label: 'Number of Page Faults',
    min: 0,
    formatter: number
  },
  {
    metric: 'backgroundFlushingLast',
    label: 'Last Background Flushing Latency',
    min: 0,
    formatter: millis
  },
  {
    metrics: ['virtual', 'mapped'],
    labels: ['Virtual', 'Mapped'],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  }
];
