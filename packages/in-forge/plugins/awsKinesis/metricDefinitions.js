/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, millis, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'get_records_records',
    label: t('in-forge:plugins.awsKinesis.labelGetRecordsRecords'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    formatter: number
  },
  {
    metric: 'get_records_success',
    label: t('in-forge:plugins.awsKinesis.labelGetRecordsSuccess'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    formatter: number
  },
  {
    metric: 'put_records_records',
    label: t('in-forge:plugins.awsKinesis.labelPutRecordsRecords'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: number
  },
  {
    metric: 'put_record_bytes',
    label: t('in-forge:plugins.awsKinesis.labelPutRecordBytes'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'put_record_latency',
    label: t('in-forge:plugins.awsKinesis.labelPutRecordLatency'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: millis
  },
  {
    metric: 'put_record_success',
    label: t('in-forge:plugins.awsKinesis.labelPutRecordSuccess'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: percentage
  },
  {
    metric: 'put_records_success',
    label: t('in-forge:plugins.awsKinesis.labelPutRecordsSuccess'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: number
  },
  {
    metric: 'get_records_age_ms',
    label: t('in-forge:plugins.awsKinesis.labelGetRecordsAge'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: millis
  },
  {
    metric: 'get_records_latency',
    label: t('in-forge:plugins.awsKinesis.labelGetRecordsLatency'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: millis
  },
  {
    metric: 'get_records_bytes',
    label: t('in-forge:plugins.awsKinesis.labelGetRecordsTraffic'),
    category: [t('in-forge:plugins.awsKinesis.network')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'incoming_records',
    label: t('in-forge:plugins.awsKinesis.labelIncomingRecords'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: number
  },
  {
    metric: 'incoming_bytes',
    label: t('in-forge:plugins.awsKinesis.labelIncomingTraffic'),
    category: [t('in-forge:plugins.awsKinesis.network')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'put_records_latency',
    label: t('in-forge:plugins.awsKinesis.labelPutRecordsLatency'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: millis
  },
  {
    metric: 'put_records_bytes',
    label: t('in-forge:plugins.awsKinesis.labelPutRecordsTraffic'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'read_provisioned_throughput_exceeded',
    label: t('in-forge:plugins.awsKinesis.labelReadProvisionedThroughputExceeded'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: number
  },
  {
    metric: 'write_provisioned_throughput_exceeded',
    label: t('in-forge:plugins.awsKinesis.labelWriteProvisionedThroughputExceeded'),
    category: [t('in-forge:plugins.awsKinesis.records')],
    min: 0,
    formatter: number
  }
];
