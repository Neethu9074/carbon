import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Connections',
    metric: 'databases.connectionsCount',
    formatter: number.compact
  },
  {
    label: 'Queries',
    metric: 'databases.queries',
    formatter: number.compact
  }
];
