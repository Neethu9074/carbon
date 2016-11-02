import {
  number,
  percentage
} from 'in-services/formatters/number';


export default [
  {
    metrics: [
      'totalQueuesEnqueueCount',
      'totalTopicsDequeueCount',
      'totalTopicsEnqueueCount',
      'totalConnectionsCount',
      'totalConsumerCount',
      'totalProducerCount'
    ],
    labels: [
      'All Queues Messages Enqueue',
      'All Topics Messages Dequeue',
      'All Topics Messages Enqueue',
      'Total Connections',
      'Total Consumers',
      'Total Producers'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'memoryPercentUsage',
      'storePercentUsage'
    ],
    labels: [
      'Memory Usage',
      'Store Usage'
    ],
    min: 0,
    formatter: percentage
  }
];
