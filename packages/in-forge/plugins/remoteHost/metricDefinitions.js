/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { percentage, number, bytes, kiloBytes, siMultiplyPrefix } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

const availableCpuMetricSuffixes = {
  user: t('in-forge:plugins.host.user'),
  sys: t('in-forge:plugins.host.system'),
  wait: t('in-forge:plugins.host.wait'),
  nice: t('in-forge:plugins.host.nice'),
  steal: t('in-forge:plugins.host.steal')
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
    metrics: ['memory.swapTotal', 'memory.swapFree'],
    labels: [t('in-forge:plugins.host.swapTotal'), t('in-forge:plugins.host.swapFree')],
    category: [t('in-forge:plugins.host.memory')],
    min: 0,
    formatter: bytes
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
    metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal', 'cpu.used'],
    labels: [
      t('in-forge:plugins.host.user'),
      t('in-forge:plugins.host.system'),
      t('in-forge:plugins.host.wait'),
      t('in-forge:plugins.host.nice'),
      t('in-forge:plugins.host.steal'),
      t('in-forge:plugins.host.used')
    ],
    category: [t('in-forge:plugins.host.cpu')],
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
  }
];
