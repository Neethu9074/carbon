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
import { t } from 'in-i18n';

const availableCpuMetricSuffixes = {
  user: t('in-forge:plugins.host.user'),
  sys: t('in-forge:plugins.host.system'),
  wait: t('in-forge:plugins.host.wait'),
  nice: t('in-forge:plugins.host.nice'),
  steal: t('in-forge:plugins.host.steal'),
  used: t('in-forge:plugins.host.used'),
  idle: t('in-forge:plugins.host.idle')
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
    label: t('in-forge:plugins.host.free'),
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.total']);
    },
    formatter: bytes
  },
  {
    metric: 'memory.used',
    label: t('in-forge:plugins.host.used'),
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: 'memory.compUsed',
    label: t('in-forge:plugins.host.compUsed'),
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: 'memory.nonCompUsed',
    label: t('in-forge:plugins.host.nonCompUsed'),
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: 'memory.swapUsed',
    label: t('in-forge:plugins.host.swapUsed'),
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: 'memory.virtualUsed',
    label: t('in-forge:plugins.host.virtualUsed'),
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      'memory.swapTotal',
      'memory.swapFree',
      'memory.buffers',
      'memory.cached',
      'memory.available',
      'memory.virtualFree',
      'memory.virtualTotal',
      'memory.virtualActive',
      'memory.computational',
      'memory.nonComputational',
      'memory.realAvailable'
    ],
    labels: [
      t('in-forge:plugins.host.swapTotal'),
      t('in-forge:plugins.host.swapFree'),
      t('in-forge:plugins.host.buffers'),
      t('in-forge:plugins.host.cached'),
      t('in-forge:plugins.host.available'),
      t('in-forge:plugins.host.virtualFree'),
      t('in-forge:plugins.host.virtualTotal'),
      t('in-forge:plugins.host.virtualActive'),
      t('in-forge:plugins.host.computational'),
      t('in-forge:plugins.host.nonComputational'),
      t('in-forge:plugins.host.realAvailable')
    ],
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['memory.pageIn', 'memory.pageOut', 'memory.pageScan', 'memory.pageFaults', 'memory.pageReclaims'],
    labels: [
      t('in-forge:plugins.host.pageIn'),
      t('in-forge:plugins.host.pageOut'),
      t('in-forge:plugins.host.pageScan'),
      t('in-forge:plugins.host.pageFaults'),
      t('in-forge:plugins.host.pageReclaims')
    ],
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    formatter: number
  },
  {
    metric: 'load.1min',
    label: t('in-forge:plugins.host.load'),
    category: [t('in-forge:plugins.host.cpu')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ctxt',
    label: t('in-forge:plugins.host.contextSwitches'),
    category: [t('in-forge:plugins.host.cpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cpu.contextSwitches', 'cpu.deviceInterrupts'],
    labels: [t('in-forge:plugins.host.aixContextSwitches'), t('in-forge:plugins.host.aixDeviceInterrupts')],
    category: [t('in-forge:plugins.host.cpu')],
    min: 0,
    formatter: number
  },

  {
    metrics: [
      'cpu.systemCalls',
      'cpu.systemWrites',
      'cpu.nonBlockReads',
      'cpu.nonBlockWrites',
      'cpu.logicalBlockReads',
      'cpu.logicalBlockWrites'
    ],
    labels: [
      t('in-forge:plugins.host.systemCalls'),
      t('in-forge:plugins.host.systemWrites'),
      t('in-forge:plugins.host.nonBlockReads'),
      t('in-forge:plugins.host.nonBlockWrites'),
      t('in-forge:plugins.host.logicalBlockReads'),
      t('in-forge:plugins.host.logicalBlockWrites')
    ],
    category: [t('in-forge:plugins.host.cpu')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal', 'cpu.used', 'cpu.idle', 'cpu.hypv'],
    labels: [
      t('in-forge:plugins.host.user'),
      t('in-forge:plugins.host.system'),
      t('in-forge:plugins.host.wait'),
      t('in-forge:plugins.host.nice'),
      t('in-forge:plugins.host.steal'),
      t('in-forge:plugins.host.used'),
      t('in-forge:plugins.host.idle'),
      t('in-forge:plugins.host.hypv')
    ],
    category: [t('in-forge:plugins.host.cpu')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: 'openFiles.current',
    label: t('in-forge:plugins.host.current'),
    category: [t('in-forge:plugins.host.openFiles')],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'openFiles.max']);
    },
    formatter: number
  },
  {
    metric: 'openFiles.used',
    label: t('in-forge:plugins.host.used'),
    category: [t('in-forge:plugins.host.openFiles')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['topPID'],
    labels: [t('in-forge:plugins.host.topPid')],
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
    labels: [
      t('in-forge:plugins.host.established'),
      t('in-forge:plugins.host.openS'),
      t('in-forge:plugins.host.inSegmentsS'),
      t('in-forge:plugins.host.outSegmentsS')
    ],
    category: [t('in-forge:plugins.host.network')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['tcp.establishedResets', 'tcp.resets', 'tcp.fails', 'tcp.errors', 'tcp.retrans'],
    labels: [
      t('in-forge:plugins.host.establishedResets'),
      t('in-forge:plugins.host.outResets'),
      t('in-forge:plugins.host.fail'),
      t('in-forge:plugins.host.error'),
      t('in-forge:plugins.host.retransmission')
    ],
    category: [t('in-forge:plugins.host.network')],
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
    category: [t('in-forge:plugins.host.cpu')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('fs', 'free', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('Free'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'free', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('Free'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs', 'used', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('Used'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'used', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('Mount'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('fs', 'leaked', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('Leaked'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'leaked', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('Leaked'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: getMaxFilesystemCapacity,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs', 'inodeUsage', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('Inode usage'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'inodeUsage', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('Inode usage'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('fs', 'ifree', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('iFree'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: getMaxFilesystemICapacity,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'ifree', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('iFree'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    max: getMaxFilesystemICapacity,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs', 'reads', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('Reads/s'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'reads', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('Reads/s'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs', 'writes', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('Writes/s'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'writes', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('Writes/s'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    formatter: siMultiplyPrefix
  },
  {
    metric: getDynamicMetricMatch('fs', 'readBytes', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('Bytes Read/s'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'readBytes', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('Bytes Read/s'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs', 'writeBytes', t('in-forge:plugins.host.device')),
    label: getFilesystemLabel('Bytes Written/s'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    formatter: kiloBytes
  },
  {
    metric: getDynamicMetricMatch('fs_mount', 'writeBytes', t('in-forge:plugins.host.mount')),
    label: getFilesystemLabel('Bytes Written/s'),
    category: [t('in-forge:plugins.host.filesystem')],
    min: 0,
    formatter: kiloBytes
  },
  {
    metrics: [
      getDynamicMetricMatch('gpus', 'gpuUtilization', t('in-forge:plugins.host.gpuUuid')),
      getDynamicMetricMatch('gpus', 'temperature', t('in-forge:plugins.host.gpuUuid'))
    ],
    labels: [t('in-forge:plugins.host.gpuUsage'), t('in-forge:plugins.host.temperature')],
    category: [t('in-forge:plugins.host.gpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('gpus', 'encoderUtilization', t('in-forge:plugins.host.gpuUuid')),
      getDynamicMetricMatch('gpus', 'decoderUtilization', t('in-forge:plugins.host.gpuUuid')),
      getDynamicMetricMatch('gpus', 'memoryUtilization', t('in-forge:plugins.host.gpuUuid'))
    ],
    labels: [
      t('in-forge:plugins.host.encoder'),
      t('in-forge:plugins.host.decoder'),
      t('in-forge:plugins.host.memoryUsed')
    ],
    category: [t('in-forge:plugins.host.gpu')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('gpus', 'transmitted', t('in-forge:plugins.host.gpuUuid')),
      getDynamicMetricMatch('gpus', 'received', t('in-forge:plugins.host.gpuUuid'))
    ],
    labels: [t('in-forge:plugins.host.transmittedS'), t('in-forge:plugins.host.receivedS')],
    category: [t('in-forge:plugins.host.gpu')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  }
];
