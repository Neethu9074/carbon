import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Running Allocations',
    metric: 'nomad.client.allocations.running',
    formatter: number.compact
  },
  {
    label: 'Migrating Allocations',
    metric: 'nomad.client.allocations.migrating',
    formatter: number.compact
  }
];
