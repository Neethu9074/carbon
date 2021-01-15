import { siPrefix, number, bytes } from 'in-services/formatters/number';

export default [
  {
    metric: 'replicaSetCount',
    label: 'ReplicaSets',
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
  }
];
