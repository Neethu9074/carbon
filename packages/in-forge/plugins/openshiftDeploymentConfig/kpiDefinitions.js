import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Pods',
    metric: 'pods.count',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Available Replicas',
    metric: 'availableReplicas',
    formatter: zeroDecimalPlaces
  }
];
