import {
  number,
  bytes,
  kiloBytes,
  percentage,
  siMultiplyPrefix
} from 'in-services/formatters/number';
import {isWindows} from 'in-forge/plugins/host/hostUtils';

const availableCpuMetricSuffixes = {
  user: 'User',
  sys: 'System',
  wait: 'Wait',
  nice: 'Nice',
  steal: 'Steal'
};

function getMaxFilesystemCapacity(snapshot, match) {
  return snapshot.getIn(['data', 'filesystems', match[1], 'capacity']);
}

function getMaxFilesystemICapacity(snapshot, match) {
  return snapshot.getIn(['data', 'filesystems', match[1], 'icapacity']);
}

export default [
  {
    metric: 'memory.free',
    label: 'Free',
    category: ['Memory'],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.total']);
    },
    formatter: bytes
  },
  {
    metric: 'load.1min',
    label: 'Load',
    category: ['CPU'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'cpu.user',
      'cpu.sys',
      'cpu.wait',
      'cpu.nice',
      'cpu.steal'
    ],
    labels: [
      'User',
      'System',
      'Wait',
      'Nice',
      'Steal'
    ],
    category: ['CPU'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      'swap.pgin',
      'swap.pgout'
    ],
    labels: [
      'Page-In',
      'Page-Out'
    ],
    category: ['Memory'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'tcp.established',
      'tcp.opens',
      'tcp.inSegs',
      'tcp.outSegs'
    ],
    labels: [
      'Established',
      'Open/s',
      'In Segments/s',
      'Out Segments/s'
    ],
    category: ['Network'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'tcp.establishedResets',
      'tcp.resets',
      'tcp.fails',
      'tcp.errors',
      'tcp.retrans'
    ],
    labels: [
      'Established Resets',
      'Out Resets',
      'Fail',
      'Error',
      'Retransmission'
    ],
    category: ['Network'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: /^cpus\.\d+\.(\w+)$/i,
    label(snapshot, metricMatch) {
      const suffix = metricMatch[2];
      return availableCpuMetricSuffixes[suffix] || suffix;
    },
    category: ['CPU'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: /^fs\.(.*)\.free$/i,
    label: 'Free',
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: /^fs\.(.*)\.leaked$/i,
    label: 'Leaked',
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: /^fs\.(.*)\.ifree$/i,
    label: 'iFree',
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemICapacity,
    formatter: siMultiplyPrefix,
    isAvailable(snapshot, match) {
      return isWindows(snapshot) && getMaxFilesystemICapacity(snapshot, match) != null;
    }
  },
  {
    metric: /^fs\.(.*)\.reads$/i,
    label: 'Reads/s',
    category: ['Filesystem'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: /^fs\.(.*)\.writes$/i,
    label: 'Writes/s',
    category: ['Filesystem'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: /^fs\.(.*)\.readBytes$/i,
    label: 'Bytes Read/s',
    category: ['Filesystem'],
    min: 0,
    formatter: kiloBytes
  },
  {
    metric: /^fs\.(.*)\.writeBytes$/i,
    label: 'Bytes Written/s',
    category: ['Filesystem'],
    min: 0,
    formatter: kiloBytes
  }
];
