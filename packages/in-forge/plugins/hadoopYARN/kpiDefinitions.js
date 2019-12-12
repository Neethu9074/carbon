import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Cluster Nodes',
    metric: 'activeNodes',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Apps Running',
    metric: 'appsRunning',
    formatter: zeroDecimalPlaces
  }
];
