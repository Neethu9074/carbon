/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesTwoDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.pythonRuntimePlatform.timeSpentInUserModeKpiLabel'),
    metric: 'metrics.ru_utime',
    formatter: timeByMillisTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.pythonRuntimePlatform.sharedMemorySize'),
    metric: 'metrics.ru_ixrss',
    formatter: bytesTwoDecimalPlaces
  }
];
