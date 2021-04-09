/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['object_count_total'],
    labels: [t('in-forge:plugins.ibmCos.labelTotalObjectCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['used_bytes_total'],
    labels: [t('in-forge:plugins.ibmCos.labelTotalUsed')],
    min: 0,
    category: [t('in-forge:plugins.ibmCos.labelMemory')],
    formatter: bytes
  }
];
