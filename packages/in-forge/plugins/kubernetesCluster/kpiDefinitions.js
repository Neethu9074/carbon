import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Req. Alloc.',
    metric: 'requiredCapacityCPURatio',
    formatter: percentage.compact
  },
  {
    label: 'Memory Req. Alloc.',
    metric: 'requiredCapacityMemoryRatio',
    formatter: percentage.compact
  }
];
