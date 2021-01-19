/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['cpu.system_usage', 'cpu.user_usage'],
    labels: ['Kernel time', 'User time'],
    min: 0,
    category: ['CPU'],
    formatter: percentage
  },
  {
    metrics: ['memory.usedPercentage', 'memory.swapPercentage'],
    labels: ['Used percentage', 'Swap percentage'],
    min: 0,
    max: 1,
    category: ['Memory'],
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
  },
  {
    metric: getDynamicMetricMatch('filesystems', 'usedPercentage', 'Device'),
    label: 'Used percentage',
    category: ['Filesystems'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('filesystems', 'used', 'Device'),
      getDynamicMetricMatch('filesystems', 'free', 'Device')
    ],
    labels: ['Used', 'Free'],
    min: 0,
    category: ['Filesystems'],
    formatter: bytes
  }
];
