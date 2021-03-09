/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'duration',
    label: t('in-forge:plugins.ping.duration'),
    category: [t('in-forge:plugins.ping.ping')],
    min: 0,
    formatter: millis
  },
  {
    metric: 'status',
    label: t('in-forge:plugins.ping.statusOfPing'),
    min: 0,
    formatter: number
  }
];
