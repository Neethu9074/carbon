import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['sent_message_count'],
    labels: ['Sent Message Count'],
    min: 0,
    category: ['Messages Count'],
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
    labels: ['Index Write Count'],
    min: 0,
    category: ['Index Write'],
    formatter: number.compact
  }
];
