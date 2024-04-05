/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytesZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmCos.labelTotalObjectCount'),
    metric: 'object_count_total',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmCos.labelTotalUsed'),
    metric: 'used_bytes_total',
    formatter: bytesZeroDecimalPlaces
  }
];
