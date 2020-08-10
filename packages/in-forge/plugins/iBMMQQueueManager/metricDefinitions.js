import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['connectionCount'],
    labels: ['Connections'],
    min: 0,
    formatter: number
  }
];
