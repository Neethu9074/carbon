import { percentage, micros, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
    labels: ['Total', 'Kernel', 'User'],
    min: 0,
    category: ['CPU'],
    formatter: percentage
  },
  {
    metrics: ['cpu.throttling_count', 'cpu.throttling_time'],
    labels: ['Throttling count', 'Throttling time'],
    category: ['CPU'],
    min: 0,
    formatter: micros
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
