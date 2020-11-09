import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Connections',
    metric: 'connections',
    formatter: number.compact
  },
  {
    label: 'Database Size',
    metric: 'totalDbSize',
    formatter: bytes.detailed
  }
];
