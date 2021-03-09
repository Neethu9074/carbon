/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.etcd.receivedRequests'),
    metric: 'requests_received',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.etcd.receivedBytesSecond'),
    metric: 'bytes_per_sec_received',
    formatter: bytesZeroDecimalPlaces
  }
];
