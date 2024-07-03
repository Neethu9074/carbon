/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { zeroDecimalPlaces, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['successful_request_latency_min', 'successful_request_latency_max', 'successful_request_latency_avg'],
    labels: [
      t('in-forge:plugins.awsTimestream.labelSuccessfulRequestLatencyMin'),
      t('in-forge:plugins.awsTimestream.labelSuccessfulRequestLatencyMax'),
      t('in-forge:plugins.awsTimestream.labelSuccessfulRequestLatencyAvg')
    ],
    category: [t('in-forge:plugins.awsTimestream.category.requestLatency')],
    formatter: millis.detailed,
    min: 0
  },
  {
    metrics: ['successful_request_latency_sample_count'],
    labels: [t('in-forge:plugins.awsTimestream.labelSuccessfulRequestLatencySampleCount')],
    category: [t('in-forge:plugins.awsTimestream.category.requestLatency')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      'magnetic_store_rejected_record_count',
      'active_magnetic_store_partitions',
      'magnetic_store_rejected_upload_user_failures',
      'magnetic_store_rejected_upload_system_failures'
    ],
    labels: [
      t('in-forge:plugins.awsTimestream.labelMagneticStoreRejectedRecordCount'),
      t('in-forge:plugins.awsTimestream.labelActiveMagneticStorePartitions'),
      t('in-forge:plugins.awsTimestream.labelMagneticStoreRejectedUploadUserFailures'),
      t('in-forge:plugins.awsTimestream.labelMagneticStoreRejectedUploadSystemFailures')
    ],
    category: [t('in-forge:plugins.awsTimestream.category.writingAndStorage')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['magnetic_store_pending_records_latency'],
    labels: [t('in-forge:plugins.awsTimestream.labelMagneticStorePendingRecordLatency')],
    category: [t('in-forge:plugins.awsTimestream.category.writingAndStorage')],
    formatter: millis.detailed,
    min: 0
  }
];
