/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.host.cpuUsed'),
    metric: 'cpu.used',
    formatter: percentageZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.host.memoryUsed'),
    metric: 'memory.used',
    formatter: percentageZeroDecimalPlaces
  }
];
