import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'containers.count',
    label: 'Containers',
    min: 0,
    formatter: number
  }
];
