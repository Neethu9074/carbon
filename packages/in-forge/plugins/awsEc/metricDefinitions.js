/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage, bytes } from 'in-services/formatters/number';

export default [
  {
    metric: 'cpu_utilization',
    label: t('in-forge:plugins.awsEc.labelCPUUtilization'),
    category: [t('in-forge:plugins.awsEc.cpu')],
    formatter: percentage
  },
  {
    metric: 'freeable_memory',
    label: t('in-forge:plugins.awsEc.labelFreeableMemory'),
    category: [t('in-forge:plugins.awsEc.memory')],
    formatter: bytes
  },
  {
    metric: 'net_bytes_in',
    label: t('in-forge:plugins.awsEc.labelBytesIn'),
    category: [t('in-forge:plugins.awsEc.network')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'net_bytes_out',
    label: t('in-forge:plugins.awsEc.labelBytesOutUp'),
    category: [t('in-forge:plugins.awsEc.network')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'swap_usage',
    label: t('in-forge:plugins.awsEc.labelSwapUsage'),
    category: [t('in-forge:plugins.awsEc.disk')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'curr_connections',
    label: t('in-forge:plugins.awsEc.labelCurrentConnections'),
    category: [t('in-forge:plugins.awsEc.network')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'new_connections',
    label: t('in-forge:plugins.awsEc.labelNewConnections'),
    category: [t('in-forge:plugins.awsEc.network')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'curr_items',
    label: t('in-forge:plugins.awsEc.labelCurrentItems'),
    category: [],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'evictions',
    label: t('in-forge:plugins.awsEc.labelEvictions'),
    category: [],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'reclaimed',
    label: t('in-forge:plugins.awsEc.labelReclaimed'),
    category: [],
    min: 0,
    formatter: number.compact
  }
];
