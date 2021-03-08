/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['request_count'],
    labels: [t('in-forge:plugins.googleCloudDatastore.requests')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudDatastore.requests')],
    formatter: number.compact
  },
  {
    metrics: ['entity_read_sizes_avg'],
    labels: [t('in-forge:plugins.googleCloudDatastore.entityReadAverage')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudDatastore.entityRead')],
    formatter: bytes.detailed
  },
  {
    metrics: ['entity_write_sizes_avg'],
    labels: [t('in-forge:plugins.googleCloudDatastore.entityWriteAverage')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudDatastore.entityWrite')],
    formatter: bytes.detailed
  },
  {
    metrics: ['index_write_count'],
    labels: [t('in-forge:plugins.googleCloudDatastore.indexWrites')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudDatastore.indexWrites')],
    formatter: number.compact
  }
];
