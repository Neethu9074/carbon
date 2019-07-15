import { number, percentage, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cpu.system_usage', 'cpu.user_usage'],
    labels: ['Kernel time', 'User time'],
    min: 0,
    category: ['CPU'],
    formatter: percentage
  },
  {
    metrics: [
      'memory.usedPercentage',
      'memory.swapPercentage',
      'memory.usage',
      'memory.max_usage',
      'memory.rss',
      'memory.cache',
      'memory.swap',
      'memory.active_anon',
      'memory.active_file',
      'memory.inactive_anon',
      'memory.inactive_file'
    ],
    labels: [
      'User percentage',
      'Swap percentage',
      'Usage',
      'Max usage',
      'RSS',
      'Cache',
      'Swap',
      'Active anonymous',
      'Active cache',
      'Inactive anonymous',
      'Inactive cache'
    ],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['memory.usedPercentage', 'memory.swapPercentage'],
    labels: ['User percentage', 'Swap percentage'],
    min: 0,
    category: ['Memory'],
    formatter: percentage
  },
  {
    metrics: ['network.rxBytes', 'network.txBytes'],
    labels: ['Received Bytes', 'Transmitted Bytes'],
    min: 0,
    category: ['Network'],
    formatter: bytes
  },
  {
    metrics: ['network.rxPackets', 'network.txPackets'],
    labels: ['Received Packets', 'Transmitted Packets'],
    min: 0,
    category: ['Network'],
    formatter: number
  }
];
