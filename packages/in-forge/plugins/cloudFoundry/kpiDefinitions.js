import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    label: 'Nodes',
    metric: 'nodeCount',
    formatter: siPrefix
  }
];
