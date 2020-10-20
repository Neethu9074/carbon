import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['request_count'],
    labels: ['Requests'],
    min: 0,
    category: ['Requests'],
    formatter: number.compact
  },
  {
    metrics: ['entity_read_sizes_avg'],
    labels: ['Entity Read Average'],
    min: 0,
    category: ['Entity Read'],
    formatter: bytes.detailed
  },
  {
    metrics: ['entity_write_sizes_avg'],
    labels: ['Entity Write Average'],
    min: 0,
    category: ['Entity Write'],
    formatter: bytes.detailed
  },
  {
    metrics: ['index_write_count'],
    labels: ['Index Writes'],
    min: 0,
    category: ['Index Writes'],
    formatter: number.compact
  }
];
