/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, seconds, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['read_bytes', 'write_bytes'],
    labels: [t('in-forge:plugins.awsEbsMetricLabel.readBytes'), t('in-forge:plugins.awsEbsMetricLabel.writeBytes')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['read_ops', 'write_ops', 'queue_length'],
    labels: [
      t('in-forge:plugins.awsEbsMetricLabel.readOperations'),
      t('in-forge:plugins.awsEbsMetricLabel.writeOperations'),
      t('in-forge:plugins.awsEbsMetricLabel.queueLength')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['total_read_time', 'total_write_time', 'idle_time'],
    labels: [
      t('in-forge:plugins.awsEbsMetricLabel.totalReadTime'),
      t('in-forge:plugins.awsEbsMetricLabel.TotalWriteTime'),
      t('in-forge:plugins.awsEbsMetricLabel.idleTime')
    ],
    min: 0,
    formatter: seconds
  },
  {
    metrics: ['burst_balance'],
    labels: [t('in-forge:plugins.awsEbsMetricLabel.burstBalance')],
    min: 0,
    formatter: percentage
  }
];
