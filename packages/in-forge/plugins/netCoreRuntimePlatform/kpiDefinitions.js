/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.netCoreRuntimePlatform.exceptionsThrown'),
    metric: 'metrics.exceptionThrownCount',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.netCoreRuntimePlatform.contentionCount'),
    metric: 'metrics.contentionCount',
    formatter: zeroDecimalPlaces
  }
];
