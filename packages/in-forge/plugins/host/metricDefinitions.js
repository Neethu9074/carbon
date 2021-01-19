/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  percentage,
  number,
  bytes,
  kiloBytes,
  siMultiplyPrefix,
  bytesPerSecondTwoDecimalPlaces
} from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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

function getFilesystemLabel(prefix) {
  return (snapshot, match) => (match?.length > 1 ? `${prefix} ${match[1]}` : prefix);
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
    metrics: ['memory.swapTotal', 'memory.swapFree', 'memory.buffers', 'memory.cached', 'memory.available'],
    labels: ['Swap total', 'Swap free', 'Buffers', 'Cached', 'Available'],
    category: ['Memory'],
    min: 0,
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
    metric: 'ctxt',
    label: 'Context Switches',
    category: ['CPU'],
    min: 0,
    formatter: number
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
    formatter: number
  },
  {
    metric: 'openFiles.used',
    label: 'Used',
    category: ['Open Files'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['topPID'],
    labels: ['Top PID'],
    min: 0,
    hideInMetricSelector: true,
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
    metric: getDynamicMetricMatch('fs', 'free', 'Device'),
    label: getFilesystemLabel('Free'),
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs', 'used', 'Device'),
    label: getFilesystemLabel('Used'),
    category: ['Filesystem'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('fs', 'leaked', 'Device'),
    label: getFilesystemLabel('Leaked'),
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs', 'inodeUsage', 'Device'),
    label: getFilesystemLabel('Inode usage'),
    category: ['Filesystem'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('fs', 'ifree', 'Device'),
    label: getFilesystemLabel('iFree'),
    category: ['Filesystem'],
    min: 0,
    max: getMaxFilesystemICapacity,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs', 'reads', 'Device'),
    label: getFilesystemLabel('Reads/s'),
    category: ['Filesystem'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs', 'writes', 'Device'),
    label: getFilesystemLabel('Writes/s'),
    category: ['Filesystem'],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs', 'readBytes', 'Device'),
    label: getFilesystemLabel('Bytes Read/s'),
    category: ['Filesystem'],
    min: 0,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs', 'writeBytes', 'Device'),
    label: getFilesystemLabel('Bytes Written/s'),
    category: ['Filesystem'],
    min: 0,
    formatter: kiloBytes
  },
  {
    metrics: [
      getDynamicMetricMatch('gpus', 'gpuUtilization', 'GPU UUID'),
      getDynamicMetricMatch('gpus', 'temperature', 'GPU UUID')
    ],
    labels: ['GPU Usage', 'Temperature'],
    category: ['GPU'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('gpus', 'encoderUtilization', 'GPU UUID'),
      getDynamicMetricMatch('gpus', 'decoderUtilization', 'GPU UUID'),
      getDynamicMetricMatch('gpus', 'memoryUtilization', 'GPU UUID')
    ],
    labels: ['Encoder', 'Decoder', 'Memory Used'],
    category: ['GPU'],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('gpus', 'transmitted', 'GPU UUID'),
      getDynamicMetricMatch('gpus', 'received', 'GPU UUID')
    ],
    labels: ['Transmitted/s', 'Received/s'],
    category: ['GPU'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  }
];
