import { number, siPrefix } from 'in-services/formatters/number';

export default [
  {
    label: 'Node Count',
    metric: 'nodeCount',
    formatter: number.compact
  },
  {
    label: 'Is Cluster Safe',
    metric: 'isClusterSafe',
    formatters: siPrefix
  }
];
