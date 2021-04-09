/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpu.system_usage', 'cpu.user_usage'],
    labels: [t('in-forge:plugins.lxc.kernelTime'), t('in-forge:plugins.lxc.userTime')],
    min: 0,
    category: [t('in-forge:plugins.lxc.cpu')],
    formatter: percentage
  },
  {
    metrics: ['memory.usedPercentage', 'memory.swapPercentage'],
    labels: [t('in-forge:plugins.lxc.usedPercentage'), t('in-forge:plugins.lxc.swapPercentage')],
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.lxc.memory')],
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
      t('in-forge:plugins.lxc.usage'),
      t('in-forge:plugins.lxc.maxUsage'),
      t('in-forge:plugins.lxc.rss'),
      t('in-forge:plugins.lxc.cache'),
      t('in-forge:plugins.lxc.swap'),
      t('in-forge:plugins.lxc.activeAnonymous'),
      t('in-forge:plugins.lxc.activeCache'),
      t('in-forge:plugins.lxc.inactiveAnonymous'),
      t('in-forge:plugins.lxc.inactiveCache')
    ],
    min: 0,
    category: [t('in-forge:plugins.lxc.memory')],
    formatter: bytes
  },
  {
    metrics: ['memory.usedPercentage', 'memory.swapPercentage'],
    labels: [t('in-forge:plugins.lxc.userPercentage'), t('in-forge:plugins.lxc.swapPercentage')],
    min: 0,
    category: [t('in-forge:plugins.lxc.memory')],
    formatter: percentage
  },
  {
    metrics: ['network.rxBytes', 'network.txBytes'],
    labels: [t('in-forge:plugins.lxc.receivedBytes'), t('in-forge:plugins.lxc.transmittedBytes')],
    min: 0,
    category: [t('in-forge:plugins.lxc.network')],
    formatter: bytes
  },
  {
    metrics: ['network.rxPackets', 'network.txPackets'],
    labels: [t('in-forge:plugins.lxc.receivedPackets'), t('in-forge:plugins.lxc.transmittedPackets')],
    min: 0,
    category: [t('in-forge:plugins.lxc.network')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('filesystems', 'usedPercentage', t('in-forge:plugins.lxc.device')),
    label: t('in-forge:plugins.lxc.usedPercentage'),
    category: [t('in-forge:plugins.lxc.filesystems')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('filesystems', 'used', t('in-forge:plugins.lxc.device')),
      getDynamicMetricMatch('filesystems', 'free', t('in-forge:plugins.lxc.device'))
    ],
    labels: [t('in-forge:plugins.lxc.used'), t('in-forge:plugins.lxc.free')],
    min: 0,
    category: [t('in-forge:plugins.lxc.filesystems')],
    formatter: bytes
  }
];
