/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.googleCloudStorage.requestsPerSecond'),
    metric: 'api.request_count',
    formatter: number.detailed
  },
  {
    label: t('in-forge:plugins.googleCloudStorage.objectsCount'),
    metric: 'storage.object_count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.googleCloudStorage.objectsSize'),
    metric: 'storage.total_bytes',
    formatter: bytesZeroDecimalPlaces
  }
];
