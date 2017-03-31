import { percentage, number, micros, bytes } from 'in-services/formatters/number';

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
    labels: ['Usage', 'Max usage', 'RSS', 'Cache', 'active_anon', 'active_file', 'inactive_anon', 'inactive_file'],
    min: 0,
    category: ['Memory'],
    formatter: bytes,
    isAvailable(snapshot) {
      const dockerVersion = snapshot.getIn(['data', 'docker_version']);
      return dockerVersion === '1.11.0' || dockerVersion === '1.11.1';
    }
  },
  {
    metrics: ['blkio.blk_read', 'blkio.blk_write'],
    labels: ['Read', 'Write'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['network.rx.bytes', 'network.tx.bytes'],
    labels: ['Received', 'Transmitted'],
    min: 0,
    category: ['Network'],
    formatter: bytes,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'NetworkMode']) === 'bridge';
    }
  },
  {
    metrics: ['network.rx.errors', 'network.rx.dropped', 'network.tx.errors', 'network.tx.dropped'],
    labels: ['RX Errors', 'RX Dropped', 'TX Errors', 'TX Dropped'],
    min: 0,
    formatter: percentage,
    isAvailable(snapshot) {
      return snapshot.getIn(['data', 'NetworkMode']) === 'bridge';
    }
  }
];
