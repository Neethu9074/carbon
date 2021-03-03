/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['cpu.system_usage', 'cpu.user_usage'],
    labels: [t('in-forge:plugins.lxc.kernelTime', 'Kernel time'), t('in-forge:plugins.lxc.userTime', 'User time')],
    min: 0,
    category: [t('in-forge:plugins.lxc.cpu', 'CPU')],
    formatter: percentage
  },
  {
    metrics: ['memory.usedPercentage', 'memory.swapPercentage'],
    labels: [
      t('in-forge:plugins.lxc.usedPercentage', 'Used percentage'),
      t('in-forge:plugins.lxc.swapPercentage', 'Swap percentage')
    ],
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.lxc.memory', 'Memory')],
    formatter: percentage
  },
  {
    metrics: [
      'memory.usage',
      'memory.rss',
      'memory.cache',
      'memory.swap',
      'memory.active_anon',
      'memory.active_file',
      'memory.inactive_anon',
      'memory.inactive_file'
    ],
    labels: [
      t('in-forge:plugins.lxc.usage', 'Usage'),
      t('in-forge:plugins.lxc.maxUsage', 'Max usage'),
      t('in-forge:plugins.lxc.rss', 'RSS'),
      t('in-forge:plugins.lxc.cache', 'Cache'),
      t('in-forge:plugins.lxc.swap', 'Swap'),
      t('in-forge:plugins.lxc.activeAnonymous', 'Active anonymous'),
      t('in-forge:plugins.lxc.activeCache', 'Active cache'),
      t('in-forge:plugins.lxc.inactiveAnonymous', 'Inactive anonymous'),
      t('in-forge:plugins.lxc.inactiveCache', 'Inactive cache')
    ],
    min: 0,
    category: [t('in-forge:plugins.lxc.memory', 'Memory')],
    formatter: bytes
  },
  {
    metrics: ['memory.usedPercentage', 'memory.swapPercentage'],
    labels: [
      t('in-forge:plugins.lxc.userPercentage', 'User percentage'),
      t('in-forge:plugins.lxc.swapPercentage', 'Swap percentage')
    ],
    min: 0,
    category: [t('in-forge:plugins.lxc.memory', 'Memory')],
    formatter: percentage
  },
  {
    metrics: ['network.rxBytes', 'network.txBytes'],
    labels: [
      t('in-forge:plugins.lxc.receivedBytes', 'Received Bytes'),
      t('in-forge:plugins.lxc.transmittedBytes', 'Transmitted Bytes')
    ],
    min: 0,
    category: [t('in-forge:plugins.lxc.network', 'Network')],
    formatter: bytes
  },
  {
    metrics: ['network.rxPackets', 'network.txPackets'],
    labels: [
      t('in-forge:plugins.lxc.receivedPackets', 'Received Packets'),
      t('in-forge:plugins.lxc.transmittedPackets', 'Transmitted Packets')
    ],
    min: 0,
    category: [t('in-forge:plugins.lxc.network', 'Network')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('filesystems', 'usedPercentage', 'Device'),
    label: t('in-forge:plugins.lxc.usedPercentage', 'Used percentage'),
    category: [t('in-forge:plugins.lxc.filesystems', 'Filesystems')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('filesystems', 'used', 'Device'),
      getDynamicMetricMatch('filesystems', 'free', 'Device')
    ],
    labels: [t('in-forge:plugins.lxc.used', 'Used'), t('in-forge:plugins.lxc.free', 'Free')],
    min: 0,
    category: [t('in-forge:plugins.lxc.filesystems', 'Filesystems')],
    formatter: bytes
  }
];
