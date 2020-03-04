import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Requests',
    metric: 'requiredCapacityCPURatio',
    formatter: percentage.compact
  },
  {
    label: 'Memory Requests',
    metric: 'requiredCapacityMemoryRatio',
    formatter: percentage.compact
  }
];
