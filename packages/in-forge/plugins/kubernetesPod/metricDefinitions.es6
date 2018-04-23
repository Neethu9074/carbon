import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'containers.count',
    label: 'Containers',
    min: 0,
    formatter: number
  },
  {
    metric: 'cpuRequests',
    label: 'CPU Requests',
    min: 0,
    formatter: number
  },
  {
    metric: 'cpuLimits',
    label: 'CPU Limits',
    min: 0,
    formatter: number
  },
  {
    metric: 'memoryRequests',
    label: 'Memory Requests',
    min: 0,
    formatter: number
  },
  {
    metric: 'memoryLimits',
    label: 'Memory Limits',
    min: 0,
    formatter: number
  }
];
