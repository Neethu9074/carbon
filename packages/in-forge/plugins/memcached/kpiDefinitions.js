/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.memcached.gets'),
    metric: 'cmd_get',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.memcached.sets'),
    metric: 'cmd_set',
    formatter: zeroDecimalPlaces
  }
];
