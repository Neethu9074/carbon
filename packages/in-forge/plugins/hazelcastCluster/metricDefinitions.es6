import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    metrics: ['isClusterSafe', 'nodeCount'],
    labels: ['Is Cluster Safe', 'Node Count'],
    min: 0,
    formatter: siPrefix
  }
];
