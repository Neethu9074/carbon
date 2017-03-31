import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'status.THREADS_CONNECTED',
      'status.MAX_USED_CONNECTIONS',
      'status.ABORTED_CONNECTS',
      'status.SLOW_QUERIES',
      'status.KEY_READ_REQUESTS',
      'status.KEY_WRITE_REQUESTS',
      'status.KEY_READS',
      'status.KEY_WRITES',
      'status.ARIA_PAGECACHE_READS',
      'status.ARIA_PAGECACHE_WRITES'
    ],
    labels: [
      'Connections',
      'Max used connections',
      'Aborted connects',
      'Slow Queries',
      'Read Requests',
      'Write Requests',
      'Reads',
      'Writes',
      'Pagecache Reads',
      'Pagecache Writes'
    ],
    min: 0,
    formatter: number
  }
];
