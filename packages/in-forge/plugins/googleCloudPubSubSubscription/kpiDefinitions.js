import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    label: 'Messages Size',
    metric: 'backlog_bytes',
    formatter: bytes.detailed
  },
  {
    label: 'Undelivered Messages',
    metric: 'num_undelivered_messages',
    formatter: number.compact
  }
];
