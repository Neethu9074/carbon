import {
  percentage,
  number,
  bytes,
  kiloBytes,
  siMultiplyPrefix
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';
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

function getFilesystemLabel(prefix, snapshot, match) {
  return `${prefix} ${match[1]}`;
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
    metric: 'memory.used',
    label: 'Used',
    category: ['Memory'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: 'load.1min',
    label: 'Load',
    category: ['CPU'],
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      return !isWindows(snapshot);
    }
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
    metric: getMetricMatch('fs', 'free'),
    label: getFilesystemLabel.bind(null, 'Free'),
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: getMetricMatch('fs', 'leaked'),
    label: getFilesystemLabel.bind(null, 'Leaked'),
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: getMetricMatch('fs', 'ifree'),
    label: getFilesystemLabel.bind(null, 'iFree'),
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemICapacity,
    formatter: siMultiplyPrefix,
    isAvailable(snapshot, match) {
      return isWindows(snapshot) && getMaxFilesystemICapacity(snapshot, match) != null;
    }
  },
  {
    metric: getMetricMatch('fs', 'reads'),
    label: getFilesystemLabel.bind(null, 'Reads/s'),
    category: ['Filesystem'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getMetricMatch('fs', 'writes'),
    label: getFilesystemLabel.bind(null, 'Writes/s'),
    category: ['Filesystem'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getMetricMatch('fs', 'readBytes'),
    label: getFilesystemLabel.bind(null, 'Bytes Read/s'),
    category: ['Filesystem'],
    min: 0,
    formatter: kiloBytes
  },
  {
    metric: getMetricMatch('fs', 'writeBytes'),
    label: getFilesystemLabel.bind(null, 'Bytes Written/s'),
    category: ['Filesystem'],
    min: 0,
    formatter: kiloBytes
  }
];
