import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'All Queues Messages Enqueue',
    metric: 'totalQueuesEnqueueCount',
    formatter: number
  },
  {
    label: 'All Topics Messages Enqueue',
    metric: 'totalTopicsEnqueueCount',
    formatters: number
  }
];
