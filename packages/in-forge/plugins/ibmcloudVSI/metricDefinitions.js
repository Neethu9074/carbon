/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['average_cpu_usage_percentage'],
    labels: [t('in-forge:plugins.ibmcloudVSI.totalObjectCount')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['total_cpu_usage_nanoseconds'],
    labels: [t('in-forge:plugins.ibmcloudVSI.totalUsedBytes')],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.cpu')],
    formatter: number
  },
  {
    metrics: ['count'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.cpu')],
    formatter: number
  },
  {
    metrics: ['memory_free_kib'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.memory')],
    formatter: bytes
  },
  {
    metrics: ['memory_total_kib'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.memory')],
    formatter: bytes
  },
  {
    metrics: ['memory_usage_percentage'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.memory')],
    formatter: percentage
  },
  {
    metrics: ['memory_used_kib'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.memory')],
    formatter: bytes
  },
  {
    metrics: ['network_in_bytes'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.network')],
    formatter: bytes
  },
  {
    metrics: ['network_in_packets'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.network')],
    formatter: number
  },
  {
    metrics: ['network_out_bytes'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.network')],
    formatter: bytes
  },
  {
    metrics: ['network_out_packets'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.network')],
    formatter: number
  },
  {
    metrics: ['volume_read_bytes'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.network')],
    formatter: bytes
  },
  {
    metrics: ['volume_read_requests'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.network')],
    formatter: number
  },
  {
    metrics: ['volume_write_bytes'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.network')],
    formatter: bytes
  },
  {
    metrics: ['volume_write_requests'],
    labels: [''],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudVSI.network')],
    formatter: number
  }
];
