import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Requests Allocation',
    metric: 'requiredCapacityCPURatio',
    formatter: percentage.detailed
  },
  {
    label: 'Memory Requests Allocation',
    metric: 'requiredCapacityMemoryRatio',
    formatter: percentage.detailed
  }
];
