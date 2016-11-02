import {
  siPrefix,
  ms
} from 'in-services/formatters/number';


export default [
  {
    metrics: [
      'query_latency'
    ],
    labels: [
      'Latency'
    ],
    min: 0,
    formatter: ms
  },
  {
    metrics: [
      'query_count',
      'indices_count',
      'active_shards',
      'active_primaryshards',
      'initializing_shards',
      'relocating_shards',
      'unassigned_shards'
    ],
    labels: [
      'Number Of Queries',
      'Indices',
      'Active',
      'Active Primary',
      'Initializing',
      'Relocating',
      'Unassigned'
    ],
    min: 0,
    formatter: siPrefix
  }
];
