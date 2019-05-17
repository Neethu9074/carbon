import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['totalSessionCount'],
    labels: ['Total Session Count'],
    min: 0,
    formatter: number
  }
];
