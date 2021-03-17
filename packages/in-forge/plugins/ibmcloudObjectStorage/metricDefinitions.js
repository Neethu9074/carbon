/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['object_count_total'],
    labels: [t('in-forge:plugins.ibmcloudObjectStorage.totalObjectCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['used_bytes_total'],
    labels: [t('in-forge:plugins.ibmcloudObjectStorage.totalUsedBytes')],
    min: 0,
    category: [t('in-forge:plugins.ibmcloudObjectStorage.memory')],
    formatter: bytes
  }
];
