/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesTwoDecimalPlaces, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.f5.freeMemory'),
    metric: 'memFree',
    formatter: bytesTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.f5.cpuUsage'),
    metric: 'cpuUsed',
    formatter: percentagePlainZeroDecimalPlaces
  }
];
