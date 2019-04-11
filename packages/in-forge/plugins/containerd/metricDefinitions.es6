import { number, timeByNanoTwoDecimalPlaces, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage', 'cpu.throttling_time'],
    labels: ['Total time', 'Kernel time', 'User time', 'Throttling time'],
    min: 0,
    category: ['CPU'],
    formatter: timeByNanoTwoDecimalPlaces
  },
  {
    metrics: ['cpu.throttling_count'],
    labels: ['Throttling count'],
    category: ['CPU'],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      'memory.usage',
      'memory.max_usage',
      'memory.total_rss',
      'memory.total_cache',
      'memory.active_anon',
      'memory.active_file',
      'memory.inactive_anon',
      'memory.inactive_file'
    ],
    labels: [
      'Usage',
      'Max usage',
      'RSS',
      'Cache',
      'Active anonymous',
      'Active cache',
      'Inactive anonymous',
      'Inactive cache'
    ],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  }
];
