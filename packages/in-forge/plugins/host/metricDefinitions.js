import { percentage, number, bytes, kiloBytes, siMultiplyPrefix } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { isWindows } from 'in-forge/plugins/host/hostUtils';

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
    metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal', 'cpu.used'],
    labels: ['User', 'System', 'Wait', 'Nice', 'Steal', 'Used'],
    category: ['CPU'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: 'openFiles.current',
    label: 'Current',
    category: ['Open Files'],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'openFiles.max']);
    },
    formatter: number,
    isAvailable(snapshot) {
      return !isWindows(snapshot);
    }
  },
  {
    metric: 'openFiles.used',
    label: 'Used',
    category: ['Open Files'],
    min: 0,
    max: 1,
    formatter: percentage,
    isAvailable(snapshot) {
      return !isWindows(snapshot);
    }
  },
  {
    metrics: ['topPID'],
    labels: ['Top PID'],
    min: 0,
    formatter: {
      // to handle the pid as a metric is a very special case in the backend and so it is in the UI
      // please don't even make things worse and try to format a PID.
      compact: n => n,
      detailed: n => n
    }
  },
  {
    metrics: ['tcp.established', 'tcp.opens', 'tcp.inSegs', 'tcp.outSegs'],
    labels: ['Established', 'Open/s', 'In Segments/s', 'Out Segments/s'],
    category: ['Network'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['tcp.establishedResets', 'tcp.resets', 'tcp.fails', 'tcp.errors', 'tcp.retrans'],
    labels: ['Established Resets', 'Out Resets', 'Fail', 'Error', 'Retransmission'],
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
    metric: getMetricMatch('fs', 'used'),
    label: getFilesystemLabel.bind(null, 'Used'),
    category: ['Filesystem'],
    min: 0,
    max: 1,
    formatter: percentage
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
    metric: getMetricMatch('fs', 'inodeUsage'),
    label: getFilesystemLabel.bind(null, 'Inode usage'),
    category: ['Filesystem'],
    min: 0,
    max: 1,
    formatter: percentage,
    isAvailable(snapshot) {
      return !isWindows(snapshot);
    }
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
