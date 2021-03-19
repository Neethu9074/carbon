/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number, bytes, kiloBytes, nanos, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['average_cpu_usage_percentage'],
    labels: [t('in-forge:plugins.iBMVSI.labelAverageCPUUsedPercent')],
    min: 0,
    category: ['CPU'],
    formatter: percentage
  },
  {
    metrics: ['total_cpu_usage_nanoseconds'],
    labels: [t('in-forge:plugins.iBMVSI.labelTotalUsed')],
    min: 0,
    category: ['CPU'],
    formatter: nanos
  },
  {
    metrics: ['count'],
    labels: [t('in-forge:plugins.iBMVSI.labelTotalCPUCount')],
    min: 0,
    category: ['CPU'],
    formatter: number
  },
  {
    metrics: ['memory_free_kib'],
    labels: [t('in-forge:plugins.iBMVSI.labelMemoryFree')],
    min: 0,
    category: ['Memory'],
    formatter: kiloBytes
  },
  {
    metrics: ['memory_total_kib'],
    labels: [t('in-forge:plugins.iBMVSI.labelMemoryTotal')],
    min: 0,
    category: ['Memory'],
    formatter: kiloBytes
  },
  {
    metrics: ['memory_usage_percentage'],
    labels: [t('in-forge:plugins.iBMVSI.labelMemoryUsedPercent')],
    min: 0,
    category: ['Memory'],
    formatter: percentage
  },
  {
    metrics: ['memory_used_kib'],
    labels: [t('in-forge:plugins.iBMVSI.labelMemoryUsed')],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['network_in_bytes'],
    labels: [t('in-forge:plugins.iBMVSI.labelNetworkIn')],
    min: 0,
    category: ['Network'],
    formatter: bytes
  },
  {
    metrics: ['network_in_packets'],
    labels: [t('in-forge:plugins.iBMVSI.labelNetworkInPackets')],
    min: 0,
    category: ['Network'],
    formatter: number
  },
  {
    metrics: ['network_out_bytes'],
    labels: [t('in-forge:plugins.iBMVSI.labelNetworkOut')],
    min: 0,
    category: ['Network'],
    formatter: bytes
  },
  {
    metrics: ['network_out_packets'],
    labels: [t('in-forge:plugins.iBMVSI.labelNetworkOutPackets')],
    min: 0,
    category: ['Network'],
    formatter: number
  },
  {
    metrics: ['volume_read_bytes'],
    labels: [t('in-forge:plugins.iBMVSI.labelVolumeRead')],
    min: 0,
    category: ['Volume'],
    formatter: bytes
  },
  {
    metrics: ['volume_read_requests'],
    labels: [t('in-forge:plugins.iBMVSI.labelVolumeReadPackets')],
    min: 0,
    category: ['Volume'],
    formatter: number
  },
  {
    metrics: ['volume_write_bytes'],
    labels: [t('in-forge:plugins.iBMVSI.labelVolumeWrite')],
    min: 0,
    category: ['Volume'],
    formatter: bytes
  },
  {
    metrics: ['volume_write_requests'],
    labels: [t('in-forge:plugins.iBMVSI.labelVolumeWriteRequests')],
    min: 0,
    category: ['Volume'],
    formatter: number
  }
];
