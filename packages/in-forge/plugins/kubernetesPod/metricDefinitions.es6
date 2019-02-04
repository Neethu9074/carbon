import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['containers.count', 'cpuRequests', 'cpuLimits', 'memoryRequests', 'memoryLimits', 'restartCount'],
    labels: ['Containers', 'CPU Requests', 'CPU Limits', 'Memory Requests', 'Memory Limits', 'Restarts'],
    min: 0,
    formatter: number
  }
];
