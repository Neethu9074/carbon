import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Requests Allocation',
    metric: 'requiredCapacityCPURatio',
    formatter: percentage.compact
  },
  {
    label: 'Memory Request Allocation',
    metric: 'requiredCapacityMemoryRatio',
    formatter: percentage.compact
  }
];
