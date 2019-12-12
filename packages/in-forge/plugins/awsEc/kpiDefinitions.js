import { bytes, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Utilization',
    metric: 'cpu_utilization',
    formatter: percentage
  },
  {
    label: 'Freeable Memory',
    metric: 'freeable_memory',
    formatter: bytes
  }
];
