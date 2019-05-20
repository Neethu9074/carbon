import { siPrefix, number } from 'in-services/formatters/number';

export default [
  {
    metric: 'nodeCount',
    label: 'Nodes',
    min: 0,
    formatter: siPrefix
  },
  {
    metric: 'broker.activeControllerCount',
    label: 'Broker active controller count',
    formatter: number
  }
];
