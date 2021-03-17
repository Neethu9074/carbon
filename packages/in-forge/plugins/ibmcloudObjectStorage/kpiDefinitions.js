/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmcloudObjectStorage.totalObjectCount'),
    metric: 'object_count_total',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmcloudObjectStorage.totalUsedBytes'),
    metric: 'used_bytes_total',
    formatter: zeroDecimalPlaces
  }
];
