import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Cluster Nodes (Active)',
    metric: 'active_nodes',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Apps Running',
    metric: 'apps_running',
    formatter: zeroDecimalPlaces
  }
];
