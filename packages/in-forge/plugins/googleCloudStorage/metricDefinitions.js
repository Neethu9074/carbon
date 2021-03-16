/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'api.request_count',
      'storage.object_count',
      'api.request_count2.ReadObject',
      'api.request_count2.WriteObject'
    ],
    labels: [
      t('in-forge:plugins.googleCloudStorage.requestCount'),
      t('in-forge:plugins.googleCloudStorage.objectsCount')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['storage.total_bytes', 'network.sent_bytes_count', 'network.received_bytes_count'],
    labels: [
      t('in-forge:plugins.googleCloudStorage.objectsSize'),
      t('in-forge:plugins.googleCloudStorage.sentBytes'),
      t('in-forge:plugins.googleCloudStorage.receivedBytes')
    ],
    min: 0,
    formatter: bytes.detailed
  }
];
