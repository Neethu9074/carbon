import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Query Thread',
    metric: 'QueryThread',
    formatter: number.compact
  },
  {
    label: 'Query Preempted',
    metric: 'QueryPreempted',
    formatter: number.compact
  }
];
